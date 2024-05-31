import onChange from 'on-change';
import { createButton, createItem } from './utils.js';

const createCardContainer = (title) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');
  const cardList = document.createElement('ul');
  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title');
  cardList.classList.add('list-group');
  cardTitle.textContent = title;
  card.append(cardBody, cardList);
  cardBody.append(cardTitle);
  return card;
};

const createFeedsList = (state, i18n, elements) => {
  const { feedsSection } = elements;
  const { feeds } = state;
  if (!feedsSection.hasChildNodes()) {
    const card = createCardContainer(i18n.t('feedsTitle'));
    feedsSection.append(card);
  }
  const card = feedsSection.querySelector('.card');
  const list = card.querySelector('ul');
  list.innerHTML = '';
  const items = feeds.map((feed) => {
    const item = document.createElement('li');
    const title = document.createElement('h3');
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    item.classList.add('list-group-item', 'border-0', 'border-end-0');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    description.textContent = feed.description;
    item.append(title, description);
    return item;
  });
  list.append(...items);
};

const createPostsList = (state, i18n, elements) => {
  const { postsSection } = elements;
  const { ui, posts } = state;
  if (!postsSection.hasChildNodes()) {
    const card = createCardContainer(i18n.t('postsTitle'));
    postsSection.append(card);
  }
  const card = postsSection.querySelector('.card');
  const list = card.querySelector('ul');
  list.innerHTML = '';
  const items = posts.map((post) => {
    const item = createItem();
    const link = document.createElement('a');
    const button = createButton(post.id, i18n.t('viewButton'));
    if (ui.readPosts.has(post.id)) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    } else {
      link.classList.add('fw-bold');
    }
    link.href = post.link;
    link.textContent = post.title;
    link.setAttribute('target', '_blank');
    item.append(link, button);
    return item;
  });
  list.append(...items);
};

const createModalWindow = (state, elements) => {
  const { modal } = elements;
  const { posts, ui } = state;
  const title = modal.querySelector('.modal-title');
  const description = modal.querySelector('.modal-body');
  const linkButton = modal.querySelector('.modal-footer a');
  const openedPost = posts.find((post) => post.id === ui.id);
  title.textContent = openedPost.title;
  description.textContent = openedPost.description;
  linkButton.setAttribute('href', openedPost.link);
};

const blockForm = (input, submitButton, feedbackEl) => {
  const feedback = feedbackEl;
  input.setAttribute('disabled', '');
  submitButton.setAttribute('disabled', '');
  feedback.textContent = '';
  feedback.classList.remove('text-danger');
  input.classList.remove('is-invalid');
};

const unblockForm = (input, submitButton) => {
  input.removeAttribute('disabled');
  submitButton.removeAttribute('disabled');
};

const handleFormStatus = (state, elements, i18n, value) => {
  const { form } = state;
  const { input, submitButton, feedback } = elements;

  switch (value) {
    case 'processing':
      blockForm(input, submitButton, feedback);
      break;
    case 'failed':
      feedback.textContent = i18n.t(form.error);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      unblockForm(input, submitButton);
      break;
    case 'success':
      unblockForm(input, submitButton);
      feedback.textContent = '';
      break;
    default:
      break;
  }
};

const handleLoadingProcess = (state, elements, i18n, value) => {
  const { loadingProcess } = state;
  const { feedback, input, submitButton } = elements;

  switch (value) {
    case 'loading':
      blockForm(input, submitButton, feedback);
      break;
    case 'success':
      feedback.textContent = i18n.t('successUrl');
      unblockForm(input, submitButton);
      input.classList.replace('is-invalid', 'is-valid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.value = '';
      input.focus();
      break;
    case 'failed':
      feedback.textContent = i18n.t(loadingProcess.error);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      unblockForm(input, submitButton);
      break;
    default:
      break;
  }
};

const updateUI = (state, i18n, elements) => (path, value) => {
  switch (path) {
    case 'form.status':
      handleFormStatus(state, elements, i18n, value);
      break;
    case 'loadingProcess.status':
      handleLoadingProcess(state, elements, i18n, value);
      break;
    case 'feeds':
      createFeedsList(state, i18n, elements);
      break;
    case 'posts':
      createPostsList(state, i18n, elements);
      break;
    case 'ui.readPosts':
      createModalWindow(state, elements);
      createPostsList(state, i18n, elements);
      break;
    default:
      break;
  }
};

const watch = (state, i18n, elements) => onChange(state, updateUI(state, i18n, elements));
export default watch;
