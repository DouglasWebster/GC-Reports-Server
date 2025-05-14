import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function passwordStrength(): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => {
  const password = control.value;
  console.log(`Validating: ${password} with a length of ${password.length}`)

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumericChar = /[0-9]/.test(password);
  const hasSpecialChar = /[!"#$%&'()*+,-.:;<?@\\[\]^_`{|}~/]/.test(password);
  const hasMinLength = (password.length > 7)
  const isPasswordValid = hasUpperCase && hasLowerCase && hasNumericChar && hasSpecialChar && hasMinLength ;

  const validationErrors: ValidationErrors = {
    hasUpperCase: !hasUpperCase,
    hasLowerCase: !hasLowerCase,
    hasNumericChar: !hasNumericChar,
    hasSpecialChar: !hasSpecialChar,
    hasMinLength: !hasMinLength
  }

  console.log(JSON.stringify(validationErrors))

  return isPasswordValid ? null : validationErrors;
}}

export const PasswordValidator = {
  passwordStrength,
};
