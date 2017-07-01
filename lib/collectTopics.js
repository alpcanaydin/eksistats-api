const readFile = require('./readFile');

const collectTopics = async (id, allData, stemmer) => {
  try {
    const data = await readFile(`${__dirname}/../data/${id}.json`);
    const topic = data.topic;
    const topicStems = stemmer.getStemsFromSentence(data.topic);
    const entry = {
      author: data.author,
      createdAt: data.createdAt,
      text: data.text,
      textStems: stemmer.getStemsFromSentence(data.text),
      favorites: data.favorites,
    };

    if (allData.hasOwnProperty(topic)) {
      allData[topic].entries.push(entry);
    } else {
      // eslint-disable-next-line
      allData[topic] = { topic, topicStems, entries: [entry] };
    }

    console.log(`${id} added to all data.`);
  } catch (error) {
    // console.log('Entry not found.');
  }
};

module.exports = collectTopics;
