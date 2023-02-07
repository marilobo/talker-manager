const express = require('express');

const { getTalkers, getLastTalkerId, writeTalkers, editTalkers } = require('./talkerDB');
const loginValidation = require('./middlewares/loginValidation');
const generateToken = require('./utils/generateToken');
const tokenValidation = require('./middlewares/tokenValidation');
const nameValidation = require('./middlewares/nameValidation');
const ageValidation = require('./middlewares/ageValidation');
const talkValidation = require('./middlewares/talkValidation');
const rateValidation = require('./middlewares/rateValidation');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await getTalkers();
  return res.status(200).json(talkers);
});

app.get('/talker/search', tokenValidation, async (req, res) => {
  const { q } = req.query;
  const talkers = await getTalkers();

  if (!q || q.length < 1) {
    return res.status(200).json(talkers);
  }
  const filterTalkers = talkers.filter((t) => t.name.toLowerCase().includes(q.toLocaleLowerCase()));
  return res.status(200).json(filterTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const talkers = await getTalkers();
  const [getTalkerById] = await talkers.filter((t) => t.id === +req.params.id);
  if (getTalkerById) {
    return res.status(200).json(getTalkerById);
  } return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', loginValidation, async (_req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.post('/talker', tokenValidation, nameValidation, ageValidation,
talkValidation, rateValidation, async (req, res) => {
  const id = await getLastTalkerId() + 1;
  const newTalker = {
    id,
    ...req.body,
  };
  await writeTalkers(newTalker);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', tokenValidation, nameValidation, ageValidation,
talkValidation, rateValidation, async (req, res) => {
  const id = +req.params.id;

  const talkers = await getTalkers();
  const index = talkers.findIndex((t) => t.id === id);
  talkers[index] = { id, ...req.body };

  await editTalkers([...talkers]);
  return res.status(200).json(talkers[index]);
});

app.delete('/talker/:id', tokenValidation, async (req, res) => {
  const id = +req.params.id;

  const talkers = await getTalkers();
  const filterToDelete = talkers.filter((t) => t.id !== id);

  await editTalkers([...filterToDelete]);
  return res.status(204).end();
});