const rp = require('request-promise');
const entryMapper = require('../lib/mapper/entry');

const entryFetcher = async id => {
  const options = {
    uri: `${process.env.BASE_URL}/${id}`,
    json: true,
  };

  const response = await rp(options);

  if (!response.entryList) {
    throw new Error('Not found');
  }

  return entryMapper(response);
};

module.exports = entryFetcher;
