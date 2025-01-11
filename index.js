const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { waMessageID } = require('@whiskeysockets/baileys/lib/Store/make-in-memory-store');
const { Boom } = require('@hapi/boom')
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const { setTimeout } = require('timers/promises');
const { profile } = require('console');
const { json } = require('stream/consumers');

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello, Render!");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

async function startBot() {
    // Configuração para salvar as credenciais de autenticação
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Garante que o QR Code será exibido no terminal
        connectTimeoutMs: 60000,
    });

    // Evento para exibir o QR Code no terminal
    sock.ev.on('connection.update', (update) => {

        const { connection, lastDisconnect } = update;
        console.log(update);
        if (connection === 'close') {
            const LOGGED_OUT_CODE = 401;
            const shouldReconnect = lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== LOGGED_OUT_CODE;
            console.error("Last disconnect error:", lastDisconnect.error);

            console.log(
                "Conexão fechada. Razão ",
                lastDisconnect.error,
                ", Reconectando ",
                shouldReconnect
            );

            if (shouldReconnect) {
                try {
                    startBot();
                } catch (error) {
                    console.error("Error during reconnection:", error);
                }

            }

        } else if (connection === 'open') {
            console.log('Bot conectado com sucesso!');
        }
        // const reason = lastDisconnect?.error?.output?.statusCode;
        // console.log(`Conexão fechada. Razão: ${reason || 'Desconhecido'}`);
        // if (reason === 408) {
        //     startBot();
        // }
        // if (reason !== 401) { // Reconecta automaticamente, exceto se for erro de autenticação
        //     startBot();
        //     return;
        // }
    });
    // Salva as credenciais sempre que necessário
    sock.ev.on('creds.update', saveCreds);

    // Evento para escutar mensagens recebidas
    sock.ev.on('messages.upsert', async (message) => {
        //console.log(JSON.stringify(message, null, 2));
        const msg = message.messages[0];
        if (!msg) return; // ignora mensagens vazias
         if (msg.key.fromMe) return; // ignora mensagens enviadas pelo proprio bot

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
                'liveLocationMessage',
                'messageContextInfo.deviceListMetadata',
                'viewOnceMessageV2',
                'viewOnceMessage',
                'viewOnceMessageV2Extension',
                'stickerSyncRmrMessage',
                'lottieStickerMessage',
                'ephemeralMessage',
            ].some(type => msg.message?.[type])
        ) return;

        // Constantes das mensagens
        const prefix = "!"
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage.text || msg.message.ephemeralMessage.message.extendedTextMessage.text;
        const groupMetadata = await sock.groupMetadata(sender);
        const command = text.toLowerCase().split(" ")[0].trim().startsWith(prefix);
        const userMessage = text.toLowerCase();
        const messageData = text.toLowerCase();



        // Constantes de Confirmação
        const isGroup = msg.key.remoteJid.endsWith("@g.us")
        const isAdmin = () => {
            const authorId = msg.key.participant || msg.key.remoteJid;
            const participant = groupMetadata.participants.find(part => part.id === authorId);
            return participant && participant.admin !== null;
        }
        const botOwnerNumber = "558184287779@s.whatsapp.net";
        const isBotOwner = msg.key.participant === botOwnerNumber;

        //Mensagens no console
        const name = msg.pushName || "Desconhecido";
        console.log(`Mensagem recebida de ${name}: ${text}`);


        //Listagem de parâmetros
        const context = {
            sock,
            sender,
            isGroup,
            isAdmin,
            isBotOwner,
            userMessage,
            text,
            botOwnerNumber,
            groupMetadata,
            prefix,
            path,
            fs,
            msg,
            setTimeout
        };

        //Importação dos comandos
        const ajudaCommand = require("./src/commands/ajuda.js");
        const loreCommand = require("./src/commands/lore.js");
        const spamCommand = require("./src/commands/spam.js");
        const dadoCommand = require("./src/commands/dado.js");
        const pingCommand = require("./src/commands/ping.js");
        const marcarCommand = require("./src/commands/marcar.js");
        const audioCommand = require("./src/commands/audio.js");
        const chalesCommand = require("./src/commands/chales.js");
        const stchaleCommand = require("./src/commands/stchale.js");
        const fichaCommand = require("./src/commands/ficha.js");
        const fichasCommand = require("./src/commands/fichas.js");
        const lojaCommand = require("./src/commands/loja.js");

        //Listagem de comandos
        const commandMapper = {
            "ajuda": ajudaCommand,
            "lore": loreCommand,
            "spam": spamCommand,
            "dado": dadoCommand,
            "ping": pingCommand,
            "marcar": marcarCommand,
            "audio": audioCommand,
            "chales": chalesCommand,
            "stchale": stchaleCommand,
            "ficha": fichaCommand,
            "fichas": fichasCommand,
            "loja": lojaCommand
        };

        //Função de execução dos comandos
        const commandName = messageData.replace("!", "").split(" ")[0];

        async function executeCommand(context) {
            if (commandMapper[commandName]) {
                await commandMapper[commandName](context);
                console.log(commandMapper[commandName]);
                console.log(commandName);
            }
        }

        //Verificação de comando
        if (command && commandMapper[commandName]) {
            executeCommand(context);
        } else if (command && !commandMapper[commandName]) {
            await sock.sendMessage(sender, { text: "Comando não existe" });
            return;
        }


    });
}

// Inicia o bot
startBot();
