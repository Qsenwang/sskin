// validators.service.ts
import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    return startTime !== null && endTime !== null && endTime > startTime ? null : { timeRangeInvalid: true };
  };
}
