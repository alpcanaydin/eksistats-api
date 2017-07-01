const dotenv = require('dotenv');
const monk = require('monk');

const Stemmer = require('../lib/stemmer');
const getTopic = require('../lib/getTopic');

// Dotenv config
dotenv.config();

const main = async () => {
  console.log('Started to fetching...');

  const db = monk(`${process.env.MONGO_HOST}/${process.env.MONGO_DB}`);
  const topics = db.get('topics');

  const START_ENTRY = parseInt(process.argv[2], 10) || 1;
  const FINISH_ENTRY = parseInt(process.argv[3], 10) || parseInt(process.env.TOTAL_ENTRY, 10);
  const THRESHOLD = 100;

  const stemmer = new Stemmer();

  const parallel = async (start, finish, total) => {
    const operations = [];

    for (let x = start; x <= finish; x += 1) {
      // eslint-disable-next-line
      const topic = await getTopic(x, stemmer);

      if (topic) {
        operations.push({
          updateOne: {
            filter: { title: topic.title },
            update: topic,
            upsert: true,
          },
        });
      }
    }

    if (!operations.length) {
      return true;
    }

    return topics
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

  topics.createIndex('title');
  topics.createIndex('stems');
  await parallel(START_ENTRY, START_ENTRY + THRESHOLD, FINISH_ENTRY);
  db.close();
};

main();
