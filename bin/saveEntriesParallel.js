const dotenv = require('dotenv');
const elastic = require('elasticsearch');
const uuidv1 = require('uuid/v1');

const getEntry = require('../lib/getEntry');

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
      const entry = await getEntry(x);

      if (entry) {
        body.push({
          update: {
            _index: process.env.ES_INDEX,
            _type: 'entries',
            _id: uuidv1(),
          },
        });
        body.push({
          doc: entry,
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
