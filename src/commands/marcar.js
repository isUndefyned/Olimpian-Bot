async function marcar(context) {
    const { userMessage, sock, sender, isGroup, isAdmin, isBotOwner, groupMetadata } = context;

    if (!isGroup) {
        await sock.sendMessage(sender, { text: "Este comando só pode ser utilizado em grupos!" });
        return;
    }

    if (!isAdmin() && !isBotOwner) {
        await sock.sendMessage(sender, { text: "Você precisa ser um administrador para usar este comando!" });
        return;
    }

    // Obtém os dados do grupo
    const participants = groupMetadata.participants;

    // Cria uma lista de menções
    const mentions = participants.map((participant) => participant.id);
    const marcar = mentions.map(m => m.replace('@s.whatsapp.net', ''));

    // Envia a mensagem com menções
    await sock.sendMessage(sender, {
        text: "📢 Atenção todos!\nObrigado pela atenção!" + "\n@" + marcar.join('\n@'),
        mentions: mentions,
    });
}

module.exports = marcar;