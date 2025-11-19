"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"

interface EditorContextType {
    focusedElement: HTMLElement | null
    setFocusedElement: (element: HTMLElement | null) => void
    applyFormatting: (command: string, value?: string) => void
    canUndo: boolean
    canRedo: boolean
    undo: () => void
    redo: () => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const useEditor = () => {
    const context = useContext(EditorContext)
    if (!context) {
        throw new Error("useEditor must be used within EditorProvider")
    }
    return context
}

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)
    const historyRef = useRef<{undo: boolean, redo: boolean}>({ undo: false, redo: false })

    const applyFormatting = useCallback((command: string, value?: string) => {
        // Map our commands to browser execCommand
        const commandMap: Record<string, string> = {
            'bold': 'bold',
            'italic': 'italic',
            'underline': 'underline',
            'alignLeft': 'justifyLeft',
            'alignCenter': 'justifyCenter',
            'alignRight': 'justifyRight',
            'bulletList': 'insertUnorderedList',
            'numberedList': 'insertOrderedList',
        }

        const browserCommand = commandMap[command] || command

        try {
            if (command === 'fontSize' && value) {
                document.execCommand('fontSize', false, '7')
                const fontElements = document.querySelectorAll('font[size="7"]')
                fontElements.forEach((el) => {
                    el.removeAttribute('size')
                    ;(el as HTMLElement).style.fontSize = `${value}px`
                })
            } else if (command === 'fontFamily' && value) {
                document.execCommand('fontName', false, value)
            } else {
                document.execCommand(browserCommand, false, value)
            }
        } catch (error) {
            console.error('Formatting error:', error)
        }
    }, [])

    const undo = useCallback(() => {
        try {
            document.execCommand('undo', false)
        } catch (error) {
            console.error('Undo error:', error)
        }
    }, [])

    const redo = useCallback(() => {
        try {
            document.execCommand('redo', false)
        } catch (error) {
            console.error('Redo error:', error)
        }
    }, [])

    return (
        <EditorContext.Provider
            value={{
                focusedElement,
                setFocusedElement,
                applyFormatting,
                canUndo: historyRef.current.undo,
                canRedo: historyRef.current.redo,
                undo,
                redo,
            }}
        >
            {children}
        </EditorContext.Provider>
    )
}
