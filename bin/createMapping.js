const dotenv = require('dotenv');
const elasticsearch = require('elasticsearch');

// Dotenv config
dotenv.config();

const client = new elasticsearch.Client({ host: process.env.ES_HOST });

const body = {
  mappings: {
    topics: {
      properties: {
        topic: {
          type: 'text',
          index: 'not_analyzed',
          fielddata: true,
        },
        stems: {
          type: 'text',
          index: 'not_analyzed',
          fielddata: true,
        },
      },
    },
    entries: {
      properties: {
        topic: {
          type: 'text',
          index: 'not_analyzed',
          fielddata: true,
        },
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
        stems: {
          type: 'text',
          index: 'not_analyzed',
          fielddata: true,
        },
        favorites: {
          type: 'integer',
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
