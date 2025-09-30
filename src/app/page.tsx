import { getAllProjects, getRecentProjects } from "@/actions/project";
import { onAuthenticateUser } from "@/actions/user";
import AppSidebar from "@/components/global/app-sidebar";
import NotFound from "@/components/global/not-found";
import Projects from "@/components/global/projects";
import UpperInfoBar from "@/components/global/upper-info-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import React from "react";

const RootPage = async () => {
    // Check if user is authenticated
    const checkUser = await onAuthenticateUser();
    if (!checkUser.user) {
        redirect("/sign-in");
    }

    // Get projects and recent projects for the dashboard
    const allProjects = await getAllProjects();
    const recentProjects = await getRecentProjects();

    return (
        <SidebarProvider>
            <AppSidebar
                user={checkUser.user}
                recentProjects={recentProjects.data || []}
            />
            <SidebarInset>
                <UpperInfoBar user={checkUser.user} />
                <div className="p-4">
                    <div className="w-full flex flex-col gap-6 relative md:p-0 p-4">
                        <div className="flex flex-col-reverse items-start w-full gap-6 sm:flex-row sm:justify-between sm:items-center">
                            <div className="flex flex-col items-start">
                                <h1 className="text-2xl font-semibold dark:text-primary backdrop-blur-lg">
                                    Projects
                                </h1>
                                <p className="text-base font-normal dark:text-secondary">
                                    All of your work in one place
                                </p>
                            </div>
                        </div>

                        {allProjects.data && allProjects.data.length > 0 ? (
                            <Projects projects={allProjects.data} />
                        ) : (
                            <NotFound />
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default RootPage;
