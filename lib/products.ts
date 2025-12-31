export interface Product {
    id: number;
    name: string;
    price: number;
    category: 'vips' | 'coins' | 'unban';
    color: string;
    image: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: "VIP",
        price: 19.90,
        category: "vips",
        color: "bg-brand-orange/20",
        image: "/images/vips/vip.png"
    },
    {
        id: 2,
        name: "MVP",
        price: 39.90,
        category: "vips",
        color: "bg-zinc-400/20",
        image: "/images/vips/mvp.png"
    },
    {
        id: 3,
        name: "MVP+",
        price: 69.90,
        category: "vips",
        color: "bg-emerald-500/20",
        image: "/images/vips/mvp-plus.png"
    },
    {
        id: 11,
        name: "10.000 Coins",
        price: 10.00,
        category: "coins",
        color: "bg-yellow-400/20",
        image: "/images/coins/coins-gold-pile-small.png"
    },
    {
        id: 12,
        name: "50.000 Coins",
        price: 40.00,
        category: "coins",
        color: "bg-yellow-500/20",
        image: "/images/coins/coins-gold-stack.png"
    },
    {
        id: 13,
        name: "100.000 Coins",
        price: 70.00,
        category: "coins",
        color: "bg-orange-400/20",
        image: "/images/coins/currency-medium-gold-stack.png"
    },
    {
        id: 14,
        name: "250.000 Coins",
        price: 150.00,
        category: "coins",
        color: "bg-orange-500/20",
        image: "/images/coins/currency-large-gold-stack.png"
    },
    {
        id: 7,
        name: "Desbanimento",
        price: 25.00,
        category: "unban",
        color: "bg-red-500/20",
        image: "/images/items/unban.png"
    },
];
