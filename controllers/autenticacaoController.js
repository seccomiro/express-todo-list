const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const usuarioModel = require('../models/usuarioModel');
const tarefaModel = require('../models/tarefaModel');

const sessionOptions = {
  store: new FileStore({
    path: path.join(__dirname, '..', 'arquivos', 'session')
  }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  name: 'todo.session.id'
};

exports.iniciarSessao = session(sessionOptions);

exports.restaurarSessao = (req, res, next) => {
  if (req.session.usuario) {
    tarefaModel.logarUsuario(req.session.usuario);
  }
  next();
};

exports.copiarSessaoParaViews = (req, res, next) => {
  res.locals.session = req.session;
  next();
};

exports.proteger = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  res.locals.session = req.session;
  next();
};

exports.login = (req, res) => {
  res.status(200).render('autenticacao/login', {
    titulo: 'Login'
  });
};

exports.validaLogin = (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarioModel
    .todos()
    .find(u => u.email === email && u.senha === senha);

  if (usuario) {
    req.session.usuario = usuario;
    tarefaModel.logarUsuario(usuario);
    res.redirect('/tarefas');
  } else {
    res
      .status(401)
      .render('autenticacao/login', { mensagem: 'Email ou senha incorretos' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(sessionOptions.name);
    tarefaModel.deslogarUsuario();
    res.redirect('/login');
  });
};

exports.registrar = (req, res) => {
  res.status(200).render('autenticacao/registrar', {
    titulo: 'Registrar',
    usuario: {}
  });
};

exports.validaRegistrar = (req, res) => {
  const { nome, email, senha, senhaConfirmacao } = req.body;

  const erros = usuarioModel.validar(nome, email, senha, senhaConfirmacao);

  if (!erros.temErros()) {
    const usuario = { nome, email, senha };
    usuarioModel.salvar(usuario, () => {
      req.session.usuario = usuario;
      tarefaModel.logarUsuario(usuario);
      res.redirect('/tarefas');
    });
  } else {
    const usuarioView = { nome, email };
    res
      .status(401)
      .render('autenticacao/registrar', { usuario: usuarioView, erros });
  }
};
