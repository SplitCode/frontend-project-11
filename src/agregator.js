import * as yup from 'yup';
import onChange from 'on-change';
import updateUI from './view.js';

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    submit: document.querySelector('button[type="submit"]'),
    inputUrl: document.querySelector('[name="url"]'),
    feedback: document.querySelector('.feedback'),
  };

  const initialState = {
    form: {
      valid: true,
      url: '',
      process: 'filling',
      errors: [],
      links: [],
    },
  };

  const watchedState = onChange(initialState, updateUI(elements, initialState));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    const schema = yup.string()
      .url('Ссылка должна быть валидным URL')
      .notOneOf(watchedState.form.links, 'RSS уже существует')
      .trim();

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
