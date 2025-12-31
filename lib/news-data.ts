export type NewsCategory = "update" | "event" | "maintenance" | "announcement";

export interface NewsPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: NewsCategory;
    author: string;
    image?: string;
}

export const newsData: NewsPost[] = [
    {
        slug: "season-1-lancamento",
        title: "Lançamento da Season 1: O Início",
        excerpt:
            "Bem-vindos à primeira temporada do AxisSMP! Descubra todas as novidades, sistemas de economia e o novo mundo para explorar.",
        content: `
# O Início de uma Nova Era

Estamos extremamente empolgados em anunciar o lançamento oficial da **Season 1** do AxisSMP! Após meses de desenvolvimento e testes beta, finalmente abrimos as portas para todos.

## O que há de novo?

### 1. Novo Mundo Gerado
Utilizamos a geração 1.21 com biomas customizados para tornar a exploração ainda mais incrível. Novas estruturas, cavernas reformuladas e muito mais.

### 2. Sistema de Economia 2.0
Reformulamos completamente as lojas e o mercado.
- **Inflação Controlada**: Preços dinâmicos baseados na oferta e demanda.
- **Novos Jobs**: Trabalhe como Ferreiro ou Alquimista.

### 3. Eventos Semanais
Todo sábado às 18h teremos eventos valendo chaves de caixas misteriosas e ranks temporários.

Venha fazer parte dessa história!
        `,
        date: "30 Dez 2025",
        category: "update",
        author: "Admin",
    },
    {
        slug: "evento-pvp-arena",
        title: "Torneio de Gladiadores",
        excerpt:
            "Prepare sua espada! O primeiro torneio PvP da temporada vai acontecer neste fim de semana.",
        content: `
# Gladiadores do Axis

Você se considera o melhor guerreiro do servidor? Chegou a hora de provar.

## Detalhes do Evento
- **Data**: Sábado, 04 Jan 2026
- **Horário**: 19:00 (Brasília)
- **Local**: /warp arena

## Premiação
- **1º Lugar**: VIP Axis (30 dias) + 1.000.000 Coins
- **2º Lugar**: VIP Legend (30 dias) + 500.000 Coins
- **3º Lugar**: 250.000 Coins

As inscrições abrem 30 minutos antes do evento. Não se atrase!
        `,
        date: "28 Dez 2025",
        category: "event",
        author: "Mod PvP",
    },
    {
        slug: "manutencao-programada",
        title: "Manutenção na Loja",
        excerpt: "Realizaremos uma breve manutenção no sistema de pagamentos nesta madrugada.",
        content: `
Faremos uma atualização de segurança no gateway de pagamentos da nossa loja.

- **Início**: 02:00 AM
- **Previsão de Término**: 03:00 AM

Durante este período, a ativação de VIPs pode sofrer atrasos. O servidor permanecerá ONLINE normalmente.
        `,
        date: "27 Dez 2025",
        category: "maintenance",
        author: "Dev Team",
    },
    {
        slug: "novo-parkour",
        title: "Novo Parkour no Lobby",
        excerpt:
            "Adicionamos um parkour desafiador no Lobby. Quem completar ganha uma chave comum!",
        content: `Adicionamos um novo parkour temático de Gelo no Lobby. É difícil, mas a recompensa vale a pena!`,
        date: "26 Dez 2025",
        category: "update",
        author: "Builder Team",
    },
    {
        slug: "vencedores-construcao",
        title: "Vencedores do Evento de Construção",
        excerpt:
            "Confira as construções mais incríveis do tema 'Medieval' e os grandes vencedores.",
        content: `Parabéns ao jogador **CraftMaster** por levar o primeiro lugar com seu castelo incrível!`,
        date: "25 Dez 2025",
        category: "announcement",
        author: "Event Team",
    },
    {
        slug: "bonus-xp-fim-de-ano",
        title: "Bônus de XP de Fim de Ano",
        excerpt: "Aproveite o dobro de XP em todas as skills do McMMO até o dia 1º de Janeiro!",
        content: `Para celebrar o fim de ano, ativamos o Double XP global. Aproveite para upar suas skills de mineração e escavação!`,
        date: "24 Dez 2025",
        category: "event",
        author: "Admin",
    },
    {
        slug: "atualizacao-anticheat",
        title: "Melhorias no AntiCheat",
        excerpt: "Implementamos novas verificações para garantir um jogo justo para todos.",
        content: `Atualizamos nosso sistema de proteção contra trapaças. Combat Hacks agora são detectados instantaneamente.`,
        date: "23 Dez 2025",
        category: "maintenance",
        author: "Dev Team",
    },
    {
        slug: "abertura-vagas-staff",
        title: "Vagas para Ajudantes Abertas",
        excerpt: "Quer ajudar a comunidade? Estamos recrutando novos membros para a equipe.",
        content: `Estamos procurando jogadores ativos e prestativos para integrar nossa equipe de suporte. Aplique no Discord!`,
        date: "22 Dez 2025",
        category: "announcement",
        author: "Admin",
    },
    {
        slug: "mudanca-economia-nether",
        title: "Ajustes na Economia do Nether",
        excerpt: "Mudanças nos preços de venda de Quartzo e Ouro para equilibrar o mercado.",
        content: `Percebemos que o farm de ouro estava desbalanceado. Ajustamos os preços de venda na /shop.`,
        date: "21 Dez 2025",
        category: "update",
        author: "Econ Manager",
    },
    {
        slug: "evento-pesca",
        title: "Campeonato de Pesca",
        excerpt: "Quem pescará o maior peixe? Venha competir no lago do Spawn.",
        content: `O evento de pesca acontecerá neste domingo. Preparem suas varas!`,
        date: "20 Dez 2025",
        category: "event",
        author: "Event Team",
    },
];
