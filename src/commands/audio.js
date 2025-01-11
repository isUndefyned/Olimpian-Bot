async function audio(context) {
    const { userMessage, sock, sender, prefix, path, fs } = context;

    if (userMessage.startsWith(`${prefix}audio`)) {
        const audioName = userMessage.replace(`${prefix}audio`, "").trim();
        const audioDir = path.resolve(__dirname, '../../assets/audios');

        if (audioName === "") {
            try {
                const audioFiles = fs.readdirSync(audioDir)
                    .filter(file => file.endsWith(".mp3"))
                    .map(file => file.replace(".mp3", ""));

                if (audioFiles.length > 0) {
                    await sock.sendMessage(sender, {
                        text: `🎵 Lista de áudios disponíveis:\n\n${audioFiles.join("\n")}\n\nUse "${prefix}audio [nome]" para tocar um áudio.`
                    });
                } else {
                    await sock.sendMessage(sender, { text: "❌ Nenhum áudio disponível no momento." });
                }
            } catch (error) {
                console.error("Erro ao listar áudios:", error);
                await sock.sendMessage(sender, { text: "❌ Erro ao acessar a lista de áudios. Tente novamente mais tarde." });
            }
        } else {
            const audioPath = path.join(audioDir, `${audioName}.mp3`);
            console.log("Tentando acessar:", audioPath);

            if (fs.existsSync(audioPath)) {
                await sock.sendMessage(sender, { audio: { url: audioPath }, ptt: true });
            } else {
                await sock.sendMessage(sender, { text: "❌ Este áudio não existe. Certifique-se de usar o nome correto." });
            }
        }
    }
}

module.exports = audio;