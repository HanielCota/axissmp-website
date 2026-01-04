"use client";

import { motion } from "framer-motion";
import { ForumCategoryCard } from "./ForumCategoryCard";
import { ForumCategory } from "@/types/forum";

interface ForumCategoryListProps {
    categories: ForumCategory[];
}

export function ForumCategoryList({ categories }: ForumCategoryListProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {categories.map((category) => (
                <motion.div key={category.id} variants={item}>
                    <ForumCategoryCard category={category} />
                </motion.div>
            ))}
        </motion.div>
    );
}
