import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { LowerCasePipe } from '@angular/common';
import { ThemePalette } from '@angular/material/core';

export interface ConfirmActionDialogData {
  value?: string;
  color: ThemePalette;
  titleKey: string;
  messageKey: string;
  confirmKey: string;
}

@Component({
  selector: 'app-confirm-action-dialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe, LowerCasePipe],
  templateUrl: './confirm-action-dialog.component.html',
  styleUrl: './confirm-action-dialog.component.scss',
})
export class ConfirmActionDialogComponent {
  readonly dialog = inject(MatDialog);
  data: ConfirmActionDialogData = inject(MAT_DIALOG_DATA);
}
