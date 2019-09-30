const usuarioModel = require('./usuarioModel');
const { salvarArquivo } = require('../utils/bdUtil');

let usuario;

exports.logarUsuario = u => {
  usuario = u;
};

exports.deslogarUsuario = () => {
  usuario = undefined;
};

const usuarioLogado = () => {
  return usuarioModel.buscaId(usuario.id);
};

const tarefas = () => usuarioLogado().tarefas;

const ultimoId = () => {
  let id = 0;
  tarefas().forEach(t => {
    // eslint-disable-next-line prefer-destructuring
    if (t.id > id) id = t.id;
  });
  return id;
};

const validar = (titulo, descricao) => {
  const erros = {
    titulo: [],
    descricao: [],
    temErros: function() {
      return this.titulo.length > 0 || this.descricao.length > 0;
    }
  };

  if (!titulo) {
    erros.titulo.push('Por favor, informe o título da tarefa.');
  }
  if (!descricao) {
    // A descrição não é obrigatória, logo, não há validações a fazer
  }

  return erros;
};

const buscaId = id => tarefas().find(t => t.id === id);

const buscaIdIndex = id => tarefas().findIndex(t => t.id === id);

const todas = () =>
  tarefas().sort((t1, t2) => {
    if (t1.concluida && !t2.concluida) {
      return 1;
    }
    if (t2.concluida && !t1.concluida) {
      return -1;
    }
    return 0;
  });

const inserir = (tarefa, callback) => {
  tarefa.id = ultimoId() + 1;
  tarefa.concluida = false;
  usuario.tarefas.push(tarefa);
  salvarArquivo(usuarioModel.todos(), callback);
};

const atualizar = (tarefa, callback) => {
  const tarefaSalva = buscaId(tarefa.id);
  tarefaSalva.titulo = tarefa.titulo;
  tarefaSalva.descricao = tarefa.descricao;
  tarefaSalva.concluida = tarefa.concluida;
  salvarArquivo(usuarioModel.todos(), callback);
};

const apagar = (tarefa, callback) => {
  const index = buscaIdIndex(tarefa.id);
  if (index > -1) {
    tarefas().splice(index, 1);
    salvarArquivo(usuarioModel.todos(), callback);
  } else {
    callback();
  }
};

const salvar = (tarefa, callback) => {
  if (tarefa.id && buscaId(tarefa.id)) {
    atualizar(tarefa, callback);
  } else {
    inserir(tarefa, callback);
  }
};

exports.validar = validar;
exports.buscaId = buscaId;
exports.todas = todas;
exports.inserir = inserir;
exports.atualizar = atualizar;
exports.salvar = salvar;
exports.apagar = apagar;
