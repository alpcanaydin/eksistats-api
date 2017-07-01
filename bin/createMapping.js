const dotenv = require('dotenv');
const elasticsearch = require('elasticsearch');

// Dotenv config
dotenv.config();

const client = new elasticsearch.Client({ host: process.env.ES_HOST });

const body = {
  mappings: {
    [process.env.ES_TYPE]: {
      properties: {
        topic: {
          type: 'text',
          index: 'not_analyzed',
          fielddata: true,
        },
        topicStems: {
          type: 'text',
          index: 'not_analyzed',
          fielddata: true,
        },
        entries: {
          properties: {
            author: {
              type: 'string',
              index: 'not_analyzed',
            },
            createdAt: { type: 'date' },
            text: {
              type: 'text',
              index: 'not_analyzed',
              fielddata: true,
            },
            textStems: {
              type: 'text',
              index: 'not_analyzed',
              fielddata: true,
            },
            favories: {
              type: 'integer',
            },
          },
        },
      },
    },
  },
};

client.indices
  .exists({ index: process.env.ES_INDEX })
  .then(isExists => {
    if (isExists) {
      return client.indices.delete({ index: process.env.ES_INDEX });
    }

    return null;
  })
  .then(() =>
    client.indices.create({
      index: process.env.ES_INDEX,
      body,
    })
  )
  .then(() => {
    console.log('All done!');
  })
  .catch(err => {
    console.log(err);
  });
