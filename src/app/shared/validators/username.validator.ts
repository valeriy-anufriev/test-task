import { catchError, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { UserService } from '../../core/services';

@Injectable({ providedIn: 'root' })
export class UsernameValidator {

  constructor(private userService: UserService) {}

  validate(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return this.userService.checkUsername(control.value).pipe(
        map((response) => response.isAvailable ? null : { usernameError: true }),
        catchError(() => of(null)),
      );
    };
  }
}
