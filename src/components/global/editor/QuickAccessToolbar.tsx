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
import { toast } from "sonner"

export const QuickAccessToolbar: React.FC = () => {
    const { currentTheme } = useSlideStore()

    const handleInsertText = () => {
        document.execCommand('insertHTML', false, '<p>New text box</p>')
        toast.success("Text box inserted")
    }

    const handleInsertImage = () => {
        const url = prompt('Enter image URL:')
        if (url) {
            document.execCommand('insertImage', false, url)
            toast.success("Image inserted")
        }
    }

    const handleInsertShape = () => {
        // Insert a simple colored div as a shape
        document.execCommand('insertHTML', false, '<div style="width: 100px; height: 100px; background-color: #3b82f6; display: inline-block; margin: 10px;"></div>')
        toast.success("Shape inserted")
    }

    const handleInsertTable = () => {
        const rows = prompt('Number of rows:', '3')
        const cols = prompt('Number of columns:', '3')
        if (rows && cols) {
            let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tbody>'
            for (let i = 0; i < parseInt(rows); i++) {
                tableHTML += '<tr>'
                for (let j = 0; j < parseInt(cols); j++) {
                    tableHTML += '<td style="border: 1px solid #ccc; padding: 8px;">Cell</td>'
                }
                tableHTML += '</tr>'
            }
            tableHTML += '</tbody></table>'
            document.execCommand('insertHTML', false, tableHTML)
            toast.success("Table inserted")
        }
    }

    return (
        <TooltipProvider>
            <div
                className="fixed top-28 left-0 right-0 z-40 flex items-center gap-1 px-3 py-2 border-b"
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
                            onClick={handleInsertText}
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
                            onClick={handleInsertImage}
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
                            onClick={handleInsertShape}
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
                            onClick={handleInsertTable}
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
