const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Carta", deps: []
 * createTable() => "Jugador", deps: []
 * createTable() => "Cromo", deps: [Carta, Jugador]
 *
 */

const info = {
  revision: 1,
  name: "initial",
  created: "2024-01-31T22:22:01.113Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Carta",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        nombre: { type: Sequelize.STRING, field: "nombre" },
        serie: { type: Sequelize.STRING, field: "serie" },
        rareza: { type: Sequelize.INTEGER, field: "rareza" },
        numero: { type: Sequelize.INTEGER, field: "numero" },
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
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Jugador",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        nombre: { type: Sequelize.STRING, field: "nombre" },
        id_discord: { type: Sequelize.BIGINT, field: "id_discord" },
        id_servidor: { type: Sequelize.BIGINT, field: "id_servidor" },
        rolls: { type: Sequelize.INTEGER, field: "rolls", defaultValue: 1 },
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
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Cromo",
      {
        cantidad: {
          type: Sequelize.INTEGER,
          field: "cantidad",
          defaultValue: 0,
        },
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
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
          unique: "Cromo_JugadorId_CartumId_unique",
        },
        JugadorId: {
          type: Sequelize.INTEGER,
          field: "JugadorId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Jugador", key: "id" },
          unique: "Cromo_JugadorId_CartumId_unique",
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Carta", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Cromo", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Jugador", { transaction }],
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
