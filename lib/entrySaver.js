const entryFetcher = require('./entryFetcher');
const writeFile = require('./writeFile');

const entrySaver = async id => {
  try {
    const entry = await entryFetcher(id);
    console.log(`${entry.id} has been fetched`);
    return writeFile(`${__dirname}/../data/${entry.id}.json`, entry);
  } catch (error) {
    console.log('Entry not found.');
    return null;
  }
};

module.exports = entrySaver;
