const aggregationToWord = require('../lib/aggregationToWord');
const aggregationToCount = require('../lib/aggregationToCount');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const topics = req.db.get('topics');
  const entries = req.db.get('entries');

  const totalTopicsPromise = topics.count();

  const mostUsedTopicWordsPromise = topics.aggregate([
    { $match: { stems: { $nin: EXCLUDE } } },
    { $unwind: '$stems' },
    { $group: { _id: '$stems', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1000 },
  ]);

  const totalUsedTopicWordsPromise = topics.aggregate([
    { $unwind: '$stems' },
    { $group: { _id: '$_id', sum: { $sum: 1 } } },
    { $group: { _id: null, total: { $sum: '$sum' } } },
  ]);

  const totalEntriesPromise = entries.count();

  const mostUsedEntryWordsPromise = entries.aggregate([
    { $match: { stems: { $nin: EXCLUDE } } },
    { $unwind: '$stems' },
    { $group: { _id: '$stems', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1000 },
  ]);

  const totalUsedEntryWordsPromise = entries.aggregate([
    { $unwind: '$stems' },
    { $group: { _id: '$_id', sum: { $sum: 1 } } },
    { $group: { _id: null, total: { $sum: '$sum' } } },
  ]);

  const [
    totalTopics,
    mostUsedTopicWords,
    totalUsedTopicWords,
    totalEntries,
    mostUsedEntryWords,
    totalUsedEntryWords,
  ] = await Promise.all([
    totalTopicsPromise,
    mostUsedTopicWordsPromise,
    totalUsedTopicWordsPromise,
    totalEntriesPromise,
    mostUsedEntryWordsPromise,
    totalUsedEntryWordsPromise,
  ]);

  res.json({
    totalTopics,
    mostUsedTopicWords: aggregationToWord(mostUsedTopicWords),
    totalUsedTopicWords: aggregationToCount(totalUsedTopicWords),
    totalEntries,
    mostUsedEntryWords: aggregationToWord(mostUsedEntryWords),
    totalUsedEntryWords: aggregationToCount(totalUsedEntryWords),
  });
};
