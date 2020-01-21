const express = require("express");

const server = express();

server.use(express.json());

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */

const projects = [];
let contadorDeRequests = 0;

/**
 * Middleware que checa se o projeto existe
 */

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exist" });
  }

  return next();
}

/**
 * Middleware que dá log no número de requisições
 */

function logRequests(req, res, next) {
  contadorDeRequests++;

  console.log(`Número de Requisições: ${contadorDeRequests}`);

  return next();
}
// Um outro jeito de fazer este logRequests era colocar isso dentro dele:
//console.count("Número de Requisições") => Aqui ele já conta quantas vezes ele passa por aqui
// e não precisava criar a variável que conta**

server.use(logRequests);

/**
 * Request body: id, title
 * Cadastra um novo projeto
 */

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

/**
 * Retorna todos os projetos
 */

server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Route params: id
 * Request body: title
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/**
 * Route params: id
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send("Deletado com sucesso.");
});

/**
 * Route params: id;
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(tasks);

  return res.json(project);
});

server.listen(4000);
