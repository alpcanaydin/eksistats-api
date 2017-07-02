const elastic = require('elasticsearch');
const aggregationToWord = require('../lib/aggregationToWord');
const aggregationToCount = require('../lib/aggregationToCount');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const client = new elastic.Client({ host: process.env.ES_HOST });

  const topicsAggs = {
    mostUsedTopicWords: {
      terms: {
        field: 'stems',
        size: 10,
        exclude: EXCLUDE,
      },
    },

    totalUsedTopicWords: {
      value_count: {
        field: 'stems',
      },
    },
  };

  const entriesAggs = {
    mostUsedEntryWords: {
      terms: {
        field: 'stems',
        size: 10,
        exclude: EXCLUDE,
      },
    },

    totalUsedEntryWords: {
      value_count: {
        field: 'stems',
      },
    },
  };

  const totalTopicsPromise = client.count({
    index: process.env.ES_INDEX,
    type: 'topics',
  });

  const topicsResponsePromise = client.search({
    index: process.env.ES_INDEX,
    type: 'topics',
    size: 0,
    body: { aggs: topicsAggs },
  });

  const totalEntriesPromise = client.count({
    index: process.env.ES_INDEX,
    type: 'entries',
  });

  const entriesResponsePromise = client.search({
    index: process.env.ES_INDEX,
    type: 'entries',
    size: 0,
    body: { aggs: entriesAggs },
  });

  const [totalTopics, topicsResponse, totalEntries, entriesResponse] = await Promise.all([
    totalTopicsPromise,
    topicsResponsePromise,
    totalEntriesPromise,
    entriesResponsePromise,
  ]);

  res.json({
    totalTopics: totalTopics.count,
    mostUsedTopicWords: aggregationToWord(topicsResponse.aggregations.mostUsedTopicWords.buckets),
    totalUsedTopicWords: aggregationToCount(topicsResponse.aggregations.totalUsedTopicWords),
    totalEntries: totalEntries.count,
    mostUsedEntryWords: aggregationToWord(entriesResponse.aggregations.mostUsedEntryWords.buckets),
    totalUsedEntryWords: aggregationToCount(entriesResponse.aggregations.totalUsedEntryWords),
  });
};
