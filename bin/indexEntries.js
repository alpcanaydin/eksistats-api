const dotenv = require('dotenv');
const uuidv1 = require('uuid/v1');
const elasticsearch = require('elasticsearch');

const Stemmer = require('../lib/stemmer');
const collectTopics = require('../lib/collectTopics');

// Dotenv config
dotenv.config();

const main = async () => {
  console.log('Starting to index...');

  const client = new elasticsearch.Client({ host: process.env.ES_HOST });
  const stemmer = new Stemmer();

  const START_ENTRY = parseInt(process.argv[2], 10) || 1;
  const FINISH_ENTRY = parseInt(process.argv[3], 10) || parseInt(process.env.TOTAL_ENTRY, 10);

  const allData = {};

  console.log('Starting to collect entries...');
  for (let i = START_ENTRY; i <= FINISH_ENTRY; i += 1) {
    // eslint-disable-next-line
    await collectTopics(i, allData, stemmer);
  }
  console.log('Entries are collected.');

  console.log('Starting to indexing...');
  for (const [topic, body] of Object.entries(allData)) {
    // eslint-disable-next-line
    await client.index({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: uuidv1(),
      body,
    });

    console.log(`${topic} has been indexed.`);
  }

  console.log('All done!');
};

main();
