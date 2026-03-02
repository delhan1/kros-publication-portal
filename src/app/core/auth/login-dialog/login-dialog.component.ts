import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface LoginDialogResultData {
  id: string;
}

@Component({
  selector: 'app-login-dialog',
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
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss',
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  readonly idControl;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);

  constructor() {
    this.loginForm = this.fb.group({
      id: ['', [Validators.required]],
    });

    this.idControl = this.loginForm.controls['id'];
  }

  /**
   * Closes dialog with form values.
   */
  public submitHandler() {
    this.dialogRef.close(this.loginForm.value);
  }
}
