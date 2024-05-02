import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { uniqueId } from 'lodash';
import ru from './locales/ru.js';
import updateUI from './view.js';
import parser from './parser.js';

const delay = 5000;

const initialState = {
  form: {
    field: '',
    status: 'filling',
    valid: 'valid',
    addedLinks: [],
  },
  errors: null,
  posts: [],
  feeds: [],
  readPost: [],
  activePost: null,
};

const getAxiosResponse = (link) => {
  const url = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
  return axios.get(url, { timeout: 10000 });
};

const validation = (url, addedLinks, i18Instance) => {
  const schema = yup
    .string()
    .trim()
    .required(i18Instance.t('errors.emptyUrl'))
    .url(i18Instance.t('errors.errorUrl'))
    .notOneOf(addedLinks, i18Instance.t('errors.doubleUrl'))
    .validate(url);
  return schema;
};

const createFeed = (rss, value) => {
  const feedTitle = rss.titleChannel;
  const feedDescription = rss.descriptionChannel;
  const feedId = uniqueId();
  const feedLink = value;
  return {
    feedTitle,
    feedDescription,
    feedId,
    feedLink,
  };
};

const createPost = (newPosts) => {
  console.log(newPosts);
  const posts = newPosts.map((item) => {
    const id = uniqueId();
    console.log(id);
    const { title, description, link } = item;
    return {
      id,
      title,
      description,
      link,
    };
  });
  return posts;
};

const updatePosts = (state, time) => {
  const stateCopy = { ...state };
  const existPosts = stateCopy.posts;
  const { feeds } = stateCopy;

  const feedPromises = feeds.map((feed) => getAxiosResponse(feed.feedLink)
    .then((data) => parser(data))
    .then((parseData) => createPost(parseData.posts))
    .catch((error) => {
      stateCopy.errors = error.message;
    }));
  Promise.all(feedPromises)
    .then((posts) => {
      const newPosts = posts.flat();
      console.log(posts);
      const oldLinks = existPosts.map((post) => post.link);
      const newLinks = newPosts.map((item) => item.link);
      newLinks.forEach((link) => {
        if (!oldLinks.includes(link)) {
          const findedPost = newPosts.find((post) => post.link === link);
          state.posts.unshift(findedPost);
        }
      });
    })
    .catch((error) => {
      stateCopy.errors = error.message;
    })
    .finally(() => {
      setTimeout(() => updatePosts(state), time);
    });
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-form input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalButton: document.querySelector('.full-article'),
  };

  const i18Instance = i18next.createInstance();
  i18Instance
    .init({
      lng: 'ru',
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: i18Instance.t('doubleUrl'),
        },
        string: {
          url: i18Instance.t('errorUrl'),
        },
      });
    });

  const watchedState = onChange(
    initialState,
    updateUI(initialState, elements, i18Instance),
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.status = 'sending';
    const formData = new FormData(e.target);
    const value = formData.get('url');
    console.log(value);
    validation(value, watchedState.form.addedLinks, i18Instance)
      .then((url) => getAxiosResponse(url))
      .then((response) => parser(response))
      .then((rss) => {
        const feed = createFeed(rss.feed, value);
        const posts = createPost(rss.posts);
        watchedState.feeds.unshift(feed);
        watchedState.posts = posts.concat(watchedState.posts);
      })
      .then(() => {
        watchedState.form.valid = 'valid';
        watchedState.form.addedLinks.push(value);
        watchedState.form.status = 'sent';
        watchedState.form.field = value;
        updatePosts(watchedState, delay);
      })
      .catch((error) => {
        watchedState.form.valid = 'invalid';
        if (error.message === 'Network Error') {
          watchedState.errors = i18Instance.t('errors.networkError');
        } else if ((error.message === 'invalidUrl')) {
          watchedState.errors = i18Instance.t('errors.invalidUrl');
        } else {
          watchedState.errors = error.message;
        }
        watchedState.form.status = 'failed';
      })
      .finally(() => {
        watchedState.form.process = 'filling';
      });
  });

  elements.posts.addEventListener('click', (e) => {
    const idClick = e.target.dataset.id;
    if (idClick) {
      const selectPost = watchedState.posts.find((post) => idClick === post.id);
      if (selectPost) {
        watchedState.activePost = selectPost.id;
        watchedState.readPost.push(selectPost);
      }
    }
  });
};

export default app;
