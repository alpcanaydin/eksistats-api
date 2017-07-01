const dotenv = require('dotenv');
const monk = require('monk');

const Stemmer = require('../lib/stemmer');
const getEntry = require('../lib/getEntry');

// Dotenv config
dotenv.config();

const main = async () => {
  console.log('Started to fetching...');

  const db = monk(`${process.env.MONGO_HOST}/${process.env.MONGO_DB}`);
  const entries = db.get('entries');

  const START_ENTRY = parseInt(process.argv[2], 10) || 1;
  const FINISH_ENTRY = parseInt(process.argv[3], 10) || parseInt(process.env.TOTAL_ENTRY, 10);
  const THRESHOLD = 100;

  const stemmer = new Stemmer();

  const parallel = async (start, finish, total) => {
    const operations = [];

    for (let x = start; x <= finish; x += 1) {
      // eslint-disable-next-line
      const entry = await getEntry(x, stemmer);

      if (entry) {
        operations.push({
          insertOne: { document: entry },
        });
      }
    }

    if (!operations.length) {
      return true;
    }

    return entries
      .bulkWrite(operations)
      .then(() => {
        if (finish + THRESHOLD > total) {
          return true;
        }

        console.log(`${start}-${finish} finished.`);
        return parallel(finish, finish + THRESHOLD, total);
      })
      .catch(err => {
        console.log(err);
      });
  };

  entries.createIndex('title');
  entries.createIndex('topic');
  entries.createIndex('stems');
  await parallel(START_ENTRY, START_ENTRY + THRESHOLD, FINISH_ENTRY);
  db.close();
};

main();
