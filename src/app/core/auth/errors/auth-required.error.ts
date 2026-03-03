import { HttpErrorResponse } from '@angular/common/http';

/**
 * Custom error class for not authenticated user. In production case this would be thrown by the server. Currently,
 * server returns 401 only in case of missing token.
 */
export class AuthRequiredError extends HttpErrorResponse {
  constructor() {
    super({ status: 401 });
  }
}
