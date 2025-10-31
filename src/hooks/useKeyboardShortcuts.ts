import { useEffect } from "react"

export interface KeyboardShortcut {
    key: string
    ctrlKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    action: () => void
    description: string
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const matchingShortcut = shortcuts.find((shortcut) => {
                const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
                const ctrlMatches = !!shortcut.ctrlKey === (event.ctrlKey || event.metaKey)
                const shiftMatches = !!shortcut.shiftKey === event.shiftKey
                const altMatches = !!shortcut.altKey === event.altKey

                return keyMatches && ctrlMatches && shiftMatches && altMatches
            })

            if (matchingShortcut) {
                event.preventDefault()
                matchingShortcut.action()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [shortcuts])
}
