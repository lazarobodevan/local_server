const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const simpleGit = require('simple-git');
const projects = require('./projects.json');
const ngrok = require('@ngrok/ngrok');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 8080;

const BASE_PROJ_PATH = "C:/projs/"

app.use(express.json());

app.post('/webhook', (req, res) => {
  const signature = req.get('x-hub-signature-256') || '';
  const payload = JSON.stringify(req.body);
  const project = projects.find((p) => {
    const hmac = crypto.createHmac('sha256', p.secret);
    const hash = 'sha256=' + hmac.update(payload).digest('hex');
    return hash === signature;
  });

  console.log(project)
  if (project) {
    console.log(`Assinatura válida para ${project.repoName}. Executando git pull e iniciando o projeto...`);

    const localRepoPath = path.join(BASE_PROJ_PATH, project.repoName);
    

    // Verificar se o diretório .git existe
  const gitDirPath = path.join(localRepoPath);
  const pathExists = fs.existsSync(gitDirPath);

  if (!pathExists) {
    fs.mkdirSync(localRepoPath,{recursive: true});
    console.log(`Diretório .git não encontrado em ${localRepoPath}. Clonando o repositório...`);
    
    const git = simpleGit(localRepoPath);
    git.clone(`https://github.com/lazarobodevan/${project.repoName}.git`, localRepoPath, (cloneErr) => {
      if (cloneErr) {
        console.error(`Erro ao clonar o repositório ${project.repoName}:`, cloneErr);
        res.status(500).send(`Erro ao clonar o repositório ${project.repoName}.`);
        return;
      }

      console.log(`Repositório ${project.repoName} clonado com sucesso.`);
      return res.status(200).send("Repoitório clonado com sucesso")
    });
  }

  const git = simpleGit(localRepoPath);
    git.pull((err, update) => {
      if (err) {
        console.error('Erro ao executar git pull:', err);
        res.status(500).send('Erro interno.');
      } else if (update && update.summary.changes) {
        console.log('Projeto atualizado com sucesso!');

        // Executar o comando para iniciar o projeto
        exec(project.launchCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Erro ao iniciar ${project.repoName}:`, error);
            res.status(500).send(`Erro ao iniciar ${project.repoName}.`);
          } else {
            console.log(`${project.repoName} iniciado com sucesso!`);
            res.status(200).send(`Atualização e início do ${project.repoName} bem-sucedidos.`);
          }
        });
      } else {
        console.log('Nenhuma alteração encontrada.');
        res.status(200).send('Nenhuma alteração encontrada.');
      }
    });
  } else {
    console.error('Assinatura inválida. Ignorando solicitação.');
    res.status(403).send('Assinatura inválida.');
  }
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
  ngrok.connect({ addr: 8080, authtoken_from_env: true })
    .then(listener => console.log(`Ingress established at: ${listener.url()}`));
});