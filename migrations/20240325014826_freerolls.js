const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(freerolls) => "Jugador"
 * changeColumn(URLimagen) => "Carta"
 * changeColumn(rolls) => "Jugador"
 *
 */

const info = {
  revision: 4,
  name: "freerolls",
  created: "2024-03-25T01:48:26.428Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "Jugador",
      "freerolls",
      { type: Sequelize.INTEGER, field: "freerolls", defaultValue: 1 },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Carta",
      "URLimagen",
      { type: Sequelize.STRING, field: "URLimagen", defaultValue: "103N1r2" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Jugador",
      "rolls",
      { type: Sequelize.INTEGER, field: "rolls", defaultValue: 0 },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Jugador", "freerolls", { transaction }],
  },
  {
    fn: "changeColumn",
    params: [
      "Carta",
      "URLimagen",
      {
        type: Sequelize.STRING,
        field: "URLimagen",
        defaultValue: "https://i.imgur.com/Fsgi9QT.jpeg",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Jugador",
      "rolls",
      { type: Sequelize.INTEGER, field: "rolls", defaultValue: 1 },
      { transaction },
    ],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
