const elasticsearch = require('elasticsearch');

const esSearch = async (query, aggs) => {
  const client = new elasticsearch.Client({ host: process.env.ES_HOST });
  const response = await client.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    size: 0,
    body: {
      query,
      aggs,
    },
  });

  return Object.entries(response.aggregations).reduce(
    (prev, [agg, item]) => Object.assign({}, prev, { [agg]: item.buckets }),
    {}
  );
};

module.exports = esSearch;
