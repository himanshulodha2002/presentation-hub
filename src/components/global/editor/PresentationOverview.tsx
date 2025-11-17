"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSlideStore } from "@/store/useSlideStore"
import { cn } from "@/lib/utils"
import { LayoutGrid } from "lucide-react"
import React from "react"
import MasterRecursiveComponent from "@/app/(protected)/presentation/[presentationId]/_components/editor/MasterRecursiveComponent"

interface PresentationOverviewProps {
    onSlideClick?: (index: number) => void
}

export const PresentationOverview: React.FC<PresentationOverviewProps> = ({
    onSlideClick,
}) => {
    const { getOrderedSlides, currentSlide, setCurrentSlide, currentTheme } =
        useSlideStore()
    const slides = getOrderedSlides()

    const handleSlideClick = (index: number) => {
        setCurrentSlide(index)
        onSlideClick?.(index)
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <h3 className="text-sm font-medium">Overview</h3>
            </div>
            <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-2 gap-3">
                    {slides.map((slide, index) => (
                        <Button
                            key={slide.id}
                            variant="ghost"
                            className={cn(
                                "h-auto p-2 relative hover:bg-accent",
                                index === currentSlide && "ring-2 ring-primary"
                            )}
                            onClick={() => handleSlideClick(index)}
                        >
                            <div className="w-full">
                                {/* Slide number badge */}
                                <div className="absolute top-1 left-1 z-10 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                                    {index + 1}
                                </div>
                                {/* Slide preview */}
                                <div
                                    className="w-full aspect-video rounded overflow-hidden shadow-sm"
                                    style={{
                                        fontFamily: currentTheme.fontFamily,
                                        color: currentTheme.accentColor,
                                        backgroundColor:
                                            currentTheme.slideBackgroundColor,
                                        backgroundImage:
                                            currentTheme.gradientBackground,
                                    }}
                                >
                                    <div className="scale-[0.25] origin-top-left overflow-hidden size-[400%]">
                                        <MasterRecursiveComponent
                                            slideId={slide.id}
                                            content={slide.content}
                                            onContentChange={() => {}}
                                            isPreview={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
