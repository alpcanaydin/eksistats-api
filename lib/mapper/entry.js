const entryMapper = data => ({
  id: data.entryList[0].entryId,
  url: data.originalUrl,
  topic: data.topicText,
  author: {
    user: data.entryList[0].suser.nick,
    id: data.entryList[0].suser.suserId,
  },
  createdAt: data.entryList[0].creationDate,
  favorites: data.entryList[0].favoriteCount,
  comment: data.entryList[0].commentCount,
  text: data.entryList[0].entryText,
});

module.exports = entryMapper;
