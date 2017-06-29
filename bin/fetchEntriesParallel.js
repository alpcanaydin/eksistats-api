const dotenv = require('dotenv');
const entrySaver = require('../lib/entrySaver');

// Dotenv config
dotenv.config();

const main = async () => {
  console.log('Started to fetching...');

  const START_ENTRY = parseInt(process.argv[2], 10) || 1;
  const FINISH_ENTRY = parseInt(process.argv[3], 10) || parseInt(process.env.TOTAL_ENTRY, 10);
  const THRESHOLD = 100;

  const parallel = (start, finish, total) => {
    const promises = [];
    for (let x = start; x <= finish; x += 1) {
      promises.push(entrySaver(x));
    }

    return Promise.all(promises).then(() => {
      console.log(`${start}-${finish} finished.`);
      if (finish + THRESHOLD > total) {
        return true;
      }

      return parallel(finish, finish + THRESHOLD, total);
    });
  };

  await parallel(START_ENTRY, START_ENTRY + THRESHOLD, FINISH_ENTRY);

  console.log('All done!');
};

main();
