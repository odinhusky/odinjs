import BasePrimaryBtn from '@components/BasePrimaryBtn';

export const TestComponent = () => {
  return (
    <BasePrimaryBtn
      children="OK"
      debounceTimer={500}
      onClick={() => {
        console.log('!! OK');
      }}
    />
  );
};

export default TestComponent;
