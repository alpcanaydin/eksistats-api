const dotenv = require('dotenv');
const elastic = require('elasticsearch');

const getTopic = require('../lib/getTopic');

// Dotenv config
dotenv.config();

const main = async () => {
  console.log('Started to fetching...');

  const START_ENTRY = parseInt(process.argv[2], 10) || 1;
  const FINISH_ENTRY = parseInt(process.argv[3], 10) || parseInt(process.env.TOTAL_ENTRY, 10);
  const THRESHOLD = 100;

  const client = new elastic.Client({
    host: process.env.ES_HOST,
  });

  const parallel = async (start, finish, total) => {
    const body = [];

    for (let x = start; x <= finish; x += 1) {
      // eslint-disable-next-line
      const topic = await getTopic(x);

      if (topic) {
        body.push({
          update: {
            _index: process.env.ES_INDEX,
            _type: 'topics',
            _id: topic.title,
          },
        });
        body.push({
          doc: topic,
          doc_as_upsert: true,
        });
      }
    }

    console.log(`${start}-${FINISH_ENTRY} finished.`);

    return client
      .bulk({ body })
      .then(() => {
        if (finish + THRESHOLD > total) {
          return true;
        }

        return parallel(finish, finish + THRESHOLD, total);
      })
      .catch(err => {
        console.log(err);
      });
  };

  await parallel(START_ENTRY, START_ENTRY + THRESHOLD, FINISH_ENTRY);
};

main();
