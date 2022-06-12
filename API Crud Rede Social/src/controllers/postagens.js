const jwt = require('jsonwebtoken');
const connection = require('../connection');
const jwtSecret = require('../jwt_secret');

const listarPostagens = async (req, res) => {
    try {
        const postagens = await connection.query('select * from postagens');
        
        return res.status(200).json(postagens.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    } 
};


const postagensUsuraio = async (req, res) => {
    const {usuario} = req;
    try {
        const postagens = await connection.query('select * from postagens where usuario_id = $1', [usuario.id]);
        
        return res.status(200).json(postagens.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    } 

};

const cadastrarPostagem = async (req, res) => {
    const {texto} = req.body; //aqui pega o texto digitado como json lá no isominia ou postman
    const {usuario} = req;//verifica login
    
    //verifica se o token e o texto realmento foram digitados
    if(!texto) {
        
        return res.status(404).json({'mensagem':'Texto é obrigatório.'});
    }
    

    try {
        const queryPostagem = 'insert into postagens (usuario_id, texto) values ($1, $2)'; //query para inserir no banco de dados, poderia passar direto no código abaixo
        const postagem = await connection.query(queryPostagem, [usuario.id, texto]); //insere o texto e o id do usuário no banco de dados

        if(postagem.rowCount===0){
            return res.status(404).json({'mensagem':'Erro ao inserir postagem.'});
        }

        return res.status(200).json({'mensagem':'Postagem inserida com sucesso.'});

    } catch (error) {
        return res.status(400).json(error.message);
    }

};

const atualizarPostagem = async (req, res) => {
    const {texto} = req.body; //aqui pega o texto digitado como json lá no isominia ou postman
    const {usuario} = req; //verifica login
    const {id} = req.params; //pega o id da postagem que será atualizada
    
    //verifica se o token e o texto realmento foram digitados
    if(!texto) {
        console.log(texto);
        return res.status(404).json({'mensagem':'Texto é obrigatório.'});
    }
   
    try {
        const queryPostagemexistente = 'select * from postagens where id = $1 and usuario_id = $2'; //consulta no banco de dados o id da postagem e pelo id do usuário
        const postagemExistente = await connection.query(queryPostagemexistente, [id, usuario.id]); //pega o que o banco retornou

        if(postagemExistente.rowCount === 0) {
            return res.status(404).json({'mensagem':'A postagem não foi encontrada'});
        }

        const queryPostagem = 'update postagens set texto = $1 where id = $2 and usuario_id = $3'; //query para atualizar no banco de dados
        const postagem = await connection.query(queryPostagem, [texto,id,usuario.id]); //atualiza o texto e o id do usuário no banco de dados

        if(postagem.rowCount===0){
            return res.status(404).json({'mensagem':'Não foi possivel atualizar a postagem.'});
        }

        return res.status(200).json({'mensagem':'Postagem atualizada com sucesso.'});

    } catch (error) {
        return res.status(400).json(error.message);
    }   


};

const excluirPostagem = async (req, res) => {
    const {id}  = req.params; //pega o id da postagem que será excluída
    const{usuario} = req;

    try {
        const queryPostagemexistente = 'select * from postagens where id = $1 and usuario_id = $2'; //consulta no banco de dados o id da postagem e pelo id do usuário
        const postagemExistente = await connection.query(queryPostagemexistente, [id, usuario.id]); //pega o que o banco retornou

        if(postagemExistente.rowCount === 0) {
            return res.status(404).json({'mensagem':'A postagem não foi encontrada'});
        }


        const {rowCount} = await connection.query('delete from postagens where id = $1 ',[id]);
        if(rowCount===0){
            return res.status(404).json({'mensagem':'Não foi possivel excluir a postagem.'});
        }

        return res.status(200).json({'mensagem':'Postagem excluída com sucesso.'});
        
    } catch (error) {
        return res.status(400).json(error.message);
    }

};

module.exports = {
    listarPostagens,
    postagensUsuraio,
    cadastrarPostagem,
    atualizarPostagem,
    excluirPostagem
}