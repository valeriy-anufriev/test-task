import { Injectable } from '@angular/core';
import { BehaviorSubject, concat, filter, interval, map, Observable, of, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateUserFormService {
  private readonly isFormsSubmittingSubject$ = new BehaviorSubject(false);

  constructor() { }

  get isFormsSubmitting$(): Observable<boolean> {
    return this.isFormsSubmittingSubject$.asObservable();
  }

  get formsSubmittingTimer$(): Observable<number> {
    return this.isFormsSubmittingSubject$.asObservable()
      .pipe(
        filter(Boolean),
        switchMap(() => concat(
          of(5),
          interval(1000).pipe(
            take(5),
            map((value) => 4 - value),
            tap({
              complete: () => this.cancelFormsSubmitting(),
            }),
          ),
        )),
      );
  }

  submitForms(): void {
    this.isFormsSubmittingSubject$.next(true);
  }

  cancelFormsSubmitting(): void {
    this.isFormsSubmittingSubject$.next(false);
  }
}
