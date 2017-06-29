const rp = require('request-promise');
const entryMapper = require('../lib/entryMapper');

const entryFetcher = async id => {
  try {
    const response = await rp(`${process.env.BASE_URL}/${id}`);
    return entryMapper(id, response);
  } catch (error) {
    throw new Error('Not found');
  }
};

module.exports = entryFetcher;
