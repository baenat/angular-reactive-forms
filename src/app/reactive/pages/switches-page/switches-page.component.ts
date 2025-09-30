import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-switches-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './switches-page.component.html',
})
export class SwitchesPageComponent {

  formBuilder = inject(FormBuilder);
  formUtils = FormUtils;

  form: FormGroup = this.renderForm();

  renderForm() {
    return this.formBuilder.group({
      gender: [null, Validators.required],
      wantNotifications: [false],
      termsAndConditions: [false, [Validators.required, Validators.requiredTrue]],
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log(this.form.value);
  }
}
