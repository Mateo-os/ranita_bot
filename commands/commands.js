const { album } = require("./album.js");
const { assignfreerolls } = require("./freerolls.js");
const { checkcards } = require("./checkcards.js");
const { checkseries } = require("./checkseries.js");
const { findplayer } = require("./findplayer.js");
const { giftrolls } = require("./giftrolls.js");
const { give } = require("./give.js");
const { help } = require("./help.js");
const { info } = require("./info.js");
const { newPlayer } = require("./newplayer.js");
const { ownerrolls } = require("./ownergift.js");
const { repeats } = require("./repeats.js");
const { roll } = require("./roll.js");
const { show } = require("./show.js");
const { trade } = require("./trade.js");

const newplayer = newPlayer;
module.exports = {
  album,
  checkcards,
  checkseries,
  findplayer,
  giftrolls,
  give,
  help,
  assignfreerolls,
  info,
  newplayer,
  ownerrolls,
  repeats,
  roll,
  show,
  trade,
};