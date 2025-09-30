import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  formBuilder = inject(FormBuilder);
  formRegister: FormGroup = this.renderForm();
  formUtils = FormUtils;

  renderForm() {
    return this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(FormUtils.namePattern)]],
      email: [null, [Validators.required, Validators.pattern(FormUtils.emailPattern)], [FormUtils.chekingServerResponse]],
      username: [null, [Validators.required, Validators.minLength(6)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required]],
    },
      {
        validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')]
      }
    );
  }

  onSubmit() {
    if (this.formRegister.invalid) {
      this.formRegister.markAllAsTouched();
      return;
    }

    console.log(this.formRegister.value);
  }

}
