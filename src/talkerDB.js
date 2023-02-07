const fs = require('fs').promises;

const path = './src/talker.json';

const getTalkers = async () => {
  const talkers = await fs.readFile(path);
  return JSON.parse(talkers);
};

const writeTalkers = async (newTalker) => {
  const allTalkers = await getTalkers();
  allTalkers.push(newTalker);
  return fs.writeFile(path, JSON.stringify(allTalkers));
};

const getLastTalkerId = async () => {
  const allTalkers = await getTalkers();
  const { id } = allTalkers[allTalkers.length - 1];
  return id;
};

module.exports = {
  getTalkers,
  writeTalkers,
  getLastTalkerId,
};