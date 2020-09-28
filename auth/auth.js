let router = require("express").Router();
let config = require("../config.json");
let Discord = require("discord.js");
let paste = require("../models/pastemodel.js");
router.post("/new", async (req, res) => {
  try {
    let title = req.body.title;
    let code = req.body.code;
    let language = req.body.lang;
    if (!title) return res.json({ error: "No title provided" });
    if (!code) return res.json({ error: "No code provided" });
    if (!language) return res.json({ error: "No language provided" });

    let createdpaste = await paste.create({
      title: title,
      code: code,
      description: req.body.description || "",
      language: language
    });
    let id = config.id;
    let token = config.token;
    const webhookClient = new Discord.WebhookClient(id, token);
    let codee = code;
    if (codee.length >= 1000) {
      codee = codee.substring(0, codee.length - 5) + "...";
    }
    let embed = new Discord.MessageEmbed()
      .setColor("#FF9966")
      .setTitle(title)
      .setDescription(
        `Language: ${language}\n Description: ${req.body.description ||
          "No description"}\n\n Code: \`\`\`${codee}\`\`\``
      )
      .setFooter("created through api");
    webhookClient.send({
      embeds: [embed]
    });
    return res.json({
      success: true,
      url: `https://pasteses.glitch.me/paste/${createdpaste.secret}`
    });
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
});
module.exports = router;
