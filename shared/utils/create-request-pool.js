import Pool from './pool';

const FETCH_REQUEST_POOL_SIZE = 15; // 针对 fetch 场景给出优化的 size
const FLUSH_DELTA_TIME = 25; // 单位：毫秒

function createRequestPool({ request, maxSize = FETCH_REQUEST_POOL_SIZE }) {
  let requestPool = new Pool({ maxSize });
  let timer = null;

  requestPool.on(Pool.events.ADD, function () {
    if (timer === null) {
      timer = setTimeout(requestPool.flush.bind(requestPool), FLUSH_DELTA_TIME);
    }
  });

  requestPool.on(Pool.events.FULL, function () {
    requestPool.flush();
  });

  requestPool.on(Pool.events.FLUSH, function (requestItems) {
    request(requestItems);
    clearTimeout(timer);
    timer = null;
  });

  return requestPool;
}

export default createRequestPool;
