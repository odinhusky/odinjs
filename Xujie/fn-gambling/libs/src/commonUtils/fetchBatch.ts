import pLimit from 'p-limit';

const maxLimit = Number(import.meta.env['VITE_FETCH_BATCH_MAX_LIMIT'] || 5);
const limit = pLimit(maxLimit);

export const fetchBatch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => limit(() => fetch(input, init));
