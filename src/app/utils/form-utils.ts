import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {

  static readonly namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static readonly emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static readonly notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors) {
    const keys = Object.keys(errors);
    if (keys.length === 0) return null;
    const key = keys[0];

    switch (key) {
      case 'required':
        return 'Este campo es requerido';

      case 'minlength':
        return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

      case 'min':
        return `Valor mínimo de ${errors['min'].min}`;

      case 'email':
        return `Email no es valido`;

      case 'pattern':
        if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
          return `Email no es permitido`
        }
        return `Error patron de expresion no controlado`;

      default:
        return `Error de validación no controlado ${key}`;
    }
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return (field1Value === field2Value ? null : { passwordsNotEqual: true });
    }
  }
}
