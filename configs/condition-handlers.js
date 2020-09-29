import { debounce } from 'lodash';

export default [
  {
    condition(err) {
      return err.isBizError;
    },
    handler: debounce(err => {
      qp.feedback.showToast({
        type: 'error',
        message: err.message
      });
    })
  }
];
