// import { createElement, createLink, createButton } from "./utils.js";

const handleError = (elem, err) => {
  const elements = { ...elem };
  // const {
  //   input, feedback, form, submit,
  // } = elem;
  elements.input.classList.replace('is-valid', 'is-invalid');
  // input.classList.remove('is-valid');
  // input.classList.add('is-invalid');
  elements.feedback.classList.replace('text-success', 'text-danger');
  // feedback.classList.remove('text-success');
  // feedback.classList.add('text-danger');
  elements.feedback.textContent = err;
  // feedback.textContent = JSON.stringify(err);
  elements.input.focus();
  elements.form.reset();
  elements.submitButton.removeAttribute('disabled');
};

const handleFinishError = (elem, i18Instance) => {
  const elements = { ...elem };
  // const {
  //   input, feedback, form, submit,
  // } = elem;
  elements.input.classList.replace('is-invalid', 'is-valid');
  // input.classList.remove('is-valid');
  // input.classList.add('is-invalid');
  elements.feedback.classList.replace('text-danger', 'text-success');
  // feedback.classList.remove('text-success');
  // feedback.classList.add('text-danger');
  elements.feedback.textContent = i18Instance.t('successUrl');
  elements.input.focus();
  elements.form.reset();
  elements.submitButton.removeAttribute('disabled');
};

const renderModalWindow = (elem, posts) => {
  const elements = { ...elem };
  // const { modalTitle, modalDescription, modalLink } = elem;
  const result = posts.forEach((post) => {
    const {
      title, description, link, id,
    } = post;
    elements.modalTitle.textContent = title;
    elements.modalDescription.textContent = description;
    elements.modalButton.setAttribute('href', link);

    const linkDom = document.querySelector(`[data-id="${id}"]`); // change style of text
    linkDom.classList.remove('fw-bold');
    linkDom.classList.add('fw-normal', 'text-muted');
  });
  return result;
};

const makeContainer = (elem, state, titleName, i18Instance) => {
  const elements = { ...elem };
  elements[titleName].textContent = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18Instance.t(titleName);
  cardBody.append(h2);
  card.append(cardBody);
  elements[titleName].append(card);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  if (titleName === 'feeds') {
    state.feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = feed.feedTitle;
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = feed.feedDescription;
      li.append(h3, p);
      ul.append(li);
    });
    card.append(ul);
  }
  if (titleName === 'posts') {
    state.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');

      if (state.readPost.find((redPost) => redPost.id === post.id)) {
        a.classList.remove('fw-bold');
        a.classList.add('fw-normal', 'text-muted');
      } else {
        a.classList.add('fw-bold');
      }

      a.dataset.id = post.id;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');

      a.setAttribute('href', post.link);
      a.textContent = post.title;

      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.dataset.id = post.id;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';
      button.textContent = i18Instance.t('show');

      li.append(a, button);
      ul.append(li);
    });
    card.append(ul);
  }
};

const updateUI = (state, elements, i18Instance) => (path, value) => {
  // const { submit } = elements;

  switch (path) {
    case 'form.status':
      if (value === 'failed') {
        handleError(elements, state.errors);
      }
      if (value === 'sent') {
        handleFinishError(elements, i18Instance);
      }
      if (value === 'sending') {
        elements.submitButton.setAttribute('disabled', true);
      }
      if (value === 'filling') {
        elements.submitButton.removeAttribute('disabled');
      }
      break;
    case 'feeds': {
      makeContainer(elements, state, 'feeds', i18Instance);
      break;
    }
    case 'posts': {
      makeContainer(elements, state, 'posts', i18Instance);
      break;
    }
    case 'readPost': {
      renderModalWindow(elements, value);
      break;
    }
    default:
      break;
  }
};

export default updateUI;
