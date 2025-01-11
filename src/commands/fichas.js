async function fichas(context) {
    const { userMessage, sock, sender, path, fs, setTimeout, prefix } = context;
    
    if (userMessage.startsWith(`${prefix}fichas`)) {
        const fichaName = userMessage.replace(`${prefix}fichas `, "").trim();
        const fichaDir = path.resolve(__dirname, '../../assets/fichas');

        if (fichaName === "") {
            const fichaFile = fs.readdirSync(fichaDir);
            if (fichaFile.length > 0) {
                const fichaList = fichaFile.map(file => file.replace(".txt", ""));
                await sock.sendMessage(sender, { text: `${fichaList.join("\n")}` })
            } else {
                await sock.sendMessage(sender, { text: "nenhuma ficha encontrada" });
            }
        } else {
            const fichaPath = path.join(fichaDir, `${fichaName}.txt`);

            if (fs.existsSync(fichaPath)) {
                let fichaContent = fs.readFileSync(fichaPath, 'utf-8');
                const keyword = "{{idade}}";
                const bornDate = new Date("2025-01-07");

                const today = new Date();
                const diffDays = Math.floor((today - bornDate) / (1000 * 60 * 60 * 24));

                fichaContent = fichaContent.replace(keyword, `${diffDays} dias`);

                await sock.sendMessage(sender, { text: "Carregando ficha, aguarde..." })
                await setTimeout(3000);
                await sock.sendMessage(sender, { text: `${fichaContent}` });
            } else {
                await sock.sendMessage(sender, { text: "Essa ficha não existe, certifique-se de escrever corretamente" });
            }
        }
    }
}

module.exports = fichas;