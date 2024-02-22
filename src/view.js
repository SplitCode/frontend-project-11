const handleValidationError = (elements, error) => {
  const { inputUrl, feedback } = elements;
  inputUrl.classList.remove('is-valid');
  inputUrl.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.textContent = error;
  inputUrl.focus();
  elements.form.reset();
};

const handleSuccess = (elements) => {
  const { inputUrl, feedback } = elements;
  inputUrl.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = 'RSS успешно загружен';
  inputUrl.focus();
  elements.form.reset();
};

const updateUI = (elements, state) => (path, value) => {
  switch (path) {
    case 'form.process':
      if (value === 'failed') {
        handleValidationError(elements, state.form.errors);
      }
      if (value === 'sent') {
        handleSuccess(elements);
      }
      break;
    default:
      break;
  }
};

export default updateUI;
