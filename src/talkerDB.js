const fs = require('fs').promises;

const getTalkers = async () => {
  const talkers = await fs.readFile('./src/talker.json');
  return JSON.parse(talkers);
};

module.exports = {
  getTalkers,
};