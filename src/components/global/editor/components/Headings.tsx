"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface HeadingProps {
    className?: string;
    styles?: React.CSSProperties;
    isPreview?: boolean;
    value?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const createHeading = (displayName: string, defaultClassName: string) => {
    const Heading = React.forwardRef<HTMLDivElement, HeadingProps>(
        ({ styles, isPreview = false, className, value = "", placeholder, onChange, ...props }, ref) => {
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

            const previewClassName = isPreview ? "text-xs" : "";

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
                        `w-full bg-transparent ${defaultClassName} ${previewClassName} font-normal text-gray-900 focus:outline-none leading-tight`,
                        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300",
                        className
                    )}
                    style={{
                        padding: 0,
                        margin: 0,
                        color: "inherit",
                        boxSizing: "content-box",
                        lineHeight: "1.2em",
                        minHeight: "1.2em",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        ...styles,
                    }}
                    {...props}
                />
            );
        }
    );
    Heading.displayName = displayName;
    return Heading;
};

const Heading1 = createHeading("Heading1", "text-4xl");
const Heading2 = createHeading("Heading2", "text-3xl");
const Heading3 = createHeading("Heading3", "text-2xl");
const Heading4 = createHeading("Heading4", "text-xl");
const Title = createHeading("Title", "text-5xl");

export { Heading1, Heading2, Heading3, Heading4, Title };