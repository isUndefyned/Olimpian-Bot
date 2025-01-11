async function ping(context) {
    const { sock, sender } = context;

    const startTime = Date.now(); // Marca o início do tempo
    await sock.sendMessage(sender, { text: "Calculando ping..." });
    const endTime = Date.now(); // Marca o fim do tempo
    const ping = endTime - startTime;

    // Envia a resposta com o tempo calculado
    await sock.sendMessage(sender, { text: `🏓 Pong! Meu ping é de ${ping}ms.` });
}

module.exports = ping;