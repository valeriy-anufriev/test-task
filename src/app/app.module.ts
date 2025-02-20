import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MockBackendInterceptor} from "./core/interceptors/mock-backend/mock-backend.interceptor";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserFormContainerComponent } from './features/create-user/components/create-user-form-container/create-user-form-container.component';

@NgModule({
  declarations: [AppComponent],
    imports: [
      BrowserModule,
      RouterOutlet,
      NgbModule,
      CreateUserFormContainerComponent,
    ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
