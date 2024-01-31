const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(id_servidor) => "Jugador"
 * changeColumn(id_discord) => "Jugador"
 *
 */

const info = {
  revision: 2,
  name: "noname",
  created: "2024-01-31T01:50:44.748Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Jugador",
      "id_servidor",
      { type: Sequelize.BIGINT, field: "id_servidor" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Jugador",
      "id_discord",
      { type: Sequelize.BIGINT, field: "id_discord" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Jugador",
      "id_servidor",
      { type: Sequelize.INTEGER, field: "id_servidor" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Jugador",
      "id_discord",
      { type: Sequelize.INTEGER, field: "id_discord" },
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
