export const urlBuilder = (originalUrl) => {
  const url = new URL('https://allorigins.hexlet.app/get');
  url.searchParams.set('disableCache', true);
  url.searchParams.set('url', originalUrl);
  return url.href;
};

export const createButton = (postId, title) => {
  const button = document.createElement('button');
  button.textContent = title;
  button.setAttribute('type', 'button');
  button.dataset.id = postId;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modalWindow';
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  return button;
};

export const createItem = () => {
  const item = document.createElement('li');
  item.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  );
  return item;
};
