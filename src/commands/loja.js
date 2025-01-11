async function loja(context) {
    const { sock, sender } = context;
    
    await sock.sendMessage(sender, { text: "[Inserir Link da loja]" });
}

module.exports = loja;