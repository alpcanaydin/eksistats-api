// eslint-disable-next-line
const aggregationToWord = items => items.map(item => ({ word: item._id, count: item.count }));

module.exports = aggregationToWord;
