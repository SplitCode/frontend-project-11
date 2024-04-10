import _ from 'lodash';

const RSSParser = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const rss = document.querySelector('rss');
  if (!doc.contains(rss)) {
    const error = new Error('is parser error');
    error.isParserError = true;
    throw error;
  }
  const feed = {};
  feed.title = rss.querySelector('title').textContent;
  feed.description = rss.querySelector('description').textContent;
  const items = document.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const post = {};
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');
    post.title = title.textContent;
    post.link = link.textContent;
    post.description = description.textContent;
    post.id = _.uniqueId();
    return post;
  });
  return { feed, posts };
};

export default RSSParser;
