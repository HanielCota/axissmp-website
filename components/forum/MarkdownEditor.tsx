"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link as LinkIcon, List, Quote, Eye, Code } from "lucide-react";
import Markdown from "react-markdown";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false);

    const insertText = (before: string, after: string = "") => {
        const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.substring(start, end);

        const newValue = text.substring(0, start) + before + selected + after + text.substring(end);
        onChange(newValue);

        // Refocus and set cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className="space-y-3">
            <div className="mb-2 flex items-center justify-between border-b px-1 pb-2">
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => insertText("**", "**")}
                        title="Negrito"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => insertText("_", "_")}
                        title="Itálico"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => insertText("[", "](url)")}
                        title="Link"
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    <div className="bg-border mx-1 h-4 w-[1px]" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => insertText("> ")}
                        title="Citação"
                    >
                        <Quote className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => insertText("- ")}
                        title="Lista"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => insertText("```\n", "\n```")}
                        title="Código"
                    >
                        <Code className="h-4 w-4" />
                    </Button>
                </div>

                <Button
                    type="button"
                    variant={isPreview ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    className="h-8 gap-2 text-xs font-bold tracking-wider uppercase"
                >
                    <Eye className="h-3.5 w-3.5" />
                    {isPreview ? "Editar" : "Preview"}
                </Button>
            </div>

            {isPreview ? (
                <div className="bg-card/40 border-primary/20 prose prose-invert min-h-[150px] max-w-none rounded-xl border border-dashed p-4 text-sm">
                    {value ? (
                        <Markdown>{value}</Markdown>
                    ) : (
                        <span className="text-muted-foreground italic">
                            Nada para visualizar...
                        </span>
                    )}
                </div>
            ) : (
                <Textarea
                    id="markdown-editor"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="bg-card/40 border-primary/10 focus:border-primary/30 min-h-[150px] resize-y transition-all"
                />
            )}
        </div>
    );
}
