const { assignfreerolls } = require("./freerolls.js");
const info = require("./info");
const { findplayer } = require("./findplayer.js");
const { giftrolls } = require("./giftrolls.js");
const { give } = require("./give.js");
const { help } = require("./help.js");
const { newPlayer } = require("./newplayer.js");
const { ownerrolls } = require("./ownergift.js");
const { repeats } = require("./repeats.js");
const { roll } = require("./roll.js");
const { show } = require("./show.js");
const trade = require("./trade");
const cards = require("./cards");
const newplayer = newPlayer;

module.exports = {
  assignfreerolls,
  cards,
  findplayer,
  giftrolls,
  give,
  help,
  info,
  newplayer,
  ownerrolls,
  repeats,
  roll,
  show,
  trade,
};