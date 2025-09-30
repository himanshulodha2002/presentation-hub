"use server";

import { uploadImageFromUrl, uploadPlaceholderImage } from "@/lib/blob";
import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./user";

/**
 * Generate and store a thumbnail for a project
 * If no thumbnail exists, fetches a placeholder from Unsplash and stores in Vercel Blob
 */
export async function generateProjectThumbnail(
  projectId: string,
  customImageUrl?: string
) {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    // Check if project exists and belongs to user
    const project = await client.project.findFirst({
      where: {
        id: projectId,
        userId: checkUser.user.id,
      },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    // If thumbnail already exists, return it
    if (project.thumbnail) {
      return { status: 200, thumbnailUrl: project.thumbnail };
    }

    // Generate or upload thumbnail
    let uploadResult;
    
    if (customImageUrl) {
      // Upload from custom URL
      uploadResult = await uploadImageFromUrl(
        customImageUrl,
        `thumbnail-${projectId}`
      );
    } else {
      // Generate placeholder based on project title
      const query = project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ",") + ",presentation,slides";
      uploadResult = await uploadPlaceholderImage(query, `thumbnail-${projectId}`);
    }

    if ("error" in uploadResult) {
      return {
        status: 500,
        error: "Failed to generate thumbnail",
        details: uploadResult.error,
      };
    }

    // Update project with thumbnail URL
    const updatedProject = await client.project.update({
      where: { id: projectId },
      data: { thumbnail: uploadResult.url },
    });

    return {
      status: 200,
      thumbnailUrl: updatedProject.thumbnail,
      message: "Thumbnail generated successfully",
    };
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return {
      status: 500,
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Batch generate thumbnails for projects without them
 */
export async function generateMissingThumbnails() {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    // Find all projects without thumbnails
    const projectsWithoutThumbnails = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        thumbnail: null,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (projectsWithoutThumbnails.length === 0) {
      return {
        status: 200,
        message: "All projects already have thumbnails",
        count: 0,
      };
    }

    // Generate thumbnails in parallel (limited to 5 at a time to avoid rate limits)
    const batchSize = 5;
    const results = [];

    for (let i = 0; i < projectsWithoutThumbnails.length; i += batchSize) {
      const batch = projectsWithoutThumbnails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((project) => generateProjectThumbnail(project.id))
      );
      results.push(...batchResults);

      // Small delay between batches to avoid overwhelming the API
      if (i + batchSize < projectsWithoutThumbnails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter((r) => r.status === 200).length;

    return {
      status: 200,
      message: `Generated ${successCount} thumbnails`,
      count: successCount,
      total: projectsWithoutThumbnails.length,
    };
  } catch (error) {
    console.error("Error generating thumbnails:", error);
    return {
      status: 500,
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Update project thumbnail with a new image
 */
export async function updateProjectThumbnail(
  projectId: string,
  imageUrl: string
) {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser.status !== 200 || !checkUser.user) {
      return { status: 403, error: "User not authenticated" };
    }

    // Check if project exists and belongs to user
    const project = await client.project.findFirst({
      where: {
        id: projectId,
        userId: checkUser.user.id,
      },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    // Upload new image
    const uploadResult = await uploadImageFromUrl(
      imageUrl,
      `thumbnail-${projectId}`
    );

    if ("error" in uploadResult) {
      return {
        status: 500,
        error: "Failed to upload thumbnail",
        details: uploadResult.error,
      };
    }

    // Update project
    const updatedProject = await client.project.update({
      where: { id: projectId },
      data: { thumbnail: uploadResult.url },
    });

    return {
      status: 200,
      thumbnailUrl: updatedProject.thumbnail,
      message: "Thumbnail updated successfully",
    };
  } catch (error) {
    console.error("Error updating thumbnail:", error);
    return {
      status: 500,
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
