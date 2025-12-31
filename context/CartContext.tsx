"use client";

import { createContext, useState, useEffect, ReactNode, use } from "react";

// Types
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: 'vips' | 'coins' | 'unban';
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    nickname: string | null;
    setNickname: (name: string | null) => void;
    addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_QUANTITY = 100;
const NICKNAME_STORAGE_KEY = "axissmp-nickname";
const CART_STORAGE_KEY = "axissmp-cart";

// Helper to format number to price string
export function formatPrice(price: number): string {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(price);
}

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [nickname, setNicknameState] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch {
                // Invalid JSON, ignore
            }
        }

        const savedNickname = localStorage.getItem(NICKNAME_STORAGE_KEY);
        if (savedNickname) {
            setNicknameState(savedNickname);
        }

        setIsHydrated(true);
    }, []);

    // Save items to localStorage on change
    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items, isHydrated]);

    // Save nickname to localStorage on change
    const setNickname = (name: string | null) => {
        setNicknameState(name);
        if (name) {
            localStorage.setItem(NICKNAME_STORAGE_KEY, name);
        } else {
            localStorage.removeItem(NICKNAME_STORAGE_KEY);
        }
    };

    // Calculated values (Fix floating point precision)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = parseFloat(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));

    // Actions
    const addToCart = (item: Omit<CartItem, "quantity">, quantity: number) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex((i) => i.id === item.id);

            if (existingIndex >= 0) {
                // Update quantity of existing item (with limit)
                const updated = [...prev];
                const newQuantity = Math.min(updated[existingIndex].quantity + quantity, MAX_QUANTITY);

                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: newQuantity,
                };
                return updated;
            }

            // Add new item (with limit)
            return [...prev, { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }];
        });
    };

    const removeFromCart = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        const safeQuantity = Math.min(quantity, MAX_QUANTITY);

        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: safeQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                nickname,
                setNickname,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook using React 19's use()
export function useCart() {
    const context = use(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
