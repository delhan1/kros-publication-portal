import { Observable } from 'rxjs';
import { Comment } from '../../models/comments.model';

export abstract class CommentsApi {
  abstract getComments(postId: number): Observable<Comment[]>;
  abstract createComment(userId: number, comment: Partial<Comment>): Observable<Comment>;
  abstract deleteComment(id: number): Observable<void>;
}