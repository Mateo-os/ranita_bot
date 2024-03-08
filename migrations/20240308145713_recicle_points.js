const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(recicle_points) => "Jugador"
 * changeColumn(URLimagen) => "Carta"
 *
 */

const info = {
  revision: 4,
  name: "recicle_points",
  created: "2024-03-08T14:57:13.002Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "Jugador",
      "recicle_points",
      { type: Sequelize.INTEGER, field: "recicle_points", defaultValue: 0 },
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Jugador", "recicle_points", { transaction }],
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
