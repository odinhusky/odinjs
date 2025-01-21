import { fetchBatch } from '@commonUtils/fetchBatch';

export const fetchBatchCurrentH5Version = async () => {
  const response = await fetchBatch('/', { method: 'HEAD' });
  // 获取响应头中的 Last-Modified 和 ETag 值
  const lastModified = response.headers.get('Last-Modified');
  const currentEtag = response.headers.get('ETag');
  return {
    lastModified,
    currentEtag,
  };
};
