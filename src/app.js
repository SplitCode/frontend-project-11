import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import ru from './locales/ru.js';
import parse from './parser.js';
import urlBuilder from './helpers.js';
// import watch from './view.js';
import updateUI from './view.js';

const delay = 5000;
const timeout = 10000;

const initialState = {
  form: {
    error: '',
    status: '',
  },
  loadingProcess: {
    error: '',
    status: '',
  },
  feeds: [],
  posts: [],
  ui: {
    id: null,
    readPosts: new Set(),
  },
};

// const getAxiosResponse = (link) => {
//   const url = urlBuilder(link);
//   return axios.get(url, { timeout: 10000 });
// };

const errorMessages = (error) => {
  if (error.isAxiosError) {
    return 'networkError';
  }
  if (error.isParserError) {
    return 'invalidUrl';
  }
  return 'unknownError';
};

const updatePosts = (watchedState) => {
  const { feeds } = watchedState;

  const promises = feeds.map((feed) => axios.get(urlBuilder(feed.url), timeout)
    .then((response) => {
      const { posts } = parse(response.data.contents);
      const newPosts = posts
        .filter((post) => !watchedState.posts.some((item) => item.title === post.title));
      watchedState.posts.unshift(...newPosts);
    })
    .catch(() => {}));
  Promise.all(promises)
    .then(() => {
      setTimeout(() => updatePosts(watchedState), delay);
    });
};

const loadRss = (watchedState, url) => {
  const { loadingProcess } = watchedState;
  axios.get(urlBuilder(url), timeout)
    .then((response) => {
      const { feed, posts } = parse(response.data.contents);
      feed.id = uniqueId();
      feed.url = url;
      const postsWithFeedId = posts.map((post) => ({
        ...post,
        feedId: feed.id,
      }));
      loadingProcess.status = 'success';
      watchedState.feeds.unshift(feed);
      watchedState.posts.unshift(...postsWithFeedId);
    })
    .catch((error) => {
      loadingProcess.error = errorMessages(error);
      loadingProcess.status = 'failed';
    });
};

const validateUrl = (url, urls) => {
  const schema = yup.string().url('errorUrl').required('emptyUrl').notOneOf(urls, 'doubleUrl');
  return schema
    .validate(url)
    .then(() => null)
    .catch((error) => error);
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-form input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsSection: document.querySelector('.posts'),
    feedsSection: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
  };

  const i18Inst = i18next.createInstance();
  i18Inst.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    // const watchedState = watch(initialState, i18Inst, elements);
    const watchedState = onChange(initialState, updateUI(initialState, i18Inst, elements));
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.form.status = 'processing'; // sending
      const urls = watchedState.feeds.map((feed) => feed.url);

      validateUrl(url, urls).then((error) => {
        if (error) {
          watchedState.form.error = error.message;
          watchedState.form.status = 'failed';
          return;
        }
        watchedState.form.error = '';
        loadRss(watchedState, url);
      });
    });

    elements.postsSection.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      if (id) {
        watchedState.ui.id = id;
        watchedState.ui.readPosts.add(id);
      }
    });

    updatePosts(watchedState);
  });
};

export default app;
