import { Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import React from "react";
import MasterRecursiveComponent from "../../editor/MasterRecursiveComponent";

type Props = {
    slide: Slide;
    isActive: boolean;
    index?: number;
};

const ScaledPreview = ({ isActive, slide, index }: Props) => {
    const { currentTheme } = useSlideStore();

    return (
        <div className="relative">
            {/* Slide number badge */}
            {index !== undefined && (
                <div className={cn(
                    "absolute -left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-md text-xs font-semibold shadow-md",
                    isActive 
                        ? "bg-blue-500 text-white" 
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                )}>
                    {index + 1}
                </div>
            )}
            <div
                className={cn(
                    "w-full relative aspect-video rounded-lg overflow-hidden transition-all duration-200 p-2 shadow-md",
                    isActive
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 hover:ring-offset-2"
                )}
                style={{
                    fontFamily: currentTheme.fontFamily,
                    color: currentTheme.accentColor,
                    backgroundColor: currentTheme.slideBackgroundColor,
                    backgroundImage: currentTheme.gradientBackground,
                }}
            >
                <div className="scale-[0.5] origin-top-left overflow-hidden size-[200%]">
                    <MasterRecursiveComponent
                        slideId={slide.id}
                        content={slide.content}
                        onContentChange={() => { }}
                        isPreview={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScaledPreview;