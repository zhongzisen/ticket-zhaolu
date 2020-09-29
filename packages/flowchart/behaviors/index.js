import { FLOWCHART_MODE } from '../constants';

import './click-item';
import './drag-connect-node';
import './drag-add-node';
import './keyboard';

export default {
  [FLOWCHART_MODE.EDIT]: [
    'click-item',
    'drag-connect-node',
    'drag-add-node',
    'keyboard'
  ]
};
