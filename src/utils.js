const createButton = (postId, i18Inst) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.id = postId;
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = i18Inst.t('button.view');
  return button;
};

export default createButton;
