const parse = (request) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(request.data.contents, 'application/xml');
  const rss = document.querySelector('rss');
  if (!document.contains(rss)) {
    const error = new Error()
  }

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('invalidUrl');
  } else {
    const channel = doc.querySelector('channel');
    const titleChannel = doc.querySelector('channel title').textContent;
    const descriptionChannel = doc.querySelector('channel description').textContent;
    const feed = { titleChannel, descriptionChannel };

    const itemElements = channel.getElementsByTagName('item');
    const posts = [...itemElements].map((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('channel link').textContent;
      return {
        title,
        description,
        link,
      };
    });
    const rss = { feed, posts };
    return Promise.resolve(rss);
  }
};

export default parse;
