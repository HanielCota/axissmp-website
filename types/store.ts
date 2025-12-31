export type Category = 'vips' | 'coins' | 'unban';

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: Category;
    color: string;
    image: string;
}
