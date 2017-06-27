const dotenv = require('dotenv');
const indexEntry = require('../lib/indexEntry');

// Dotenv config
dotenv.config();

const main = async () => {
  console.log('Starting to index...');

  const START_ENTRY = parseInt(process.argv[2], 10) || 1;
  const FINISH_ENTRY = parseInt(process.argv[3], 10) || parseInt(process.env.TOTAL_ENTRY, 10);

  for (let i = START_ENTRY; i <= FINISH_ENTRY; i += 1) {
    // eslint-disable-next-line
    await indexEntry(i);
  }
};

main();
