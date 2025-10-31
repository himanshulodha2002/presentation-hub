"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useSlideStore } from "@/store/useSlideStore"
import { Sparkles } from "lucide-react"
import React, { useState } from "react"

interface TransitionSelectorProps {
    onTransitionChange?: (transition: string, duration: number) => void
}

const transitions = [
    { value: "none", label: "None" },
    { value: "fade", label: "Fade" },
    { value: "slide", label: "Slide" },
    { value: "wipe", label: "Wipe" },
    { value: "push", label: "Push" },
    { value: "cover", label: "Cover" },
    { value: "uncover", label: "Uncover" },
    { value: "zoom", label: "Zoom" },
    { value: "split", label: "Split" },
    { value: "reveal", label: "Reveal" },
]

export const TransitionSelector: React.FC<TransitionSelectorProps> = ({
    onTransitionChange,
}) => {
    const { currentTheme } = useSlideStore()
    const [transition, setTransition] = useState("none")
    const [duration, setDuration] = useState([500])

    const handleTransitionChange = (value: string) => {
        setTransition(value)
        onTransitionChange?.(value, duration[0])
    }

    const handleDurationChange = (value: number[]) => {
        setDuration(value)
        onTransitionChange?.(transition, value[0])
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Transitions</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-80"
                style={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.fontColor,
                }}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Transition Effect
                        </Label>
                        <Select
                            value={transition}
                            onValueChange={handleTransitionChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select transition" />
                            </SelectTrigger>
                            <SelectContent>
                                {transitions.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {transition !== "none" && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Duration: {duration[0]}ms
                            </Label>
                            <Slider
                                value={duration}
                                onValueChange={handleDurationChange}
                                min={100}
                                max={2000}
                                step={100}
                            />
                        </div>
                    )}

                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                            Transitions will be applied when presenting
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
