"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { useSlideStore } from "@/store/useSlideStore"
import { PopoverContent } from "@radix-ui/react-popover"
import { LayoutTemplate, Palette, LayoutGrid } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import LayoutChooser from "./tabs/LayoutChooser"
import { cn } from "@/lib/utils"
import ThemeChooser from "./tabs/ThemeChooser"
import { PresentationOverview } from "@/components/global/editor/PresentationOverview"

const EditorSidebar = () => {
    const popOverRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)
    const { currentTheme } = useSlideStore()

    const layoutButton = document.getElementById("layout")
    const themeButton = document.getElementById("theme")
    const overviewButton = document.getElementById("overview")

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation()

        const target = e.target as HTMLElement
        const state = target.getAttribute("data-state")

        if (state === "open") {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (
            popOverRef.current &&
            !popOverRef.current.contains(e.target as Node)
        ) {
            setOpen(false)
        }
        if (
            layoutButton?.getAttribute("data-state") === "closed" &&
            themeButton?.getAttribute("data-state") === "closed" &&
            overviewButton?.getAttribute("data-state") === "closed"
        ) {
            setOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    })

    return (
        <div className="fixed top-1/2 right-2 transform -translate-y-1/2 z-10">
            <div
                className={cn(
                    "rounded-xl border-r-0 border border-background/30 shadow-lg p-2 flex flex-col items-center space-y-4 opacity-65 hover:opacity-100 transition-opacity duration-300",
                    open && "ring-2 ring-blue-500 opacity-100"
                )}
                ref={popOverRef}
            >
                <Popover>
                    <PopoverTrigger asChild id="layout">
                        <Button
                            variant="ghost"
                            size={"icon"}
                            className="size-10 rounded-full cursor-pointer m-0"
                            onClick={(e) => {
                                handleOpen(e)
                            }}
                        >
                            <LayoutTemplate className="size-5" />
                            <span className="sr-only">Choose Layout</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="left"
                        align="center"
                        className="p-0 w-[480px] border-1 rounded-2xl relative right-6"
                        style={{
                            backgroundColor: currentTheme.backgroundColor,
                            color: currentTheme.fontColor,
                        }}
                    >
                        <LayoutChooser />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild id="theme">
                        <Button
                            variant="ghost"
                            size={"icon"}
                            className="size-10 rounded-full cursor-pointer m-0"
                            onClick={(e) => {
                                handleOpen(e)
                            }}
                        >
                            <Palette className="size-5" />
                            <span className="sr-only">Change Theme</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="left"
                        align="center"
                        className="p-0 w-80 border-1 rounded-2xl relative right-6"
                        style={{
                            backgroundColor: currentTheme.backgroundColor,
                            color: currentTheme.fontColor,
                        }}
                    >
                        <ThemeChooser />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild id="overview">
                        <Button
                            variant="ghost"
                            size={"icon"}
                            className="size-10 rounded-full cursor-pointer m-0"
                            onClick={(e) => {
                                handleOpen(e)
                            }}
                        >
                            <LayoutGrid className="size-5" />
                            <span className="sr-only">Overview</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="left"
                        align="center"
                        className="p-0 w-96 border-1 rounded-2xl relative right-6"
                        style={{
                            backgroundColor: currentTheme.backgroundColor,
                            color: currentTheme.fontColor,
                        }}
                    >
                        <PresentationOverview />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default EditorSidebar