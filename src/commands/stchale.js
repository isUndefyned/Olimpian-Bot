async function stchale(context) {
    const { isAdmin, isBotOwner, sock, sender, setTimeout } = context;

    if (!isAdmin() && !isBotOwner) {
        await sock.sendMessage(sender, { text: "Você precisa ser um administrador para usar este comando!" });
        return;
    }
    const chaleList = [
        { name: "Chalé 1: Zeus" },
        { name: "Chalé 2: Hera" },
        { name: "Chalé 3: Poseidon" },
        { name: "Chalé 4: Deméter" },
        { name: "Chalé 5: Ares" },
        { name: "Chalé 6: Athena" },
        { name: "Chalé 7: Apolo" },
        { name: "Chalé 8: Ártemis" },
        { name: "Chalé 9: Hefesto" },
        { name: "Chalé 10: Afrodite" },
        { name: "Chalé 11: Hermes" },
        { name: "Chalé 12: Dionísio" }
    ];

    const sortChale = chaleList[Math.floor(Math.random() * chaleList.length)];
    await sock.sendMessage(sender, { text: "🎲Sorteando, aguarde..." });
    await setTimeout(2000);
    await sock.sendMessage(sender, { text: `Sorteio concluido!, seu chalé é:\n${sortChale.name}` });

}

module.exports = stchale;