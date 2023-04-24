    const Sequelize = require('sequelize');
    const db = require('./db');

    const User = db.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        telefone:{
            type: Sequelize.INTEGER,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    //Criar a tabela com Sequelize
    //User.sync();

    //Exclui a tabela e cria novamente a tabela
    //User.sync({ force: true });

    //Verifica se há alguma diferença na tabela, realiza a alteração
    //User.sync({ alter: true });

    module.exports = User;