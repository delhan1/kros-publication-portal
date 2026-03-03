import { User } from '../../models/users.model';

export const usersMockDb: User[] = [
  { id: 1, name: 'John Smith', email: 'john@mail.com', gender: 'male', status: 'active' },
  { id: 2, name: 'Anna Brown', email: 'anna@mail.com', gender: 'female', status: 'active' },
  { id: 3, name: 'Peter Johnson', email: 'peter@mail.com', gender: 'male', status: 'active' },
];
