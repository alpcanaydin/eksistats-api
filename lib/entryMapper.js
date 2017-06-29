const cheerio = require('cheerio');
const moment = require('moment');

const entryMapper = (id, html) => {
  const $ = cheerio.load(html);

  return {
    id,
    topic: $('#title').attr('data-title'),
    author: $('.entry-author').text(),
    createdAt: moment(
      $('.entry-date').text().split('~').map(item => item.trim())[0],
      'DD.MM.YYYY'
    ).utc(),
    favorites: $('.favorite-count toggles').text(),
    text: $('.content').text().trim().replace(/\n/g, ''),
  };
};

module.exports = entryMapper;
