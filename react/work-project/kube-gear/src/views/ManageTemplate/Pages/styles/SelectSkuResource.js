export const SelectSkuResource = () => ({
  formLabel: {
    marginBottom: 0,
    fontSize: 14,
    paddingRight: 0
  },
  debounceRestrictRangeFieldInput: {
    width: '100%',
    '& .MuiInputBase-root': {
      height: 40
    },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 14px) scale(1)'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    }
  }
});

export default SelectSkuResource;