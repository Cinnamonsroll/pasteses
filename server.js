//require are npms
let config = require("./config.json")
let Discord = require("discord.js");
let express = require("express");
let app = express();
let mongoose = require("mongoose");
//require model
let paste = require("./models/pastemodel.js");
//connect to database
mongoose.connect(
  config.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => console.log("Connected to db")
);
//set view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//api
let authr = require("./auth/auth.js");
app.use("/api", authr);
//routes
app.get("/", async (req, res) => {
  res.redirect("/new");
});
app.get("/new", async (req, res) => {
  res.render("index", { title: "New paste" });
});
app.get("/docs", async function(req, res) {
  res.render("docs", { title: "Api docs" });
});
app.post("/new", async (req, res) => {
  let createdpaste = await paste.create({
    title: req.body.paste_title,
    code: req.body.code,
    description: req.body.description || "",
    language: req.body.paste_language
  });
  let id = config.id;
  let token = config.token;
  const webhookClient = new Discord.WebhookClient(id, token);
  let codee = req.body.code;
  if(codee.length >= 1000){
    codee  = codee.substring(0, codee.length - 5) + "..."
  }
  let embed = new Discord.MessageEmbed()
  .setColor("#FF9966")
  .setTitle(req.body.paste_title)
  .setDescription(`Language: ${req.body.paste_language}\n Description: ${req.body.description || "No description"}\n\n Code: \`\`\`${codee}\`\`\``)
  .setFooter("created through website")
  webhookClient.send({
    embeds: [embed]
  });
  res.redirect(`/paste/${createdpaste.secret}`);
});
app.get("/paste/:id", async (req, res) => {
  let cop = await paste.findOne({ secret: req.params.id });

  if (!cop) {
    return res.render("404");
  }
  res.render("paste", {
    title: cop.title,
    description: cop.description,
    code: cop.code,
    language: cop.language
  });
});
app.get("*", (req, res) => {
  res.render("404");
});
//listen for start
app.listen(process.env.PORT, () => {
  console.log("Website started");
});
