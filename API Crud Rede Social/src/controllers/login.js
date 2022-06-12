const connection = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const login = async (req, res) => {
    //pega o email e senha digitados pelo usuário no isominia ou postman
    const {email, senha} = req.body;
    
    // faz a verificação se digitou o email e senha
    if(!email || !senha) {
        console.log(email);
        return res.status(404).json({'mensagem': 'Email e senha são obrigatórios'});
    }

    try{
        //query para consultar no banco de dados o e-mail(do banco de dados)
        const queryVerificaEmail = 'select * from usuarios where email = $1';
        const {rows, rowCount} = await connection.query(queryVerificaEmail, [email]);

        //verifica se o usuário existe pelo email
        if(rowCount === 0){
            return res.status(404).json({'mensagem': 'Usuario não cadastrado'});
        }
        //se não entrar no if, pega o usuário pelo email lá da const rows, rowCount
        const usuario = rows[0];

        //verifica se a senha informada pelo usuário é a mesma que está no banco de dados        
        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if(!senhaVerificada){
            return res.status(404).json({'mensagem': 'Email e Senha incorretos'});
        }
        //criação do token
        const token = jwt.sign({            //a assinatura do token
            id: usuario.id,                 //a partir dessa linha é o que o token vai guardar  
            nome: usuario.nome,
            email: usuario.email            //o ultimo item que o token vai guardar                                 
        },jwtSecret,                        //o segredo que será usado para gerar o token
        {expiresIn: '1d'});                 // o tempo de expiração do token 
           
        //aqui vai pegar todos os dados do usuário menos a senha, usando desetruturação e guardando em dadosUsuario, tudo menos a senha
        //teve que renomear o nome senha pois já existe a que pega lá em cima do body
        const {senha: senhaUsuraio, ...dadosUsuario} = usuario; //duas constantes diferentes de usuario, uma U outra u ou coloca abaixo no return o nome da constante


        return res.status(200).json({Usuario: dadosUsuario, token});
           
    }   catch(error){
        return res.status(400).json(error.message);
    }
}

module.exports = {login};