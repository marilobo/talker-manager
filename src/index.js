const express = require('express');

const { getTalkers } = require('./talkerDB');
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
  
});