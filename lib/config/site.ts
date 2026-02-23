export const siteConfig = {
    name: "AxisSMP",
    description: "Servidor de Minecraft Survival 1.21 com economia, quests e comunidade ativa.",
    links: {
        discord: "https://discord.gg/axissmp",
        store: "/store",
        rules: "/rules",
    },
    colors: {
        brand: {
            orange: "#FF8C00", // Example brand orange
            dark: "#09090b",
            light: "#fafafa",
        },
    },
    minecraft: {
        ip: "jogar.axissmp.com.br",
        version: "1.21.x",
    },
    payment: {
        pixDiscount: 0.05, // 5% discount
    },
};

export type SiteConfig = typeof siteConfig;
