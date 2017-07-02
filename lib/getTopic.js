const readFile = require('./readFile');

const getTopic = async id => {
  try {
    const data = await readFile(`${__dirname}/../data/${id}.json`);
    const topic = data.topic;

    return { topic };
  } catch (error) {
    return null;
  }
};

module.exports = getTopic;
