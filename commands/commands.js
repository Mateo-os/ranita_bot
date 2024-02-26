const { incrementElement } = require("./increment.js");
const { roll } = require("./roll.js");
const { show } = require("./show.js");
const { album } = require("./album.js");
const { info } = require("./info.js");
const { giftrolls } = require("./giftrolls.js");
const { newPlayer } = require("./newplayer.js");
const { findplayer } = require("./findplayer.js");
const { ownerrolls } = require("./ownergift.js");
const { checkcards } = require("./checkcards.js");
const { help } = require("./help.js");
const { repeats } = require("./repeats.js");

const newplayer = newPlayer;
module.exports = {
  album,
  checkcards,
  findplayer,
  giftrolls,
  help,
  incrementElement,
  info,
  newplayer,
  ownerrolls,
  repeats,
  roll,
  show,
};