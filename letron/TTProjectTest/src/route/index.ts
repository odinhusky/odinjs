// ? Types & Interface
import { ScreenUnit } from '@/type/route';

// % Components
import Login from '@/screen/Login';
import Home from '@/screen/Home';

export const screenList: ScreenUnit[] = [
  {
    key: 'login',
    name: 'Login',
    component: Login
  },
  {
    key: 'home',
    name: 'Home',
    component: Home
  }
];

export default screenList;