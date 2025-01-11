async function ficha(context) {
    const { sock, sender} = context;

    await sock.sendMessage(sender, { text: "[Inserir texto de ficha padrão]" });
}

module.exports = ficha;