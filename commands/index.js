const cards = require("./cards");
const info = require("./info");
const rolls = require("./rolls");
const trade = require("./trade");
const { findplayer } = require("./findplayer.js");
const { give } = require("./give.js");
const { help } = require("./help.js");
const { newplayer } = require("./newplayer.js");
const { ownerrolls } = require("./ownergift.js");
const { repeats } = require("./repeats.js");
const { show } = require("./show.js");

module.exports = {
  cards,
  info,
  trade,
  rolls,
  findplayer,
  give,
  help,
  newplayer,
  ownerrolls,
  repeats,
  show,
};