const Sequelize = require ('sequelize');

const sequelize = new Sequelize(process.env.DB_BASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados realizado com sucesso!');
}).catch(() => {
    console.log('Erro: Conexão com o banco de dados não realizado com sucesso!');
});

module.exports = sequelize;