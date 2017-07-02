const aggregationToCount = item => (item[0] ? item[0].total : 0);

module.exports = aggregationToCount;
