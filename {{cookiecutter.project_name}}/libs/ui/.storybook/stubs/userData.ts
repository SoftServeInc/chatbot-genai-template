import { v4 as uuid } from 'uuid';
import UserAvatar from './assets/images/user-picture.png';

export const UserMock = {
  id: uuid(),
  avatar_url: UserAvatar,
  first_name: 'Mystery',
  last_name: 'User',
  username: 'mysterio@universe.com',
};
