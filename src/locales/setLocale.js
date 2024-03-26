export default {
  mixed: {
    notOneOf: () => ({ key: 'message.doubleUrl' }),
  },
  string: {
    url: () => ({ key: 'message.invalidUrl' }),
  },
};
