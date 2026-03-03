import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { InfoSnackbarComponent, InfoSnackbarData } from './info-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {
  }

  /**
   * Shows info message using snack bar component.
   * @param messageKey Translation key for message.
   * @param params Translation params for message.
   */
  showInfoMessage(messageKey: string, params?: { [key: string]: string }): void {
    const snackbarData: InfoSnackbarData = {
      messageKey: messageKey,
      params: params
    };
    this.snackBar.openFromComponent(InfoSnackbarComponent, {
      data: snackbarData,
      duration: 5000
    });
  }
}
