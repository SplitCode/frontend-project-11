import { uniqueId } from 'lodash';

const parse = (request) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(request.data.contents, 'application/xml');
  const rss = document.querySelector('rss');
  if (!document.contains(rss)) {
    const parseError = new Error('parse error');
    if (parseError) {
      throw new Error('invalidUrl');
    }
  }

  const feed = {};
  feed.title = rss.querySelector('title').textContent;
  feed.description = rss.querySelector('description').textContent;

  const itemElements = document.querySelectorAll('item');
  const posts = [...itemElements].map((item) => {
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
