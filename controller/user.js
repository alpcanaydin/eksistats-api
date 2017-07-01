const esSearch = require('../lib/esSearch');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const response = await esSearch(
    {
      term: { 'entries.author': req.params.user },
    },
    {
      totalTopic: {
        value_count: {
          field: 'topicStems',
        },
      },

      uniqueTopic: {
        cardinality: {
          field: 'topicStems',
        },
      },

      mostTopic: {
        terms: {
          field: 'topicStems',
          size: 100,
          exclude: EXCLUDE,
        },
      },

      totalText: {
        value_count: {
          field: 'entries.textStems',
        },
      },

      uniqueText: {
        cardinality: {
          field: 'entries.textStems',
        },
      },

      mostText: {
        terms: {
          field: 'entries.textStems',
          size: 100,
          exclude: EXCLUDE,
        },
      },
    }
  );

  res.json(response);
};
