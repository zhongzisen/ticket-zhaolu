import { debounce } from 'lodash';
import { JUMP_LOGIN_EVENT } from '../constants';

export default [
  // 未认证
  {
    condition: err => err.isUnauthenticated,
    handler: debounce(() => {
      if (!/\/login/g.test(location.pathname)) {
        qp.eventChannel.emit(JUMP_LOGIN_EVENT);
      }
    })
  }
];
