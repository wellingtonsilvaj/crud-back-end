    //incluir o arquivo com as variaveis de ambiente
    require('dotenv').config();
    const express = require('express');
    const {engine} = require('express-handlebars');
    const moment = require('moment');
    //criar sessao e armazenar dados no servidor
    const session = require('express-session');
    // Criar variavel global dentro do flash
    const flash = require('connect-flash');
    //Criptografa senha
    const bcrypt = require('bcryptjs')

    const app = express();

    const User = require('./models/User');

    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Criar um middleware para manipular sessão
    app.use(session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: true
    }));

    //usar o flash para armazernar mensagens na sessão
    app.use(flash());

    //criar o middleware para manipular as mensagens
    app.use((req, res, next)=> {
        //locais usados para criar variavel global "success_msg"
        res.locals.success_msg = req.flash('success_msg');
        //locais usados para criar variavel global "error_msg"
        res.locals.error_msg = req.flash('error_msg');
        next()
    });
    app.engine('handlebars', engine({
        helpers: {
            formatDate: (date) => {
                return moment(date).format('DD/MM/YYYY');
            },
            formatDateTime: (date) => {
                return moment(date).format('DD/MM/YYYY HH:mm:ss');
            }
        }
    }));
    app.set('view engine', 'handlebars');
    app.set('views', './views');

    app.get('/', (req, res) => { 
        User.findAll({
            attributes: ['id', 'name', 'email', 'telefone', 'createdAt', 'updatedAt'],
            order: [['id', 'DESC']]
        })
        .then((users) => {
            res.render('list-user', {users: users.map(id=> id.toJSON())});  
        })
    });

    app.get('/add-user', (req, res) => {
        res.render('add-user');
    });

    app.post('/add-user', async (req, res) => {
       //criptografar senha cadastrada
        var data = req.body;
        data.password = await bcrypt.hash(data.password, 8);
        
        await User.create(data)
        .then(() => {
            // criar mensagem de usuario cadastrado com sucesso
            req.flash("success_msg", "USUARIO CADASTRADO COM SUCESSO!");
            res.redirect('/');
            //res.send("Usuário cadastrado com sucesso!");
        }).catch(() => {
            // criar mensagem de usuario não cadastrado com sucesso
            req.flash("error_msg", "USUARIO NÃO CADASTRADO COM SUCESSO!");
        });
    });


    //CRIAR ROTA PARA CARREGAR O FORMULARIO PARA EDITAR USUÁRiO

    app.get('/edit-user/:id', (req, res) => {
        
        User.findByPk(req.params.id,
            {
                //indicar quais colunas recuperar
                attributes: ['id', 'name',  'email', 'telefone'],
            }).then((user) => {
                //carregar pagina com o formulario e enviar os dados do registro
                res.render('edit-user', {user: user.dataValues});
            }).catch(()=> {
                //criar mensagem de usuario não encontrado
                req.flash("error_msg", "ERRO: Usuário não encontrado!");
                res.redirect('/')
            });
        });

        //CRIAR ROTA PARA EDITAR USUARIO NO BD

    app.post('/edit-user/:id', (req, res) => {
        var data = req.body;
        User.update(
            data,{
                where:{ id: req.params.id }
            }
        ).then(() => {
            //criar a mensagem de usuario editado com sucesso
            req.flash("success_msg", "usuario editado com sucesso!");
            res.redirect('/');
        }).catch(() => {
            req.flash("error_msg", "ERRO: Usuário não editado!");
        });
    });
        //VISUALIZAR USUARIO 

    app.get('/view-user/:id', (req, res) => {

        User.findByPk(req.params.id, {
        //indicar quais colunas recuperar   
            attributes: ['id', 'name', 'email', 'telefone', 'createdAt', 'updatedAt'],
        }) .then((user) => {
            res.render('view-user', {user: user.dataValues});
        }).catch(() => {
            //criar mensagem de usuario não encontrado
            req.flash("error_msg", "ERRO: Usuário não encontrado")
            res.redirect('/')
        });
    });
        //APAGAR USUARIO
    app.get('/del-user/:id', async (req, res) => {
        //Receber o id do usuario como parametro

        User.destroy ({
            where: {'id': req.params.id}
        }).then(() => {
            // criar mensagem de usuario apagado com sucesso
            req.flash("success_msg", "USUARIO APAGADO COM SUCESSO!");
            res.redirect('/');
        }).catch(() => {
            // criar a mesagem de usuario não apagado com sucesso

            req.flash("error_msg", "ERRO: USUARIO NÃO APAGADO COM SUCESSO");
        });
    });

    //EDITAR A SENHA

    app.get('/edit-password/:id', (req, res) => {

        User.findByPk(req.params.id,{
            attributes: ['id'],   
        }).then((user) => {
        res.render('edit-password', {user: user.dataValues});
    }).catch(() => {
    req.flash("error_msg", "ERRO: senha não alterada!")
        res.redirect('/')
        });
    });

    // Criar a rota para editar senha do usuário no BD
    app.post('/edit-password/:id', async(req, res) => {
        var data = req.body;
        data.password = await bcrypt.hash(data.password, 8)
        User.update(
            data,
            {
                where:{ id:  req.params.id }
            }
            ).then(() => {
                //criar a mensagem de senha editada com sucesso
                req.flash("success_msg", "Senha alterada com sucesso!");
                res.redirect('/');
            }).catch(() => {
                req.flash("error_msg", "ERRO: Senha não alterada!");
    });
    });

    app.listen(8080, () => {
        console.log("Servidor iniciado na porta 8080: http://localhost:8080");
    });