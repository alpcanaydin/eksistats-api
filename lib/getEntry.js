const readFile = require('./readFile');

const getEntry = async (id, stemmer) => {
  try {
    const data = await readFile(`${__dirname}/../data/${id}.json`);
    const entry = {
      topic: data.topic,
      author: data.author,
      createdAt: data.createdAt,
      text: data.text,
      stems: stemmer.getStemsFromSentence(data.text),
      favorites: data.favorites,
    };

    return entry;
  } catch (error) {
    return null;
  }
};

module.exports = getEntry;
