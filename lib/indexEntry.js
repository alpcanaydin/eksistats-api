const elasticsearch = require('elasticsearch');
const readFile = require('./readFile');

const indexEntry = async id => {
  const client = new elasticsearch.Client({ host: process.env.ES_HOST });

  try {
    const entry = await readFile(`${__dirname}/../data/${id}.json`);

    await client.index({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: entry.id,
      body: entry,
    });

    console.log(`${entry.id} has been indexed.`);
  } catch (error) {
    console.log('Entry not found.');
  }
};

module.exports = indexEntry;
