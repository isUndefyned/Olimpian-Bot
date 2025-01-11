async function ajuda(context) {
    const { sock, sender, prefix } = context;

    sock.sendMessage(sender, {
        text: `\`\`\`ㅤPrefix: ${prefix}ㅤ\`\`\`
ㅤㅤ       𓂃ֺ⏜ Ψ𓏸🤖
        •◦ೋ•❥◦ೋ•
 COMANDOS DISPONÍVEIS
ㅤ𓏲 ꫶۫ 𖤐̸ ۪ ⃘◌ ࣪ 🔱  ࣭ ◌⃘ ۪ ☾  ۫

“Olá, jogador! Eu sou o Olimpian, bot do RPG “Olympus: Caçada Divina”, criado por Kinho! Esses são os meus comandos disponíveis:”

┈ׅ┈۫─ ${prefix}ajuda
Exibe essa mensagem.

┈ׅ┈۫─ ${prefix}ficha
Manda a ficha para ser preenchida.

┈ׅ┈۫─ ${prefix}lore 
Exibe a história do RPG.

┈ׅ┈۫─ ${prefix}spam
Exibe o spam de divulgação do RPG.

┈ׅ┈۫─ ${prefix}dado (vezes + número total)
Rola um dado de sua escolha.
Exemplo: “${prefix}dado 2d20” - “${prefix}dado 1d10”

┈ׅ┈۫─ ${prefix}marcar (Somente adms)
Menciona todos os membros do grupo.

┈ׅ┈۫─ ${prefix}loja
Manda o link da loja do RPG.

┈ׅ┈۫─ ${prefix}audio
Exibe a lista de áudios disponíveis para serem enviados.

┈ׅ┈۫─ ${prefix}chales
Exibe a lista de chalés e quantos o ocupam no momento.

┈ׅ┈۫─ ${prefix}stchale
Faz o sorteio de qual chalé será o seu.

┈ׅ┈۫─ ${prefix}fichas
Exibe a lista de fichas já preenchidas.
`
    });
}

module.exports = ajuda;