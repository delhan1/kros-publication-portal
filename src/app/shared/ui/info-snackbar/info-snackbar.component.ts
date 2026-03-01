import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

export interface InfoSnackbarData {
  messageKey: string;
  params?: { [key: string]: string };
}

@Component({
  selector: 'app-info-snackbar',
  imports: [TranslatePipe],
  templateUrl: './info-snackbar.component.html',
  styleUrl: './info-snackbar.component.scss',
})
export class InfoSnackbarComponent {
  readonly data: InfoSnackbarData = inject(MAT_SNACK_BAR_DATA);
}
