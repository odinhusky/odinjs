export const generateNewFileName = (name, list, type) => {
  const res =  type === 'directory' ? `${name}_copy` : name.replace(/\.(?=[^.]*$)/, '_copy.');

  if (list.some(item => item.path === res)) return generateNewFileName(res, list, type)
  return res
}