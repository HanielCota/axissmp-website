import { Map, HandCoins, Shield, BookOpen, Swords, Crown } from "lucide-react";

export const wikiData = {
    "primeiros-passos": {
        title: "Primeiros Passos",
        description: "Tudo o que você precisa saber para começar sua jornada.",
        icon: Map,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        content: `
# Bem-vindo ao AxisSMP!

Estamos felizes em ter você aqui. Este guia irá ajudá-lo a entender os conceitos básicos do servidor e como iniciar sua aventura.

## 1. Conectando-se ao Servidor
Para entrar, utilize o IP: \`jogar.axissmp.com\`. Recomendamos o uso da versão 1.21 do Minecraft para aproveitar todas as funcionalidades.

## 2. O Básico da Sobrevivência
Ao entrar, você nascerá no **Spawn**. Aqui você encontrará:
- **NPCs de Quest**: Inicie missões diárias.
- **Mercado**: Troque itens com outros jogadores.
- **Caixas Misteriosas**: Abra chaves que você ganhar jogando.

Para ir ao mundo de construção, digite \`/rtp\` para ser teleportado para um local aleatório e seguro.

## 3. Comandos Úteis
- \`/spawn\`: Retorna ao centro do mundo.
- \`/sethome [nome]\`: Marca um local como sua casa.
- \`/home [nome]\`: Teleporta para sua casa marcada.
- \`/tpa [jogador]\`: Pede para teleportar até um amigo.
- \`/kits\`: Veja os kits disponíveis para você.

## 4. Próximos Passos
Recomendamos que você:
1.  Encontre um local para construir sua base.
2.  Proteja seu terreno (veja a página de Proteção).
3.  Junte dinheiro colhendo recursos e vendendo na loja.
        `,
    },
    economia: {
        title: "Economia",
        description: "Lojas, mercado, leilões e como ficar rico.",
        icon: HandCoins,
        color: "text-brand-orange",
        bg: "bg-brand-orange/10",
        content: `
# Sistema de Economia

A economia do AxisSMP é baseada em **Coins** e é totalmente movimentada pelos jogadores.

## Ganhar Dinheiro
Existem várias formas de enriquecer:
- **Jobs**: Junte-se a uma profissão com \`/jobs join\` e ganhe dinheiro trabalhando (minerando, caçando, pescando).
- **Venda de Itens**: Use \`/shop\` para vender itens básicos ao servidor.
- **Mercado de Jogadores**: Crie sua própria loja usando placas ou anuncie no \`/ah\` (Casa de Leilões).

## Casa de Leilões (/ah)
O sistema de leilão permite vender itens raros para outros jogadores.
- \`/ah sell [preço]\` com o item na mão para anunciar.
- \`/ah\` para ver o que está à venda.

## Lojas de Jogadores
Para criar uma loja física:
1.  Coloque um baú.
2.  Bata no baú com o item que quer vender.
3.  Digite o preço no chat.
        `,
    },
    protecao: {
        title: "Proteção",
        description: "Proteja seus terrenos, crie clans e defenda sua base.",
        icon: Shield,
        color: "text-green-500",
        bg: "bg-green-500/10",
        content: `
# Proteção de Terrenos

Ninguém gosta de ter sua casa destruída. Por isso, utilizamos um sistema de proteção baseado em blocos de proteção ou "Claim".

## Como Proteger
Você começa com uma **Pá de Ouro** (ou pode craftar uma).
1.  Segure a pá de ouro.
2.  Clique com o botão direito em um canto do seu terreno.
3.  Vá até o canto oposto (diagonal) e clique novamente.
4.  Pronto! A área marcada agora é sua.

## Gerenciando sua Proteção
- \`/trust [jogador]\`: Permite que um amigo construa no seu terreno.
- \`/untrust [jogador]\`: Remove a permissão.
- \`/claimlist\`: Vê todos os seus terrenos.
- \`/abandonclaim\`: Deleta a proteção onde você está pisando.

## Clans
Junte-se a amigos e crie um **Clan** para dominar o servidor!
- \`/clan create [nome]\`: Cria um novo clan (custa Coins).
- \`/clan invite [jogador]\`: Convida alguém.
- \`/clan home\`: Vai para a base do clan.
        `,
    },
    "skills-jobs": {
        title: "Skills e Jobs",
        description: "Domine o McMMO e escolha sua profissão.",
        icon: BookOpen,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        content: `
# Skills (McMMO)
O AxisSMP conta com o clássico plug-in **McMMO** para adicionar progressão RPG ao jogo.

## Habilidades Principais
- **Mineração**: Habilidade especial "Super Breaker". Aumenta drops de minérios.
- **Escavação**: Encontre tesouros (diamantes, discos) cavando terra.
- **Machado**: Dá dano crítico e quebra armaduras.
- **Acrobacia**: Reduz dano de queda e chance de esquivar ataques.

Use \`/mcmmo help\` para ver todas as habilidades e seus níveis.

# Jobs (Profissões)
Ganhe dinheiro fazendo o que você gosta!
- Escolha até 2 profissões simultâneas (Vips podem ter mais).
- **Minerador**: Ganha por quebrar pedras e minérios.
- **Lenhador**: Ganha por cortar árvores.
- **Caçador**: Ganha por matar mobs hostis.
- **Fazendeiro**: Ganha por colher plantações.

Comandos:
- \`/jobs browse\`: Abre o menu de seleção.
- \`/jobs join [nome]\`: Entra no emprego.
        `,
    },
    "pvp-guerra": {
        title: "PvP e Guerra",
        description: "Arenas, eventos de PvP e sistemas de combate.",
        icon: Swords,
        color: "text-red-500",
        bg: "bg-red-500/10",
        content: `
# Player vs Player (PvP)

O PvP é ativado apenas em áreas específicas ou à noite no mundo aberto fora das proteções (dependendo da configuração atual da temporada).

## Arena PvP
Digite \`/warp arena\` para ir ao coliseu.
- **Keep Inventory**: OFF (Você perde itens se morrer na arena!).
- **Recompensas**: Matar jogadores concede Coins e cabeças de troféu.

## Eventos de Guerra
Semanalmente, ocorrem eventos como:
- **KOTH (King of the Hill)**: Capture o ponto e segure por 5 minutos.
- **Gladiador**: Torneio 1v1 até sobrar o último.

## Regras de Combate
- Não é permitido "Combat Log" (desconectar para fugir). Você morrerá instantaneamente.
- Uso de trapaças (hacks) resulta em banimento permanente.
        `,
    },
    vips: {
        title: "VIPs",
        description: "Vantagens exclusivas para apoiadores do servidor.",
        icon: Crown,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        content: `
# Torne-se um VIP

Apoie o servidor e receba recompensas incríveis! Visite **loja.axissmp.com**.

## Vantagens Gerais
Todos os VIPs recebem:
- Tag exclusiva no chat e tab.
- Acesso ao comando \`/fly\` no Lobby.
- Prioridade na fila de entrada.
- Acesso a kits diários e semanais exclusivos.

## Ranks
### VIP Hero
- 2 sethomes.
- Kit Hero (Armadura Ferro Encantada).

### VIP Legend
- 5 sethomes.
- Acesso ao comando \`/bancada\` (Crafting Table portátil).
- Kit Legend (Armadura Diamante).

### VIP Axis (Supremo)
- Sethomes ilimitadas.
- Acesso ao \`/fly\` no mundo survival (apenas para construção).
- Kit Axis (Itens Netheirte).
- Spawner de Mobs passivos.

*Todo o dinheiro arrecadado é reinvestido na manutenção do servidor.*
        `,
    },
};

export type WikiSlug = keyof typeof wikiData;
