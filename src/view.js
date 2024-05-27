import createButton from './utils.js';

const startLoadingProcess = (state, elements, i18Inst, value) => {
  const { loadingProcess } = state;
  console.log(loadingProcess);
  const {
    form, feedback, input, submitButton,
  } = elements;
  if (value === 'success') {
    feedback.textContent = i18Inst.t('successUrl');
    submitButton.removeAttribute('disabled');
    input.removeAttribute('disabled');
    feedback.classList.replace('text-danger', 'text-success');
    form.reset();
    input.focus();
  }
  if (value === 'failed') {
    feedback.textContent = i18Inst.t(loadingProcess.error);
    feedback.classList.add('text-danger');
    input.classList.add('is-invalid');
    input.removeAttribute('disabled');
    submitButton.removeAttribute('disabled');
  }
};

const renderModalWindow = (state, elements) => {
  const { modal } = elements;
  const { posts, ui } = state;
  const title = modal.querySelector('.modal-title');
  const description = modal.querySelector('.modal-body');
  const linkButton = modal.querySelector('.modal-footer a');
  const openedPost = posts.fin((post) => post.id === ui.id);
  title.textContent = openedPost.title;
  description.textContent = openedPost.description;
  linkButton.setAttribute('href', openedPost.link);
};

const createCardContainer = (title) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');

  const cardList = document.createElement('ul');
  cardList.classList.add('list-group', 'border-0', 'rounded-0');

  cardTitle.textContent = title;
  cardBody.append(cardTitle);
  card.append(cardBody);

  return card;
};

const createFeedsList = (state, i18Inst, elements) => {
  const { feedsSection } = elements;
  const { feeds } = state;
  if (!feedsSection.hasChildNodes()) {
    const card = createCardContainer(i18Inst.t('feeds'));
    feedsSection.append(card);
  }

  const card = feedsSection.querySelector('.card');
  const list = card.querySelector('ul');
  list.innerHTML = '';

  const items = feeds.map((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'border-end-0');
    const title = document.createElement('h3');
    title.classList.add('h6', 'm-0');
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.description;
    item.append(title, description);
    return item;
  });

  list.append(...items);
};

const createPostsList = (state, i18Inst, elements) => {
  const { postsSection } = elements;
  const { ui, posts } = state;
  if (!postsSection.hasChildNodes()) {
    const card = createCardContainer(i18Inst.t('posts'));
    postsSection.append(card);
  }
  const card = postsSection.querySelector('.card');
  const list = card.querySelector('ul');
  list.innerHTML = '';

  const items = posts.map((post) => {
    const item = document.createElement('li');
    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const link = document.createElement('a');
    const button = createButton(post.id, i18Inst);
    if (ui.readPosts.has(post.id)) {
      link.classList.add('fw-normal', 'link-secondary');
      link.classList.remove('fw-bold');
    } else {
      link.classList.add('fw-bold');
    }
    link.href = post.link;
    link.textContent = post.title;
    link.dataset.id = post.id;
    link.setAttribute('target', '_blank');
    item.append(link, button);
    return item;
  });

  list.append(...items);
};

const handleFormStatus = (state, elements, i18Inst, value) => {
  const { form } = state;
  const { input, submitButton, feedback } = elements;
  switch (value) {
    case 'processing':
      input.setAttribute('disabled', '');
      submitButton.setAttribute('disabled', '');
      feedback.textContent = '';
      feedback.classList.remove('text-danger');
      input.classList.remove('is-invalid');
      break;
    case 'failed':
      feedback.textContent = i18Inst.t(form.error);
      feedback.classList.add('text-danger');
      input.classList.add('is-invalid');
      input.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      break;
    default:
      break;
  }
};

const updateUI = (state, i18Inst, elements) => (path, value) => {
  switch (path) {
    case 'form.status':
      handleFormStatus(state, elements, i18Inst, value);
      break;
    case 'loadingProcess.status':
      startLoadingProcess(state, elements, i18Inst, value);
      break;
    case 'feeds':
      createFeedsList(state, i18Inst, elements);
      break;
    case 'posts':
      createPostsList(state, i18Inst, elements);
      break;
    case 'ui.readPosts':
      renderModalWindow(state, elements);
      createPostsList(state, i18Inst, elements);
      break;
    default:
      break;
  }
};

export default updateUI;
