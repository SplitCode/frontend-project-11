import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import ru from './locales/ru.js';
import parse from './parser.js';
import { urlBuilder } from './utils.js';
import watch from './view.js';

const delay = 5000;
const axiosConfig = {
  timeout: 10000,
};

const initialState = {
  form: {
    status: '',
    error: '',
  },
  loadingProcess: {
    status: '',
    error: '',
  },
  feeds: [],
  posts: [],
  ui: {
    id: null,
    readPosts: new Set(),
  },
};

const fetchData = (url) => axios.get(urlBuilder(url), axiosConfig);

const handleLoadingError = (error) => {
  if (axios.isAxiosError(error)) {
    return 'networkError';
  }
  if (error.isParserError) {
    return 'invalidUrl';
  }
  return 'unknownError';
};

const updatePosts = (watchedState) => {
  const { feeds } = watchedState;
  const promises = feeds.map((feed) => fetchData(feed.url)
    .then((response) => {
      const { posts } = parse(response.data.contents);
      const newPosts = posts
        .filter((post) => !watchedState.posts.some((item) => item.title === post.title));
      watchedState.posts.unshift(...newPosts);
    })
    .catch((error) => {
      console.error(handleLoadingError(error));
    }));

  Promise.all(promises)
    .then(() => {
      setTimeout(() => updatePosts(watchedState), delay);
    });
};

const loadRss = (watchedState, url) => {
  const { loadingProcess } = watchedState;
  loadingProcess.status = 'loading';
  fetchData(url)
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
      loadingProcess.error = handleLoadingError(error);
      loadingProcess.status = 'failed';
    });
};

const validateUrl = (url, urls) => {
  const schema = yup.string().url('errorUrl').required('emptyUrl').notOneOf(urls, 'doubleUrl');
  return schema
    .validate(url)
    .then(() => { })
    .catch((error) => error);
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsSection: document.querySelector('.posts'),
    feedsSection: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
  };

  const i18n = i18next.createInstance();
  i18n.init({
    debug: false,
    lng: 'ru',
    resources: {
      ru,
    },
  }).then(() => {
    const watchedState = watch(initialState, i18n, elements);
    elements.form.addEventListener('submit', ((e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      const url = data.get('url');
      watchedState.form.status = 'processing';
      const urls = watchedState.feeds.map((feed) => feed.url);
      validateUrl(url, urls).then((error) => {
        if (error) {
          watchedState.form.error = error.message;
          watchedState.form.status = 'failed';
          return;
        }
        watchedState.form.error = '';
        watchedState.form.status = 'success';
        loadRss(watchedState, url);
      });
    }));
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
