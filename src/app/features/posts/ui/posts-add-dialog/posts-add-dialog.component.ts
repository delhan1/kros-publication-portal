import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

export interface CreateDialogData {
  titleKey: string;
  nameKey: string;
  confirmKey: string;
}

export interface CreateDialogResultData {
  name: string;
  body: string;
}

@Component({
  selector: 'app-posts-add-dialog',
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
  templateUrl: './posts-add-dialog.component.html',
  styleUrl: './posts-add-dialog.component.scss',
})
export class PostsAddDialogComponent {
  addCommentForm: FormGroup;
  data: CreateDialogData = inject(MAT_DIALOG_DATA);
  readonly nameControl;
  readonly bodyControl;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PostsAddDialogComponent>);

  constructor() {
    this.addCommentForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      body: ['', [Validators.required]],
    });

    this.nameControl = this.addCommentForm.controls['name'];
    this.bodyControl = this.addCommentForm.controls['body'];
  }

  /**
   * Closes dialog with form values.
   */
  public submitHandler() {
    this.dialogRef.close(this.addCommentForm.value);
  }
}
