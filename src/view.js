import createButton from './utils.js';

const handleFormError = (elem, err) => {
  const elements = { ...elem };
  elements.input.classList.replace('is-valid', 'is-invalid');
  elements.feedback.classList.replace('text-success', 'text-danger');
  elements.feedback.textContent = err;
  elements.input.removeAttribute('disabled');
  elements.submitButton.removeAttribute('disabled');
};

const handleFormSuccess = (elem, i18Instance) => {
  const elements = { ...elem };
  elements.feedback.textContent = i18Instance.t('success.successUrl');
  elements.submitButton.removeAttribute('disabled');
  elements.input.removeAttribute('disabled');
  elements.feedback.classList.replace('text-danger', 'text-success');
  elements.input.classList.replace('is-invalid', 'is-valid');
  elements.input.focus();
  elements.form.reset();
};

const renderModalWindow = (elem, posts) => {
  const elements = { ...elem };
  const result = posts.forEach((post) => {
    const {
      title, description, link, id,
    } = post;
    elements.modalTitle.textContent = title;
    elements.modalDescription.textContent = description;
    elements.modalButton.setAttribute('href', link);

    const linkDom = document.querySelector(`[data-id="${id}"]`);
    linkDom.classList.remove('fw-bold');
    linkDom.classList.add('fw-normal', 'text-muted');
  });
  return result;
};

const createCardContainer = (elem, titleName, i18Instance) => {
  const elements = { ...elem };
  elements[titleName].textContent = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18Instance.t(`content.${titleName}`);
  cardBody.append(cardTitle);
  card.append(cardBody);
  elements[titleName].append(card);

  return card;
};

const createFeedsList = (state, elements, i18Instance) => {
  const feedsContainer = createCardContainer(elements, 'feeds', i18Instance);
  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.feedTitle;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.feedDescription;
    feedItem.append(feedTitle, feedDescription);
    feedList.append(feedItem);
  });

  feedsContainer.append(feedList);
};

const createPostsList = (state, elements, i18Instance) => {
  const postsContainer = createCardContainer(elements, 'posts', i18Instance);
  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0', 'rounded-0');

  state.posts.forEach((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const link = document.createElement('a');

    if (state.readPost.find((redPost) => redPost.id === post.id)) {
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal', 'text-muted');
    } else {
      link.classList.add('fw-bold');
    }

    link.dataset.id = post.id;
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('href', post.link);
    link.textContent = post.title;

    const button = createButton(post.id, i18Instance);

    postItem.append(link, button);
    postList.append(postItem);
  });

  postsContainer.append(postList);
};

const handleFormStatus = (value, elements, state, i18Instance) => {
  switch (value) {
    case 'failed':
      handleFormError(elements, state.errors);
      break;
    case 'sent':
      handleFormSuccess(elements, i18Instance);
      break;
    case 'sending':
      elements.submitButton.setAttribute('disabled', true);
      elements.input.setAttribute('disabled', true);
      break;
    case 'filling':
      elements.submitButton.removeAttribute('disabled');
      break;
    default:
      break;
  }
};

const updateUI = (state, elements, i18Instance) => (path, value) => {
  switch (path) {
    case 'form.status':
      handleFormStatus(value, elements, state, i18Instance);
      break;
    case 'feeds':
      createFeedsList(state, elements, i18Instance);
      break;
    case 'posts':
      createPostsList(state, elements, i18Instance);
      break;
    case 'readPost':
      renderModalWindow(elements, value);
      break;
    default:
      break;
  }
};

export default updateUI;
