const cards = require("./cards");
const info = require("./info");
const rolls = require("./rolls");
const trade = require("./trade");
const owner = require("./owner");
const { findplayer } = require("./findplayer.js");
const { help } = require("./help.js");
const { newplayer } = require("./newplayer.js");
const { show } = require("./show.js");

module.exports = {
  cards,
  info,
  trade,
  rolls,
  owner,
  findplayer,
  help,
  newplayer,
  show,
};