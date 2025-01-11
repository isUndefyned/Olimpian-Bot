async function chales(context) {
    const { sock, sender } = context;

    await sock.sendMessage(sender, {
        text: `
Chalé 1: Zeus (X ocupantes)
Chalé 2: Hera (X ocupantes)
Chalé 3: Poseidon (X ocupantes)
Chalé 4: Deméter (X ocupantes)
Chalé 5: Ares (X ocupantes)
Chalé 6: Athena (X ocupantes)
Chalé 7: Apolo (X ocupantes)
Chalé 8: Ártemis (X ocupantes)
Chalé 9: Hefesto (X ocupantes)
Chalé 10: Afrodite (X ocupantes)
Chalé 11: Hermes (X ocupantes)
Chalé 12: Dionísio (X ocupantes)
        ` });
}
module.exports = chales;