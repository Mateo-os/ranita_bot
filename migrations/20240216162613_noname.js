const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(serie) => "Carta"
 * changeColumn(nombre) => "Carta"
 *
 */

const info = {
  revision: 2,
  name: "noname",
  created: "2024-02-16T16:26:13.103Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Carta",
      "serie",
      { type: Sequelize.STRING, field: "serie", unique: "compositeIndex" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Carta",
      "nombre",
      { type: Sequelize.STRING, field: "nombre", unique: "compositeIndex" },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "Carta",
      "serie",
      { type: Sequelize.STRING, field: "serie" },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "Carta",
      "nombre",
      { type: Sequelize.STRING, field: "nombre" },
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
