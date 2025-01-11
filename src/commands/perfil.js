async function perfil(context) {
    const { userMessage, sock, sender, prefix, msg} = context;

    if (userMessage.startsWith(`${prefix}perfil`)) {
        const messageVerify = userMessage.replace(`${prefix}perfil`, "").trim();
        const name = msg.pushname
    }
}