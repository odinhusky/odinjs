import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const maxLimit = Number(import.meta.env['VITE_FETCH_BATCH_MAX_LIMIT'] || 5);

export const axiosBatch = rateLimit(axios.create(), {
  maxRequests: maxLimit,
  perMilliseconds: 1000,
});

export const axiosGetBatch = axiosBatch.get;
