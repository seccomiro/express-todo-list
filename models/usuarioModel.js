const { salvarArquivo, lerArquivo } = require('../utils/bdUtil');

const usuarios = lerArquivo();

const ultimoId = () => {
  let id = 0;
  usuarios.forEach(u => {
    // eslint-disable-next-line prefer-destructuring
    if (u.id > id) id = u.id;
  });
  return id;
};

const validar = (nome, email, senha, senhaConfirmacao) => {
  const erros = {
    nome: [],
    email: [],
    senha: [],
    senhaConfirmacao: [],
    temErros: function() {
      return (
        this.nome.length > 0 ||
        this.email.length > 0 ||
        this.senha.length > 0 ||
        this.senhaConfirmacao.length > 0
      );
    }
  };

  if (!nome) {
    erros.nome.push('Por favor, informe o seu nome.');
  }
  if (!email) {
    erros.email.push('Por favor, informe o seu e-mail.');
  }
  if (!senha) {
    erros.senha.push('Por favor, informe a sua senha.');
  }
  if (!senhaConfirmacao) {
    erros.senhaConfirmacao.push('Por favor, confirme a sua senha.');
  }
  if (senha !== senhaConfirmacao) {
    erros.senhaConfirmacao.push('A senha informada não é igual à confirmação.');
  }

  return erros;
};

const buscaId = id => usuarios.find(u => u.id === id);

const buscaIdIndex = id => usuarios.findIndex(u => u.id === id);

const todos = () => usuarios;

const inserir = (usuario, callback) => {
  usuario.id = ultimoId() + 1;
  usuario.tarefas = [];
  usuarios.push(usuario);
  console.log(typeof callback);
  salvarArquivo(todos(), callback);
};

const atualizar = (usuario, callback) => {
  const usuarioSalvo = buscaId(usuario.id);
  usuarioSalvo.nome = usuario.nome;
  usuarioSalvo.email = usuario.email;
  usuarioSalvo.senha = usuario.senha;
  salvarArquivo(todos(), callback);
};

const apagar = (usuario, callback) => {
  const index = buscaIdIndex(usuario.id);
  if (index > -1) {
    usuarios.splice(index, 1);
    salvarArquivo(todos(), callback);
  } else {
    callback();
  }
};

const salvar = (usuario, callback) => {
  if (usuario.id && buscaId(usuario.id)) {
    atualizar(usuario, callback);
  } else {
    inserir(usuario, callback);
  }
};

exports.validar = validar;
exports.buscaId = buscaId;
exports.todos = todos;
exports.inserir = inserir;
exports.atualizar = atualizar;
exports.salvar = salvar;
exports.apagar = apagar;
