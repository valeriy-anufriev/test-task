import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  OnInit,
  Output
} from '@angular/core';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { Country } from '../../../../shared/enums';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { countryValidator, UsernameValidator } from '../../../../shared/validators';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-create-user-form',
  standalone: true,
  imports: [
    NgbInputDatepicker,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreateUserFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: CreateUserFormComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserFormComponent implements OnInit, ControlValueAccessor, Validator {
  @Output() close = new EventEmitter<void>();

  readonly form: FormGroup;
  readonly countryList = Object.values(Country);
  readonly today: NgbDateStruct;
  readonly isUserNameInvalid$: Observable<boolean>;

  constructor(
    private destroyRef: DestroyRef,
    private formBuilder: FormBuilder,
    private usernameValidator: UsernameValidator,
  ) {
    const currentDate = new Date();

    this.today = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };

    this.form = this.buildForm();
    this.isUserNameInvalid$ = this.getIsUserNameInvalid();
  }

  ngOnInit() {
    this.listenFormValueChanges();
  }

  onChange: (value: any) => void = () => {};

  onTouched: () => void = () => {};

  closeForm(): void {
    this.close.emit();
  }

  writeValue(value: unknown): void {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { invalid: true };
  }

  private listenFormValueChanges(): void {
    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      });
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      country: ['', [Validators.required, countryValidator]],
      userName: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.usernameValidator.validate()],
        }
      ],
      birthday: ['', [Validators.required]],
    });
  }

  private getIsUserNameInvalid(): Observable<boolean> {
    return this.form.get('userName').statusChanges
      .pipe(
        map((status) => status !== 'VALID'),
      );
  }

}
