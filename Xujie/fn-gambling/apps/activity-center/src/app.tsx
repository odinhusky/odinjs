import { Provider } from 'react-redux';
import router from '@/router';
import { RouterProvider } from 'react-router-dom';
import { DeviceWrapper } from './templates/DeviceWrapper';
import { store } from '@/redux/store';

export function App() {
  return (
    <Provider store={store}>
      <DeviceWrapper>
        <RouterProvider router={router} />
      </DeviceWrapper>
    </Provider>
  );
}

export default App;
