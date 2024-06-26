async function show(responses, message, ephemeral = false) {
    const messagelist = [];
    for (let i in responses) {
        r = responses[i]
        if(!r)
            continue
        if (r.length < 2000) {
            message.channel.send(r);
            continue;
        }
        const wrap = (s) => { return '\`\`\`' + s + '\`\`\`' };
        const mono = r.startsWith('\`');
        let temp = r.replace(/\`\`\`/g, "");
        let index = 0;

        while (index < temp.length) {
            const end = index + 1001;
            const tail = temp.slice(end);
            let buffer = temp.slice(index, end);
            buffer += tail.slice(0, tail.indexOf('\n'));
            index += buffer.length;
            if (mono) {
                buffer = wrap(buffer);
            }
            messagelist.push(await message.channel.send(buffer));
        }
    }
    responses.length = 0;
    return messagelist;
}

module.exports = { show };