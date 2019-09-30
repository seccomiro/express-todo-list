const fs = require('fs');
const path = require('path');

exports.salvarArquivo = (usuarios, callback) => {
  const usuariosJSON = JSON.stringify(usuarios);
  fs.writeFile(
    path.join(__dirname, '..', 'arquivos', 'usuarios.json'),
    usuariosJSON,
    'utf-8',
    callback
  );
};

exports.lerArquivo = () => {
  const dados = fs.readFileSync(
    path.join(__dirname, '..', 'arquivos', 'usuarios.json'),
    'utf-8'
  );
  return JSON.parse(dados);
};
