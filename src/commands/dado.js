async function dado(context) {
    const { userMessage, sock, sender, text, prefix } = context;

    if (userMessage === `${prefix}dado`) {
        await sock.sendMessage(sender, { text: "Você deve inserir um valor." });
        console.log(messageData)
        return;
    }
    if (userMessage.startsWith(`${prefix}dado `)) {
        userMessage.trim();
        const input = userMessage.replace(`${prefix}dado `, "").trim();

        const regex = /^(\d+)d(\d+)([+-]\d+)?$/i;
        const match = input.match(regex);

        if (match) {
            const numDices = parseInt(match[1], 10);
            const numFaces = parseInt(match[2], 10);
            const modifier = match[3] ? parseInt(match[3], 10) : 0;

            if (numDices < 1 || numFaces < 2) {
                await sock.sendMessage(sender, { text: `Por favor, forneça uma quantidade válida de dados (X) e faces (Y), sendo Y maior ou igual a 2. Exemplo: ${prefix}dado 2d20` });
                return;
            }

            let total = 0
            let resultados = [];
            for (let i = 0; i < numDices; i++) {
                const resultado = (Math.floor(Math.random() * numFaces) + 1);
                resultados.push(resultado);
                total += resultado;
            }

            const totalModifier = total + modifier;

            await sock.sendMessage(sender, {
                text: `🎲 O dado rolou ${numDices} vez(es) e obteve: ${resultados.join(", ")}\n` +
                    `Modificador: ${modifier >= 0 ? `+${modifier}` : modifier}\n` +
                    `Total sem modificador: ${total}\n` +
                    `Total com modificador: ${totalModifier} \n(1 a ${numFaces})`
            });
        } else {
            const maxNumber = parseInt(text.replace(`${prefix}dado `, ""), 10);

            if (!isNaN(maxNumber) && maxNumber >= 2) {
                const result = Math.floor(Math.random() * (maxNumber + 1));

                await sock.sendMessage(sender, { text: `🎲 O dado rolou e caiu em: ${result} (1 a ${maxNumber})` });

            } else {
                await sock.sendMessage(sender, { text: `Por favor, forneça um número válido maior ou igual a 2. Exemplo: ${prefix}dado 100` });
            }
        }

    }
}

module.exports = dado;