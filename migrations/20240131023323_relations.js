const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Cromo", deps: [Carta, Jugador]
 *
 */

const info = {
  revision: 3,
  name: "relations",
  created: "2024-01-31T02:33:23.249Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Cromo",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        CartumId: {
          type: Sequelize.INTEGER,
          field: "CartumId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Carta", key: "id" },
          primaryKey: true,
        },
        JugadorId: {
          type: Sequelize.INTEGER,
          field: "JugadorId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Jugador", key: "id" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Cromo", { transaction }],
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
