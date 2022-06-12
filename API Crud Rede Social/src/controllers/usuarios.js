const connection = require('../connection');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    //pega as informações lá do corpo da requisição do insomnia/postman no campo body
    const {nome, email, senha} = req.body;
    
    // Os ifs verificam se os 3 tópicos foram informados na requisição insomnia/postman no campo body
    if(!nome){
        return res.status(404).json({'mensagem': 'Nome é obrigatório'});
    }

    if(!email){
        return res.status(404).json({'mensagem': 'Email é obrigatório'});
    }

    if(!senha){
        return res.status(404).json({'mensagem': 'Senha é obrigatório'});
    }

    try {
        //cria a query para consultar no banco de dados o e-mail(do banco de dados)
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        //compara e guarda a query com o e-mail informado pelo usuário
        const {rowCount: quantidadedeUsuarios} = await connection.query(queryConsultaEmail, [email]);
        
        if(quantidadedeUsuarios > 0){
            return res.status(400).json({'mensagem': 'Email já cadastrado'});
        }

    } catch (error) {
        return res.status(error.message);
    }

    try {
        //criptografa a senha informada pelo usuário
        const senhaCriptografada = await bcrypt.hash(senha, 10);
        
        //query para cadastrar o usuário no banco de dados
        const queryInserirUsuario = 'insert into usuarios (nome, email, senha) values ($1, $2, $3)';
        const usuarioCadastrado = await connection.query(queryInserirUsuario, [nome, email, senhaCriptografada]);

        if(usuarioCadastrado.rowCount === 0){
            return res.status(400).json({'mensagem': 'Não foi possível cadastrar o usuário'});
        }
        return res.status(200).json({'mensagem': 'Usuário cadastrado com sucesso!'});

    } catch (error) {
        return res.status(error.message);
    }  
    

};

module.exports = {
    cadastrarUsuario
};