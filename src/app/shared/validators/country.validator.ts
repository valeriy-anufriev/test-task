import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Country } from '../enums';

export function countryValidator(control: AbstractControl): ValidationErrors | null {
  const allowedCountries = Object.values(Country);

  return allowedCountries.includes(control.value) ? null : { invalidCountry: true };
}
