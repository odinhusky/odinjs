export const paginationSetting = {
  clickable: true,
  renderBullet: (index: number, className: string) => {
    return `<span class="${className}"></span>`;
  },
};

export default paginationSetting;
