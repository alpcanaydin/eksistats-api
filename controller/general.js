const elastic = require('elasticsearch');
const aggregationToWord = require('../lib/aggregationToWord');
const aggregationToCount = require('../lib/aggregationToCount');
const readFile = require('../lib/readFile');
const writeFile = require('../lib/writeFile');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const client = new elastic.Client({ host: process.env.ES_HOST });

  try {
    const cache = await readFile(`${__dirname}/../cache/general.json`);

    if (cache) {
      res.json(cache);
      return;
    }
  } catch (err) {
    const topicsAggs = {
      mostUsedTopicWords: {
        terms: {
          field: 'topic',
          size: 50,
          exclude: EXCLUDE,
        },
      },

      totalUsedTopicWords: {
        value_count: {
          field: 'topic',
        },
      },
    };

    const entriesAggs = {
      mostUsedEntryWords: {
        terms: {
          field: 'text',
          size: 50,
          exclude: EXCLUDE,
        },
      },

      totalUsedEntryWords: {
        value_count: {
          field: 'text',
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
      mostUsedEntryWords: aggregationToWord(
        entriesResponse.aggregations.mostUsedEntryWords.buckets
      ),
      totalUsedEntryWords: aggregationToCount(entriesResponse.aggregations.totalUsedEntryWords),
    });

    writeFile(`${__dirname}/../cache/general.json`, {
      totalTopics: totalTopics.count,
      mostUsedTopicWords: aggregationToWord(topicsResponse.aggregations.mostUsedTopicWords.buckets),
      totalUsedTopicWords: aggregationToCount(topicsResponse.aggregations.totalUsedTopicWords),
      totalEntries: totalEntries.count,
      mostUsedEntryWords: aggregationToWord(
        entriesResponse.aggregations.mostUsedEntryWords.buckets
      ),
      totalUsedEntryWords: aggregationToCount(entriesResponse.aggregations.totalUsedEntryWords),
    });
  }
};
