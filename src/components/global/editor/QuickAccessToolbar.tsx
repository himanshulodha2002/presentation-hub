"use client"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSlideStore } from "@/store/useSlideStore"
import {
    Image,
    Shapes,
    Table,
    Type,
} from "lucide-react"
import React from "react"

interface QuickAccessToolbarProps {
    onInsertText?: () => void
    onInsertImage?: () => void
    onInsertShape?: () => void
    onInsertTable?: () => void
}

export const QuickAccessToolbar: React.FC<QuickAccessToolbarProps> = ({
    onInsertText,
    onInsertImage,
    onInsertShape,
    onInsertTable,
}) => {
    const { currentTheme } = useSlideStore()

    return (
        <TooltipProvider>
            <div
                className="flex items-center gap-1 px-3 py-2 border-b"
                style={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.accentColor,
                }}
            >
                <span className="text-xs font-medium mr-2">Quick Insert:</span>
                
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={onInsertText}
                        >
                            <Type className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Text Box</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={onInsertImage}
                        >
                            <Image className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Image</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={onInsertShape}
                        >
                            <Shapes className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Shape</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={onInsertTable}
                        >
                            <Table className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Insert Table</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
