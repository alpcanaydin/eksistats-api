const aggregationToWord = require('../lib/aggregationToWord');
const aggregationToCount = require('../lib/aggregationToCount');

const EXCLUDE = require('../analysis/stop-words.json');

module.exports = async (req, res) => {
  const entries = req.db.get('entries');

  const author = req.query.author;

  if (!author) {
    res.json({
      mostUsedEntryWords: [],
      totalUsedEntryWords: 0,
    });

    return;
  }

  const mostUsedEntryWordsPromise = await entries.aggregate([
    {
      $match: {
        author,
        stems: { $nin: EXCLUDE },
      },
    },
    { $unwind: '$stems' },
    { $group: { _id: '$stems', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1000 },
  ]);

  const totalUsedEntryWordsPromise = await entries.aggregate([
    {
      $match: {
        author,
      },
    },
    { $unwind: '$stems' },
    { $group: { _id: '$_id', sum: { $sum: 1 } } },
    { $group: { _id: null, total: { $sum: '$sum' } } },
  ]);

  const [mostUsedEntryWords, totalUsedEntryWords] = await Promise.all([
    mostUsedEntryWordsPromise,
    totalUsedEntryWordsPromise,
  ]);

  res.json({
    author,
    mostUsedEntryWords: aggregationToWord(mostUsedEntryWords),
    totalUsedEntryWords: aggregationToCount(totalUsedEntryWords),
  });
};
