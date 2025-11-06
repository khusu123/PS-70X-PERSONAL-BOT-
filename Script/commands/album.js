const axios = require("axios");
const path = require("path");
const fs = require("fs");

// তোমার API URL
const BASE_API_URL = "http://85.215.137.163:14502";

module.exports.config = {
    name: "album",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Ullash",
    description: "Manage and view video/photo albums",
    usePrefix: true,
    prefix: true,
    category: "Media",
    commandCategory: "Media",
    usages: "Empty to see list, or ak [category] to get media.",
    cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    const albumOptionsPage1 = [
        "funny","islamic","sad","anime","cartoon",
        "love","horny","couple","flower","marvel"
    ];
    const albumOptionsPage2 = [
        "aesthetic","sigma","lyrics","cat","18plus",
        "freefire","football","girl","friends","cricket"
    ];

    const toBold = (text) => text.replace(/[a-z]/g, (c) => String.fromCodePoint(0x1d41a + c.charCodeAt(0) - 97));
    const toBoldNumber = (num) => String(num).replace(/[0-9]/g, (c) => String.fromCodePoint(0x1d7ec + parseInt(c)));

    const formatOptions = (options, startIndex = 1) =>
        options.map((opt, i) => `✨ | ${toBoldNumber(i + startIndex)}. ${toBold(opt)}`).join("\n");

    // Page 2
    if (args[0] === "2") {
        const message2 =
        "💫 𝐂𝐡𝐨𝐨𝐬𝐞 𝐚𝐧 𝐚𝐥𝐛𝐮𝐦 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲 💫\n" +
        "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
        formatOptions(albumOptionsPage2, 11) +
        "\n✺━━━━━━━◈◉◈━━━━━━━✺\n🎯 | 𝐏𝐚𝐠𝐞 [𝟐/𝟐]\n✺━━━━━━━◈◉◈━━━━━━━✺";

        await api.sendMessage({ body: message2 }, threadID, (error, info) => {
            if (!error) {
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: senderID,
                    link: albumOptionsPage2,
                });
            }
        }, messageID);
        return;
    }

    // Page 1
    if (!args[0] || args[0].toLowerCase() === "list") {
        api.setMessageReaction("☢️", messageID, () => {}, true);
        const message =
        "💫 𝐂𝐡𝐨𝐨𝐬𝐞 𝐚𝐧 𝐚𝐥𝐛𝐮𝐦 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲 💫\n" +
        "✺━━━━━━━◈◉◈━━━━━━━✺\n" +
        formatOptions(albumOptionsPage1) +
        `\n✺━━━━━━━◈◉◈━━━━━━━✺\n🎯 | 𝐏𝐚𝐠𝐞 [𝟏/𝟐]\nℹ | 𝐓𝐲𝐩𝐞: ${global.config.PREFIX}ak 2 - 𝐧𝐞𝐱𝐭 𝐩𝐚𝐠𝐞\n✺━━━━━━━◈◉◈━━━━━━━✺`;

        await api.sendMessage({ body: message }, threadID, (error, info) => {
            if (!error) {
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: senderID,
                    link: albumOptionsPage1,
                });
            }
        }, messageID);
        return;
    }

    const validCategories = [
        "funny","islamic","sad","anime","cartoon",
        "love","horny","couple","flower","marvel",
        "aesthetic","sigma","lyrics","cat","18plus",
        "freefire","football","girl","friends","cricket"
    ];

    const command = args[0].toLowerCase();

    if (!validCategories.includes(command)) {
        return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲! 𝐓𝐲𝐩𝐞 '/ak' 𝐭𝐨 𝐬𝐞𝐞 𝐥𝐢𝐬𝐭.", threadID, messageID);
    }

    return api.sendMessage(`📁 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲: ${command}...`, threadID, messageID);
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    api.unsendMessage(handleReply.messageID);

    const adminID = "100001088468923";
    const replyNum = parseInt(event.body);
    if (isNaN(replyNum)) {
        return api.sendMessage("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐚 𝐯𝐚𝐥𝐢𝐝 𝐧𝐮𝐦𝐛𝐞𝐫.", event.threadID, event.messageID);
    }

    const categories = [
        "funny","islamic","sad","anime","cartoon",
        "love","horny","couple","flower","marvel",
        "aesthetic","sigma","lyrics","cat","18plus",
        "freefire","football","girl","friends","cricket"
    ];

    if (replyNum < 1 || replyNum > categories.length) {
        return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐬𝐞𝐥𝐞𝐜𝐭𝐢𝐨𝐧.", event.threadID, event.messageID);
    }

    const selectedCategory = categories[replyNum - 1];

    if ((selectedCategory === "horny" || selectedCategory === "18plus") && event.senderID !== adminID) {
        return api.sendMessage("🚫 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐧𝐨𝐭 𝐚𝐮𝐭𝐡𝐨𝐫𝐢𝐳𝐞𝐝 𝐟𝐨𝐫 𝐭𝐡𝐢𝐬 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲.", event.threadID, event.messageID);
    }

    const captions = {
        funny: "🤣 > Funny Video",
        islamic: "😇 > Islamic Video",
        sad: "🥺 > Sad Video",
        anime: "😘 > Anime Video",
        cartoon: "😇 > Cartoon Video",
        love: "😇 > Love Video",
        horny: "🥵 > Horny Video",
        couple: "❤️ > Couple Video",
        flower: "🌸 > Flower Video",
        marvel: "🎯 > Marvel Video",
        aesthetic: "🎀 > Aesthetic Video",
        sigma: "🐤 > Sigma Video",
        lyrics: "🥰 > Lyrics Video",
        cat: "🐱 > Cat Video",
        "18plus": "🔞 > 18+ Video",
        freefire: "🎮 > Freefire Video",
        football: "⚽ > Football Video",
        girl: "👧 > Girl Video",
        friends: "👫 > Friends Video",
        cricket: "🏏 > Cricket Video"
    };

    try {
        const res = await axios.get(`${BASE_API_URL}/album?type=${selectedCategory}`);
        const mediaUrl = res.data.data;

        if (!mediaUrl) {
            return api.sendMessage("⚠️ No content found in this category.", event.threadID, event.messageID);
        }

        const response = await axios({
            method: 'get',
            url: mediaUrl,
            responseType: 'stream'
        });

        const filename = path.basename(mediaUrl).split("?")[0];
        const filePath = path.join(__dirname, "cache", `${Date.now()}_${filename}`);
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
            api.sendMessage({
                body: captions[selectedCategory] || `🎬 ${selectedCategory} content`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        });

        writer.on('error', (err) => {
            console.error("Write Error:", err);
            api.sendMessage("❌ Failed to send media.", event.threadID, event.messageID);
        });

    } catch (err) {
        console.error("Axios Error:", err.message);
        return api.sendMessage("❌ Something went wrong. Try again!", event.threadID, event.messageID);
    }
};
