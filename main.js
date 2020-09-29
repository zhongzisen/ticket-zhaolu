import vueBootstrap from '@/shared/services/bootstrap';
import routes from '@/configs/routes';
import conditionHandlers from '@/configs/condition-handlers';

import '@/shared/styles/index.scss';
import './styles/index.scss';

const lifeCycles = vueBootstrap({ routes, conditionHandlers });

export const bootstrap = lifeCycles.bootstrap;
export const mount = lifeCycles.mount;
export const unmount = lifeCycles.unmount;
export const update = lifeCycles.update;
