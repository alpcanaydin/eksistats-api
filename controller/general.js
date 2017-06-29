const esSearch = require('../lib/esSearch');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const response = await esSearch(
    {},
    {
      mostTopic: {
        terms: {
          field: 'topic',
          size: 100,
          exclude: EXCLUDE,
        },
      },

      mostText: {
        terms: {
          field: 'text',
          size: 100,
          exclude: EXCLUDE,
        },
      },
    }
  );

  res.json(response);
};
