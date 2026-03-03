import { Observable } from 'rxjs';
import { User } from '../../models/users.model';

export abstract class UsersApi {
  abstract getUser(id: number): Observable<User>;
}