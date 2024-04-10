import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import resources from './locales/ru.js';
import updateUI from './view.js';
import parser from './parser.js';

const app = () => {
  const initialState = {
    form: {
      valid: true,
      error: null,
      state: '',
    },
    posts: [],
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.rss-form input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    yup.setLocale({
      mixed: {
        notOneOf: () => ({ key: 'errors.doubleUrl' }),
      },
      string: {
        url: () => ({ key: 'errors.errorUrl' }),
      },
    });
  })

  const watchedState = watch(initialState, elements, i18nextInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const dataUrl = formData.get('url');

    const schema = yup.string().url().trim().required();

    watchedState.form.process = 'filling';

    schema.validate(value)
      .then(() => {
        watchedState.form.valid = true;
        watchedState.form.process = 'sending';
        watchedState.form.links.push(value);
        watchedState.form.process = 'sent';
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.form.errors = error.message;
        watchedState.form.process = 'failed';
      })
      .finally(() => {
        watchedState.form.process = 'filling';
      });
  });
};

export default app;
