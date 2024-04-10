import onChange from "on-change";
import { createElement, createLink, createButton } from "./utils.js";

export default (initState, elements, i18next) => {
  const handleForm = (state) => {
    const {
      form: { valid, error },
    } = state;
    const { input, feedback } = elements;

    if (!valid) {
      input.classList.add("is-invalid");
      feedback.classList.add("text-danger");
      feedback.textContent = i18next.t(`${error}`);
    } else {
      input.classList.remove("is-invalid");
    }
  };

  const handleStatus = (status, elements, i18n) => {
    const updatedElements = { ...elements };
    const enableFormInputs = () => {
      elements.buttonAddUrl.removeAttribute("disabled");
      elements.input.removeAttribute("disabled", true);
    };

    const disableFormInputs = () => {
      elements.buttonAddUrl.setAttribute("disabled", true);
      elements.input.setAttribute("disabled", true);
      elements.input.classList.remove("is-invalid");
    };

    const handleError = (elements, error) => {
      const { inputUrl, feedback } = elements;
      inputUrl.classList.remove("is-valid");
      inputUrl.classList.add("is-invalid");
      feedback.classList.remove("text-success");
      feedback.classList.add("text-danger");
      feedback.textContent = error;
      inputUrl.focus();
      elements.form.reset();
    };

    const handleSuccess = (elements, i18nInstance) => {
      const { inputUrl, feedback } = elements;
      inputUrl.classList.remove("is-invalid");
      feedback.classList.remove("text-danger");
      feedback.classList.add("text-success");
      feedback.textContent = i18nInstance.t("success.successUrl");
      inputUrl.focus();
      elements.form.reset();
    };

    const updateUI = (elements, state, i18nInstance) => (path, value) => {
      switch (path) {
        case "form.process":
          if (value === "failed") {
            handleError(elements, state.form.errors);
          }
          if (value === "sent") {
            handleSuccess(elements, i18nInstance);
          }
          break;
        default:
          break;
      }
    };
  };
};

// export default updateUI;
