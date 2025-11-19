import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface ParagraphProps {
    className?: string;
    styles?: React.CSSProperties;
    isPreview?: boolean;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Paragraph = React.forwardRef<HTMLDivElement, ParagraphProps>(
    ({ className, styles, isPreview = false, value = "", placeholder, onChange, ...props }, ref) => {
        const divRef = useRef<HTMLDivElement>(null);
        const isUpdating = useRef(false);

        // Sync value to content
        useEffect(() => {
            if (divRef.current && !isUpdating.current) {
                if (divRef.current.innerHTML !== value) {
                    divRef.current.innerHTML = value || "";
                }
            }
        }, [value]);

        const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
            if (onChange && !isUpdating.current) {
                isUpdating.current = true;
                const content = (e.target as HTMLDivElement).innerHTML;
                // Create synthetic event
                const syntheticEvent = {
                    target: { value: content },
                    currentTarget: { value: content },
                } as React.ChangeEvent<HTMLTextAreaElement>;
                onChange(syntheticEvent);
                setTimeout(() => {
                    isUpdating.current = false;
                }, 0);
            }
        };

        const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        };

        return (
            <div
                ref={(el) => {
                    (divRef.current as HTMLDivElement | null) = el;
                    if (typeof ref === "function") ref(el);
                    else if (ref) ref.current = el;
                }}
                contentEditable={!isPreview}
                suppressContentEditableWarning
                onInput={handleInput}
                onPaste={handlePaste}
                data-placeholder={placeholder}
                className={cn(
                    "w-full bg-transparent font-normal text-gray-900 focus:outline-none leading-tight",
                    `${isPreview ? "text-[0.5rem]" : "text-lg"}`,
                    "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300",
                    className
                )}
                style={{
                    padding: 0,
                    margin: 0,
                    color: "inherit",
                    boxSizing: "content-box",
                    lineHeight: "1.5em",
                    minHeight: "1.5em",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    ...styles,
                }}
                {...props}
            />
        );
    }
);

Paragraph.displayName = "Paragraph";

export default Paragraph;
