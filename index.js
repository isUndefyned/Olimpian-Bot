const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { waMessageID } = require('@whiskeysockets/baileys/lib/Store/make-in-memory-store');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');


async function startBot() {
    // Configuração para salvar as credenciais de autenticação
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Garante que o QR Code será exibido no terminal
    });

    // Evento para exibir o QR Code no terminal
    sock.ev.on('connection.update', (update) => {

        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(`Conexão fechada. Razão: ${reason || 'Desconhecido'}`);
            if (reason === 408) {
                startBot();
                return;
            }
            if (reason !== 401) { // Reconecta automaticamente, exceto se for erro de autenticação
                startBot();
                return;
            }
        } else if (connection === 'open') {
            console.log('Bot conectado com sucesso!');
        }
    });
    // Salva as credenciais sempre que necessário
    sock.ev.on('creds.update', saveCreds);

    // Evento para escutar mensagens recebidas
    sock.ev.on('messages.upsert', async (message) => {
        console.log(JSON.stringify(message, null, 2));
        const msg = message.messages[0];
        if (!msg) return; // ignora mensagens vazias
        //if (msg.key.fromMe) return; // ignora mensagens enviadas pelo proprio bot

        //Ignorar mensagens / anticrash
        if (msg.messageStubType) return;
        if (
            [
                'reactionMessage',
                'pollCreationMessageV3',
                'pollUpdateMessage',
                'pinInChatMessage',
                'imageMessage',
                'videoMessage',
                'audioMessage',
                'stickerMessage',
                'contactMessage',
                'documentMessage',
                'editedMessage',
                'protocolMessage',
                'botInvokeMessage',
                'groupMentionedMessage',
                'documentWithCaptionMessage',
            ].some(type => msg.message?.[type])
        ) return;

        // Constantes das mensagens
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage.text;
        const groupMetadata = await sock.groupMetadata(sender);

        // Constantes de Confirmação
        const isGroup = msg.key.remoteJid.endsWith("@g.us")
        const isAdmin = () => {
            const authorId = msg.key.participant || msg.key.remoteJid;
            const participant = groupMetadata.participants.find(part => part.id === authorId);
            return participant && participant.admin !== null;
        }

        var name = msg.pushName
        if (name === "") {
            var name = sender;
        }
        console.log(`Mensagem recebida de ${name}: ${text}`);

        // TESTES
        // console.log(groupMetadata)
        // console.log(msg.key)


        /* Comandos do bot aqui abaixo*/

        // enviar mensagem
        const userMessage = text.toLowerCase();

        if (userMessage === "!ajuda") {
            sock.sendMessage(sender, {
                text: `\`\`\`ㅤPrefix: !ㅤ\`\`\`
ㅤㅤ       𓂃ֺ⏜ Ψ𓏸🤖
            •◦ೋ•❥◦ೋ•
   COMANDOS DISPONÍVEIS
    ㅤ𓏲 ꫶۫ 𖤐̸ ۪ ⃘◌ ࣪ 🔱  ࣭ ◌⃘ ۪ ☾ ︎ ۫

    ฺฺ❆↳ Opa, sou o Olimpian, bot do RPG “Olympus: Caçada Divina” e esses são os meus comandos disponíveis:

  ┈ׅ┈۫─ !ajuda
Exibe essa mensagem.

  ┈ׅ┈۫─ !lore 
Exibe a história do RPG.

  ┈ׅ┈۫─ !spam
Exibe o spam de divulgação do RPG.

  ┈ׅ┈۫─ !dado (vezes + número total)
Rola um dado de sua escolha.
Exemplo: “!dado 2d20” - “!dado 1d10”

  ┈ׅ┈۫─ !marcar (Somente adms)
Menciona todos os membros do grupo.

  ┈ׅ┈۫─ !audios
Exibe a lista de áudios disponíveis para serem enviados.

  ┈ׅ┈۫─ !chales
Exibe a lista de chalés e quantos o ocupam no momento.

  ┈ׅ┈۫─ !stchale
Faz o sorteio de qual chalé será o seu.`
            });
        }

        if (userMessage === "!lore") {
            sock.sendMessage(sender, {
                text: `
                    *\`\`\`OLYMPUS: Caçada Divina\`\`\`*
                    
                    Após séculos de relativa paz, o equilíbrio entre os Deuses do Olimpo e os Titãs se rompeu. Um artefato antigo, a Aegis Estilhaçada, fragmentos do escudo original de Zeus, foi descoberto. Os deuses acreditam que ele pode ser a chave para derrotar os Titãs de uma vez por todas, enquanto os Titãs desejam usá-lo para se libertar e dominar o mundo. Nesse cenário caótico, surge um desafio mortal.
                    
                    Conhecido como “Torneio dos Deuses”, onde semideuses são forçados a lutar entre si. Com promessas de poder e liberdade sendo oferecidas, os jovens heróis devem escolher seu caminho: lealdade aos deuses ou a promessa de autonomia dos Titãs.
                    `
            });
        }

        if (userMessage === "!spam") {
            sock.sendMessage(sender, {
                text: `
                ㅤ⭒ㅤ
ㅤㅤ       𓂃ֺ⏜ Ψ𓏸🌊
            •◦ೋ•❥◦ೋ•
    𝙾𝙻𝚈𝙼𝙿𝚄𝚂: 𝙲𝚊𝚌̧𝚊𝚍𝚊 𝙳𝚒𝚟𝚒𝚗𝚊
    ㅤ𓏲 ꫶۫ 𖤐̸ ۪ ⃘◌ ࣪ 🔱  ࣭ ◌⃘ ۪ ☾ ︎ ۫ 

 ฺฺ❆┈ׅ┈۫─ 𝐒obre o 𝐑𝐏𝐆:

    ៲໑଼̣̥◗𝐒tαtus:
    ┈ׅ┈۫─ Em divulgação.
    ៲໑଼̣̥◗𝐓emάticα:
    ┈ׅ┈۫─ Percy Jackson

    ┈ׅ┈۫─ “OLYMPUS: Caçada Divina” é um RPG inspirado no mundo de Percy Jackson, com uma história completamente nova e cheia de aventuras e desafios, mas sem acabar com a essência da franquia!
    ┈ׅ┈۫─ Contamos com um sistema de conquistas, sendo possível que você evolua e cresça cada vez mais dentro do RPG. Consiga habilidades novas, artefatos mágicos, armas místicas e derrote seus inimigos! 
    ┈ׅ┈۫─ Com um bot 100% original e feito do zero para sanar todas as suas dúvidas e auxiliar na criação de seu personagem. 
     ┈ׅ┈۫─ Sistema de loja, onde você poderá gastar suas moedas com o que desejar e estiver disponível! Compre artefatos mágicos, poções, armas ou até mesmo mande um singelo - ou não - presente para a pessoa amada, podendo escolher entre ter uma entrega discreta ou extrapolada para que todos vejam o seu amor! 


    ฺฺ❆↳ 𝐒inopse:
    ┈ׅ┈۫─ Prepare-se para uma aventura épica onde mitos e magia colidem! Em um mundo onde os Deuses do Olimpo e os Titãs estão à beira da guerra, uma competição mortal se inicia: o Torneio dos Deuses. 

Você, um semideus, é convocado a participar de um desafio que irá testar suas habilidades, coragem e lealdade. Com promessas de poder e recompensas inimagináveis, você e seus companheiros devem enfrentar criaturas míticas, desvendar mistérios antigos e tomar decisões que poderão mudar o destino do mundo.

Durante sua jornada, você se deparará com profecias enigmáticas, fragmentos de um artefato poderoso e desafios que testarão não apenas sua força física, mas também suas convicções. Será que você irá se aliar aos Deuses ou se deixará seduzir pela promessa de autonomia dos Titãs?

Prepare-se para explorar locais míticos, sobreviver a provações desafiadoras e lutar em batalhas épicas. O destino de todos está em suas mãos. Aventure-se no universo de Percy Jackson como nunca antes e descubra se você tem o que é preciso para se tornar um verdadeiro herói!

Junte-se a nós e escreva sua própria lenda! 

     ฺฺ❆↳𝐋ink:
    ┈ׅ┈۫─ 

       @Ꮮunα ꪡood./𝐂ɾ: ☾𝐋iŧŧłє 𝐁rєη𖤐̸  
                `
            })
        }

        if (userMessage === "!dado") {
            await sock.sendMessage(sender, { text: "Você deve inserir um valor." });
            return;
        }
        if (userMessage.startsWith("!dado ")) {
            const input = userMessage.replace("!dado ", "").trim();

            const regex = /^(\d+)d(\d+)$/i;
            const match = input.match(regex);

            if (match) {
                const numDices = parseInt(match[1], 10);
                const numFaces = parseInt(match[2], 10);

                if (numDices < 1 || numFaces < 2) {
                    await sock.sendMessage(sender, { text: "Por favor, forneça uma quantidade válida de dados (X) e faces (Y), sendo Y maior ou igual a 2. Exemplo: !dado 2d20" });
                    return;
                }

                let total = 0
                let resultados = [];
                for (let i = 0; i < numDices; i++) {
                    const resultado = (Math.floor(Math.random() * numFaces) + 1);
                    resultados.push(resultado);
                    total += resultado;
                }

                await sock.sendMessage(sender, {
                    text: `🎲 O dado rolou ${numDices} vez(es) e obteve: ${resultados.join(", ")}\nTotal: ${total} \n(1 a ${numFaces})`
                });
            } else {
                const maxNumber = parseInt(text.replace("!dado ", ""), 10);

                if (!isNaN(maxNumber) && maxNumber >= 2) {
                    const resultado = Math.floor(Math.random() * (maxNumber + 1));

                    await sock.sendMessage(sender, { text: `🎲 O dado rolou e caiu em: ${resultados} (1 a ${maxNumber})` });

                } else {
                    await sock.sendMessage(sender, { text: "Por favor, forneça um número válido maior ou igual a 2. Exemplo: !dado 100" });
                }
            }

        }

        if (text.toLowerCase() === "!ping") {
            const startTime = Date.now(); // Marca o início do tempo
            await sock.sendMessage(sender, { text: "Calculando ping..." });
            const endTime = Date.now(); // Marca o fim do tempo
            const ping = endTime - startTime;

            // Envia a resposta com o tempo calculado
            await sock.sendMessage(sender, { text: `🏓 Pong! Seu ping é de ${ping}ms.` });
        }

        if (userMessage === "!marcar") {
            if (!isGroup) {
                await sock.sendMessage(sender, { text: "Este comando só pode ser utilizado em grupos!" });
                return;
            }

            if (!isAdmin()) {
                await sock.sendMessage(sender, { text: "Você precisa ser um administrador para usar este comando!" });
                return;
            }

            // Obtém os dados do grupo
            const groupMetadata = await sock.groupMetadata(sender);
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

        if (userMessage === "!ficacomela") {
            await sock.sendMessage(sender, { audio: { url: "./assets/audios/ficacomelaentao.mp3" }, ptt: true });
        }
        if (userMessage === "!geladeiratsunami") {
            await sock.sendMessage(sender, { audio: { url: "./assets/audios/geladeira tsunami.mp3" }, ptt: true });
        }
        if (userMessage === "!coringa") {
            await sock.sendMessage(sender, { audio: { url: "./assets/audios/ghostthedowncool.mp3" }, ptt: true });
        }


    });
}

// Inicia o bot
startBot();
