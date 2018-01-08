import { LogoutService } from './logout.service';
import { Http, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { ButtonModule } from 'primeng/components/button/button';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';

import { SegurancaRoutingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { MoneyHttp } from './money-http';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

export function authHttpServiceFactory(auth: AuthService , http: Http, options: RequestOptions) {
  const config = new AuthConfig({
    globalHeaders: [
      {'content-Type': 'application/json'}
    ]
  });
  return new MoneyHttp(auth, config, http, options);
}

@NgModule({
  imports: [
    CommonModule,
    SegurancaRoutingModule,
    FormsModule,

    InputTextModule,
    ButtonModule
  ],
  declarations: [LoginFormComponent],
  providers: [
    {provide: AuthHttp, useFactory: authHttpServiceFactory
    , deps: [AuthService, Http, RequestOptions]
  },
  AuthGuard,
  LogoutService
]
})
export class SegurancaModule { }
