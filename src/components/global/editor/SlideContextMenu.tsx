"use client"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Copy, Plus, Scissors, Trash } from "lucide-react"
import React from "react"

interface SlideContextMenuProps {
    children: React.ReactNode
    onDuplicate?: () => void
    onDelete?: () => void
    onCut?: () => void
    onCopy?: () => void
    onAddAfter?: () => void
}

export const SlideContextMenu: React.FC<SlideContextMenuProps> = ({
    children,
    onDuplicate,
    onDelete,
    onCut,
    onCopy,
    onAddAfter,
}) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                {onCut && (
                    <ContextMenuItem onClick={onCut}>
                        <Scissors className="mr-2 h-4 w-4" />
                        Cut
                        <ContextMenuShortcut>Ctrl+X</ContextMenuShortcut>
                    </ContextMenuItem>
                )}
                {onCopy && (
                    <ContextMenuItem onClick={onCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                        <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                    </ContextMenuItem>
                )}
                {onDuplicate && (
                    <ContextMenuItem onClick={onDuplicate}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate Slide
                        <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
                    </ContextMenuItem>
                )}
                {onAddAfter && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={onAddAfter}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Slide After
                        </ContextMenuItem>
                    </>
                )}
                {onDelete && (
                    <>
                        <ContextMenuSeparator />
                        <ContextMenuItem onClick={onDelete} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Slide
                            <ContextMenuShortcut>Del</ContextMenuShortcut>
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}
