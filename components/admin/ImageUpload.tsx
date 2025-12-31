"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
    folder?: string;
}

export function ImageUpload({
    value,
    onChange,
    bucket = "product-images",
    folder = "products"
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Apenas imagens são permitidas.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Imagem muito grande. Máximo: 5MB");
            return;
        }

        setIsUploading(true);

        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Upload error:", error);
            toast.error("Erro ao fazer upload. Verifique se você é admin.");
            setIsUploading(false);
            return;
        }

        const { data: publicUrl } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        onChange(publicUrl.publicUrl);
        toast.success("Imagem enviada com sucesso!");
        setIsUploading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleRemove = () => {
        onChange("");
    };

    if (value) {
        return (
            <div className="relative group">
                <div className="relative w-full aspect-video rounded-2xl border-2 border-white/5 bg-black/20 overflow-hidden backdrop-blur-sm">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Trocar imagem"
                        >
                            <Upload size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                            title="Remover imagem"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                />
            </div>
        );
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`
                relative w-full aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer
                flex flex-col items-center justify-center gap-4
                ${isDragging
                    ? "border-brand-orange bg-brand-orange/10"
                    : "border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/30"
                }
                ${isUploading ? "pointer-events-none opacity-50" : ""}
            `}
        >
            {isUploading ? (
                <>
                    <Loader2 className="animate-spin text-brand-orange" size={40} />
                    <span className="text-sm text-white/60 font-medium">Enviando...</span>
                </>
            ) : (
                <>
                    <div className="p-4 rounded-2xl bg-white/5 text-white/40">
                        <ImageIcon size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-white/80">
                            Clique para fazer upload
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                            ou arraste uma imagem aqui (máx. 5MB)
                        </p>
                    </div>
                </>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    );
}
