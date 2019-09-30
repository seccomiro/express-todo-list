const express = require('express');
const tarefaController = require('../controllers/tarefaController');
const { proteger } = require('../controllers/autenticacaoController');

const router = express.Router();
router
  .get('/', proteger, tarefaController.todas)
  .get('/nova', proteger, tarefaController.nova)
  .get('/:id', proteger, tarefaController.mostrar)
  .post('/', proteger, tarefaController.cadastrar)
  .get('/:id/editar', proteger, tarefaController.editar)
  .post('/:id', proteger, tarefaController.atualizar)
  .post('/:id/apagar', proteger, tarefaController.apagar)
  .get('/:id/concluir', proteger, tarefaController.concluir);

module.exports = router;
