const jwt = require('jsonwebtoken');
const connection = require('../connection');
const jwtSecret = require('../jwt_secret');


const verificaLogin = async (req, res, next) => {
   const {authorization} = req.headers;

   if(!authorization) {
       return res.status(404).json({'mensagem':'Token não informado'});
   }

   try {
     const token = authorization.replace('Bearer ', '').trim();//retira o Bearer do token lá no insominia ou postman

     const {id} = jwt.verify(token, jwtSecret); //verfifica se o token é válido

        const query = 'select * from usuarios where id = $1'; //consulta no banco de dados pelo id do usuário
        const {rows, rowCount} = await connection.query(query, [id]); //pega o que o banco retornou

        if(rowCount === 0) {
            return res.status(404).json({'mensagem':'Usuário não encontrado.'});
        }

        const {senha, ...usuario} = rows[0]; // armazena o usuário que o banco retornou com desestruturação

        req.usuario = usuario;
        next();

   } catch (error) {
       return res.status(400).json(error.message);
   }

};

module.exports = {verificaLogin};