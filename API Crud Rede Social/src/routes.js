const express = require('express');
const routes = express();

const {cadastrarUsuario} = require('./controllers/usuarios');
const {login} = require('./controllers/login');
const {listarPostagens,postagensUsuraio, cadastrarPostagem, atualizarPostagem,excluirPostagem} = require('./controllers/postagens');
const {verificaLogin} = require('./filter/verificarLogin'); //o middleware verificaLogin


//ususarios
routes.post('/usuarios', cadastrarUsuario);

//login
routes.post('/login', login);

// fees principal, todas as postagens
routes.get('/', listarPostagens); //lista todas as postagens independente do usuário e aqui não precisa de verificação do middlare

//o middleware verificaLogin é chamado ou pode usar em cada a rota abaixo, ex: routes.get('/postagem', verificaLogin,postagensUsuraio); 
routes.use(verificaLogin); 

//postagens
routes.get('/postagens', postagensUsuraio); //cadastra uma postagem
routes.post('/postagem', cadastrarPostagem); // o middleware verificaLogin é chamado ou pode usar assim para todas as rotas
routes.put('/postagem/:id', atualizarPostagem);
routes.delete('/postagem/:id', excluirPostagem);


module.exports = routes;