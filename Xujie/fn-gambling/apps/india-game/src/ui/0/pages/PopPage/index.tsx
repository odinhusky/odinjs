const bannerList = Array.from({ length: 9 }, (v, i) => `pop/banner_${i + 1}`);
const smList = [
  {
    img: 'pop/banner_sm_6',
  },
  {
    img: 'pop/banner_sm_7',
    detail: (
      <div className="text-[var(--grayscale-100)] text-sm font-medium p-2">
        <div>VIP Bonus!</div>
        <div>
          🙌 - Level up rewards{' '}
          <span className="text-[#FFE100]">₹20 - ₹30000</span>!
        </div>
        <div>
          🙌 - Monthly rewards{' '}
          <span className="text-[#FFE100]">₹30 - ₹99999</span>!
        </div>
      </div>
    ),
  },
  {
    img: 'pop/banner_sm_8',
  },
  {
    img: 'pop/banner_sm_9',
  },
];
const PopPage = () => {
  return null;
};
export default PopPage;
