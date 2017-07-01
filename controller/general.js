const aggregationToWord = require('../lib/aggregationToWord');
const aggregationToCount = require('../lib/aggregationToCount');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const topics = req.db.get('topics');
  const entries = req.db.get('entries');

  const mostUsedTopicWordsPromise = topics.aggregate([
    { $match: { stems: { $nin: EXCLUDE } } },
    { $unwind: '$stems' },
    { $group: { _id: '$stems', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 100 },
  ]);

  const totalUsedTopicWordsPromise = topics.aggregate([
    { $unwind: '$stems' },
    { $group: { _id: '$_id', sum: { $sum: 1 } } },
    { $group: { _id: null, total: { $sum: '$sum' } } },
  ]);

  const mostUsedEntryWordsPromise = entries.aggregate([
    { $match: { stems: { $nin: EXCLUDE } } },
    { $unwind: '$stems' },
    { $group: { _id: '$stems', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 100 },
  ]);

  const totalUsedEntryWordsPromise = entries.aggregate([
    { $unwind: '$stems' },
    { $group: { _id: '$_id', sum: { $sum: 1 } } },
    { $group: { _id: null, total: { $sum: '$sum' } } },
  ]);

  const [
    mostUsedTopicWords,
    totalUsedTopicWords,
    mostUsedEntryWords,
    totalUsedEntryWords,
  ] = await Promise.all([
    mostUsedTopicWordsPromise,
    totalUsedTopicWordsPromise,
    mostUsedEntryWordsPromise,
    totalUsedEntryWordsPromise,
  ]);

  res.json({
    mostUsedTopicWords: aggregationToWord(mostUsedTopicWords),
    totalUsedTopicWords: aggregationToCount(totalUsedTopicWords),
    mostUsedEntryWords: aggregationToWord(mostUsedEntryWords),
    totalUsedEntryWords: aggregationToCount(totalUsedEntryWords),
  });
};
