const elastic = require('elasticsearch');
const aggregationToWord = require('../lib/aggregationToWord');
const aggregationToCount = require('../lib/aggregationToCount');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const client = new elastic.Client({ host: process.env.ES_HOST });

  const topic = req.query.topic;
  console.log(topic);

  if (!topic) {
    res.json({
      mostUsedEntryWords: [],
      totalUsedEntryWords: 0,
    });

    return;
  }

  const query = {
    term: { topicTitle: topic },
  };

  const aggs = {
    mostUsedEntryWords: {
      terms: {
        field: 'text',
        size: 10,
        exclude: EXCLUDE,
      },
    },

    totalUsedEntryWords: {
      value_count: {
        field: 'text',
      },
    },
  };

  const response = await client.search({
    index: process.env.ES_INDEX,
    type: 'entries',
    size: 0,
    body: { query, aggs },
  });

  res.json({
    topic,
    mostUsedEntryWords: aggregationToWord(response.aggregations.mostUsedEntryWords.buckets),
    totalUsedEntryWords: aggregationToCount(response.aggregations.totalUsedEntryWords),
  });
};
