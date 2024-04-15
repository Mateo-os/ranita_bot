const bank = require('./bank');
const cards = require("./cards");
const info = require("./info");
const rolls = require("./rolls");
const trade = require("./trade");
const owner = require("./owner");
const server = require("./server");
const { createplayer} = require("./createplayer");
const { findplayer } = require("./findplayer.js");
const { help } = require("./help.js");
const { newplayer } = require("./newplayer.js");
const { show } = require("./show.js");


module.exports = {
  bank,
  cards,
  info,
  trade,
  rolls,
  owner,
  server,
  createplayer,
  findplayer,
  help,
  newplayer,
  show,
};