"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSlideStore } from "@/store/useSlideStore"
import { Minus, Plus } from "lucide-react"
import React from "react"

interface StatusBarProps {
    zoom?: number
    onZoomChange?: (zoom: number) => void
}

export const StatusBar: React.FC<StatusBarProps> = ({
    zoom = 100,
    onZoomChange,
}) => {
    const { currentSlide, getOrderedSlides, currentTheme } = useSlideStore()
    const slides = getOrderedSlides()
    const [currentZoom, setCurrentZoom] = React.useState(zoom)

    const handleZoomChange = (newZoom: number) => {
        const clampedZoom = Math.max(25, Math.min(200, newZoom))
        setCurrentZoom(clampedZoom)
        onZoomChange?.(clampedZoom)
    }

    const handleZoomIn = () => {
        handleZoomChange(currentZoom + 10)
    }

    const handleZoomOut = () => {
        handleZoomChange(currentZoom - 10)
    }

    const handleSliderChange = (value: number[]) => {
        handleZoomChange(value[0])
    }

    return (
        <TooltipProvider>
            <div
                className="fixed bottom-0 left-0 right-0 z-50 h-8 flex items-center justify-between px-4 border-t"
                style={{
                    backgroundColor: currentTheme.navbarColor || currentTheme.backgroundColor,
                    color: currentTheme.accentColor,
                }}
            >
                {/* Left section - Slide count */}
                <div className="flex items-center gap-2 text-sm">
                    <span>
                        Slide {currentSlide + 1} of {slides.length}
                    </span>
                </div>

                {/* Right section - Zoom controls */}
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleZoomOut}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>

                    <div className="flex items-center gap-2 w-32">
                        <Slider
                            value={[currentZoom]}
                            onValueChange={handleSliderChange}
                            min={25}
                            max={200}
                            step={5}
                            className="w-20"
                        />
                        <span className="text-xs w-12 text-right">{currentZoom}%</span>
                    </div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={handleZoomIn}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    )
}
