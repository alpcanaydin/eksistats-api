// eslint-disable-next-line
const aggregationToWord = items => items.map(item => ({ word: item.key, count: item.doc_count }));

module.exports = aggregationToWord;
