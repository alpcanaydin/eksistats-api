const readFile = require('./readFile');

const getTopic = async (id, stemmer) => {
  try {
    const data = await readFile(`${__dirname}/../data/${id}.json`);
    const title = data.topic;
    const stems = stemmer.getStemsFromSentence(data.topic);

    return { title, stems };
  } catch (error) {
    return null;
  }
};

module.exports = getTopic;
