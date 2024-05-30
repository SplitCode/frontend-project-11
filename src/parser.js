import { uniqueId } from 'lodash';

const parse = (request) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(request, 'application/xml');
  const rss = document.querySelector('rss');
  if (!document.contains(rss)) {
    const error = new Error('Parse error: invalid RSS');
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
    post.id = uniqueId();
    return post;
  });
  return { feed, posts };
};

export default parse;
