export const createElement = (tag, classes = [], textContent = '') => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  element.textContent = textContent;

  return element;
};

export const createLink = (post, state, classes = []) => {
  const { id, link, title } = post;
  const postLink = document.createElement('a');
  postLink.classList.add(...classes);
  postLink.textContent = title;
  postLink.setAttribute('href', link);
  postLink.setAttribute('data-id', id);
  postLink.setAttribute('target', '_blank');
  postLink.setAttribute('rel', 'noopener noreferrer');
  if (state.uiState.visitedPostsId.has(id)) {
    postLink.classList.remove('fw-bold');
    postLink.classList.add('link-secondary', 'fw-normal');
  }
  return postLink;
};

export const createButton = (classes = [], dataId = '', textContent = '', type = 'button', dataBsToggle = 'modal', dataBsTarget = '#modal') => {
  const button = document.createElement('button');
  button.classList.add(...classes);
  button.textContent = textContent;
  button.setAttribute('data-id', dataId);
  button.setAttribute('type', type);
  button.setAttribute('data-bs-toggle', dataBsToggle);
  button.setAttribute('data-bs-target', dataBsTarget);

  return button;
};
