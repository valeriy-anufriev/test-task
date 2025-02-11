import { Component, DestroyRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateUserFormComponent } from '../create-user-form/create-user-form.component';
import { User } from '../../../../shared/interfaces/create-user-form.interface';
import { AddNewFormCardComponent } from '../add-new-form-card/add-new-form-card.component';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { CreateUserFormService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-user-form-container',
  standalone: true,
  imports: [
    CreateUserFormComponent,
    ReactiveFormsModule,
    CommonModule,
    AddNewFormCardComponent,
  ],
  templateUrl: './create-user-form-container.component.html',
  styleUrl: './create-user-form-container.component.scss',
})
export class CreateUserFormContainerComponent {
  readonly formContainer: FormGroup<{ userFormArray: FormArray<FormControl<User>> }>;
  readonly isFormSubmitting$: Observable<boolean>;
  readonly submittingTimer$: Observable<number>;
  readonly invalidFormsCount$: Observable<number>;

  constructor(
    private formBuilder: FormBuilder,
    private createUserFormService: CreateUserFormService,
    private destroyRef: DestroyRef,
  ) {
    this.isFormSubmitting$ = this.createUserFormService.isFormsSubmitting$;
    this.formContainer = this.buildFormContainer();
    this.submittingTimer$ = this.createUserFormService.formsSubmittingTimer$;
    this.invalidFormsCount$ = this.getInvalidFormsCount();
  }

  get userFormArray(): FormArray<FormControl<User>> {
    return this.formContainer.get('userFormArray') as FormArray<FormControl<User>>;
  }

  submitForms(): void {
    this.createUserFormService.submitForms();
  }

  cancelFormSubmitting(): void {
    this.createUserFormService.cancelFormsSubmitting();
  }

  removeFormGroupByIndex(index: number): void {
    this.userFormArray.removeAt(index);
  }

  handleCreateFormEvent(): void {
    if (this.userFormArray.controls.length < 10) {
      this.userFormArray.push(this.createUserFormControl());
    }
  }

  private getInvalidFormsCount(): Observable<number> {
    return this.userFormArray.statusChanges
      .pipe(
        startWith(1),
        debounceTime(10),
        map(() => this.userFormArray.controls.filter((control) => !control.valid).length),
        takeUntilDestroyed(this.destroyRef),
      );
  }

  private buildFormContainer(): FormGroup<{ userFormArray: FormArray<FormControl<User>> }> {
    return this.formBuilder.group({
      userFormArray: this.formBuilder.array([this.createUserFormControl()]),
    });
  }

  private createUserFormControl(): FormControl<User> {
    return this.formBuilder.control({
      country: '',
      userName: '',
      birthday: '',
    });
  }
}
