"use client";
import { getProjectById } from "@/actions/project";
import { AddSlideButton } from "@/components/global/editor/AddSlideButton";
import { FormattingToolbar } from "@/components/global/editor/FormattingToolbar";
import { QuickAccessToolbar } from "@/components/global/editor/QuickAccessToolbar";
import { SlideNotesPanel } from "@/components/global/editor/SlideNotesPanel";
import { StatusBar } from "@/components/global/editor/StatusBar";
import { themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import Navbar from "./_components/Navbar/Navbar";
import LayoutPreview from "./_components/editor-sidebar/leftSidebar/LayoutPreview";
import EditorSidebar from "./_components/editor-sidebar/rightSidebar";
import Editor from "./_components/editor/Editor";

const Page = () => {
  const params = useParams();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showNotes, setShowNotes] = useState(false);
  const { currentTheme, setCurrentTheme, setSlides, setProject } =
    useSlideStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProjectById(params.presentationId as string);
        if (res.status !== 200 || !res.data) {
          toast.error("Error", {
            description: "Project not found",
          });
          return redirect("/dashboard");
        }
        const findTheme = themes.find(
          (theme) => theme.name === res.data.themeName
        );
        setCurrentTheme(findTheme || themes[0]);
        setTheme(findTheme?.type === "dark" ? "dark" : "light");
        setProject(res.data);
        setSlides(JSON.parse(JSON.stringify(res.data.slides)));
      } catch (err) {
        void err;
        toast.error("Error", { description: "An unexpected error occured" });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.presentationId, setCurrentTheme, setProject, setSlides, setTheme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleToggleNotes = () => {
    setShowNotes(!showNotes);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          presentationId={params.presentationId as string} 
          onToggleNotes={handleToggleNotes}
        />
        <FormattingToolbar />
        <QuickAccessToolbar />
        <div
          className="flex-1 flex flex-col overflow-hidden pt-36 pb-8"
          style={{
            color: currentTheme.accentColor,
            fontFamily: currentTheme.fontFamily,
            backgroundColor: currentTheme.backgroundColor,
          }}
        >
          <div className="flex-1 flex overflow-hidden">
            <LayoutPreview />
            <div className="flex-1 ml-64 ">
              <Editor isEditable={true} zoom={zoom} />
            </div>
            <EditorSidebar />
          </div>
          <SlideNotesPanel 
            isVisible={showNotes} 
            onClose={() => setShowNotes(false)} 
          />
        </div>
        <AddSlideButton />
        <StatusBar zoom={zoom} onZoomChange={handleZoomChange} />
      </div>
    </DndProvider>
  );
};

export default Page;