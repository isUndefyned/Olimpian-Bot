async function lore(context) {
    const { sock, sender } = context;

    sock.sendMessage(sender, {
        text: `
            *\`\`\`OLYMPUS: Caçada Divina\`\`\`*
            
            Após séculos de relativa paz, o equilíbrio entre os Deuses do Olimpo e os Titãs se rompeu. Um artefato antigo, a Aegis Estilhaçada, fragmentos do escudo original de Zeus, foi descoberto. Os deuses acreditam que ele pode ser a chave para derrotar os Titãs de uma vez por todas, enquanto os Titãs desejam usá-lo para se libertar e dominar o mundo. Nesse cenário caótico, surge um desafio mortal.
            
            Conhecido como “Torneio dos Deuses”, onde semideuses são forçados a lutar entre si. Com promessas de poder e liberdade sendo oferecidas, os jovens heróis devem escolher seu caminho: lealdade aos deuses ou a promessa de autonomia dos Titãs.
            `
    });
}

module.exports = lore;