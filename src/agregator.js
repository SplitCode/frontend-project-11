import * as yup from 'yup';
import onChange from 'on-change';

const schema = yup.object().shape({
  url: yup.string().trim().url().required('Ссылка должна быть валидным URL'),
});

const render = (elements, watchedState) => {
  const { form } = watchedState;

  switch (form.process) {
    case 'sent':
      // elements.inputUrl.classList.remove('is-invalid');
      console.log('sent');
      break;

    case 'error':
      elements.inputUrl.classList.add('is-invalid');
      console.log('error');
      break;

    case 'sending':
      // elements.inputUrl.classList.remove('is-invalid');
      console.log('sending');
      break;

    case 'filling':
      // elements.inputUrl.classList.remove('is-invalid');
      console.log('filling');
      break;

    default:
      throw new Error(`Unknown process state: ${form.process}`);
  }
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    submit: document.querySelector('button[type="submit"]'),
    inputUrl: document.querySelector('[name="url"]'),
  };

  const initialState = {
    form: {
      valid: true,
      url: '',
      process: 'filling',
    },
    errors: null,
  };

  const watchedState = onChange(initialState, render(elements, initialState));

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.form.process = 'sending';
    const formData = new FormData(e.target);
    const url = formData.get('url');

    try {
      await schema.validate({ url });
      watchedState.errors = null;
      watchedState.form.process = 'sent';

      // watchedState.feeds.push(value);
      watchedState.form.url = '';
      elements.inputUrl.classList.remove('is-invalid');
      elements.inputUrl.focus();
      render(elements, watchedState);
    } catch (error) {
      watchedState.errors = error.message;
      watchedState.form.process = 'error';
      render(elements, watchedState);
    }
  });
};

export default app;
