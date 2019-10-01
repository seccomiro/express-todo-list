const tarefaModel = require('../models/tarefaModel');

exports.todas = (req, res) => {
  res.status(200).render('tarefas/todas', {
    tarefas: tarefaModel.todas(),
    titulo: 'Minhas Tarefas'
  });
};

exports.mostrar = (req, res) => {
  const id = req.params.id * 1;
  const tarefa = tarefaModel.buscaId(id);

  if (req.params.id && tarefa) {
    res.status(200).render('tarefas/mostrar', {
      tarefa,
      titulo: tarefa.titulo
    });
  } else {
    res.status(404).render('404', {
      titulo: 'Recurso Inexistente'
    });
  }
};

exports.nova = (req, res) => {
  res.status(200).render('tarefas/nova', {
    titulo: 'Nova Tarefa',
    tarefa: {}
  });
};

exports.cadastrar = (req, res) => {
  const { titulo, descricao } = req.body;
  const erros = tarefaModel.validar(titulo, descricao);

  if (!erros.temErros()) {
    const tarefa = { titulo, descricao };
    tarefaModel.salvar(tarefa, () => res.redirect('/tarefas'));
  } else {
    const tarefaView = { titulo, descricao };
    res.status(401).render('tarefas/nova', { tarefa: tarefaView, erros });
  }
};

exports.editar = (req, res) => {
  const id = req.params.id * 1;
  const tarefa = tarefaModel.buscaId(id);

  if (req.params.id && tarefa && !tarefa.concluida) {
    res.status(200).render('tarefas/editar', {
      tarefa,
      titulo: `Editando ${tarefa.titulo}`
    });
  } else {
    res.status(401).render('401', {
      titulo: 'Ação não permitida'
    });
  }
};

exports.atualizar = (req, res) => {
  const { titulo, descricao } = req.body;
  const id = req.params.id * 1;
  const tarefa = tarefaModel.buscaId(id);
  const erros = tarefaModel.validar(titulo, descricao);

  if (!erros.temErros()) {
    tarefa.titulo = titulo;
    tarefa.descricao = descricao;
    // tarefa.concluida = concluida;

    tarefaModel.salvar(tarefa, () => res.redirect('/tarefas'));
  } else {
    const tarefaView = { id, titulo, descricao };
    res.status(401).render('tarefas/editar', { tarefa: tarefaView, erros });
  }
};

exports.concluir = (req, res) => {
  const id = req.params.id * 1;
  const tarefa = tarefaModel.buscaId(id);
  tarefa.concluida = !tarefa.concluida;
  tarefaModel.salvar(tarefa, () => res.redirect('/tarefas'));
};

exports.apagar = (req, res) => {
  const id = req.params.id * 1;
  const tarefa = tarefaModel.buscaId(id);
  tarefaModel.apagar(tarefa, () => res.redirect('/tarefas'));
};
