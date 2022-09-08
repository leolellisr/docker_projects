const express = require("express");
const fs = require("fs");
const router = express.Router();

const fileDb = "/node/alunos.json";

const alunosMap = (() => {
  if (!fs.existsSync(fileDb)) {
    return new Map();
  }

  const fileContents = fs.readFileSync(fileDb);

  const map1 = JSON.parse(fileContents);

  return map1.reduce((map, value) => {
    map.set(value.ra, value);
    return map;
  }, new Map());
})();

router.route("/*").options(function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Request-With"
  );
  res.sendStatus(200);
});

router.route("/").get(function (req, res) {
  const path = "index.html";
  res.header("Cache-Control", "no-cache");
  res.sendFile(path, { root: "./" });
});

router
  .route("/alunos")

  .get(function (req, res) {
    const response = { alunos: [...alunosMap.values()] };
    res.json(response);
  })

  .post(function (req, res) {
    const aluno = req.body;
    let response = {};
    if (alunosMap.get(aluno.ra) === undefined) {
      alunosMap.set(aluno.ra, aluno);
      response = { resultado: "aluno inserido" };
      fs.writeFileSync(fileDb, JSON.stringify([...alunosMap.values()]));
    } else response = { resultado: "aluno ja existente" };
    res.json(response);
  });

router
  .route("/alunos/:id")

  .get(function (req, res) {
    let response = {};
    if (alunosMap.get(req.params.id) !== undefined) {
      response = alunosMap.get(req.params.id);
    } else {
      response = { resultado: "aluno inexistente" };
    }
    res.json(response);
  })

  .put(function (req, res) {
    let response = {};
    if (alunosMap.get(req.params.id) !== undefined) {
      alunosMap.set(req.params.id, req.body);
      response = { resultado: "aluno atualizado" };
      fs.writeFileSync(fileDb, JSON.stringify([...alunosMap.values()]));
    } else {
      response = { resultado: "aluno inexistente" };
    }
    res.json(response);
  })

  .delete(function (req, res) {
    let response = {};
    if (alunosMap.get(req.params.id) !== undefined) {
      alunosMap.delete(req.params.id);
      response = { resultado: "aluno removido" };
      fs.writeFileSync(fileDb, JSON.stringify([...alunosMap.values()]));
    } else response = { resultado: "aluno inexistente" };
    res.json(response);
  });

module.exports = router;
