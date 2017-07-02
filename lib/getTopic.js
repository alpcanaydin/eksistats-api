const readFile = require('./readFile');

const getTopic = async id => {
  try {
    const data = await readFile(`${__dirname}/../data/${id}.json`);
    const title = data.topic;

    return { title };
  } catch (error) {
    return null;
  }
};

module.exports = getTopic;
