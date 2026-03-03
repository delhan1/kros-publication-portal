import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface CommentsAddDialogResultData {
  body: string;
}

@Component({
  selector: 'app-comments-add-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslatePipe,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatLabel,
  ],
  templateUrl: './comments-add-dialog.component.html',
  styleUrl: './comments-add-dialog.component.scss',
})
export class CommentsAddDialogComponent {
  addCommentForm: FormGroup;
  readonly bodyControl;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CommentsAddDialogComponent>);

  constructor() {
    this.addCommentForm = this.fb.group({
      body: ['', [Validators.required]],
    });

    this.bodyControl = this.addCommentForm.controls['body'];
  }

  /**
   * Closes dialog with form values.
   */
  public submitHandler() {
    this.dialogRef.close(this.addCommentForm.value);
  }
}
