import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../seguranca/auth.service';
import { LogoutService } from '../../seguranca/logout.service';
import { ErrorHandlerService } from './../error-handler.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  exibindoMenu: boolean;

  constructor(
    public auth: AuthService,
    private logoutService: LogoutService,
    private handler: ErrorHandlerService,
    private router: Router
  ) {}

  criarNovoAccessToken() {
    this.auth.obterNovoAccessToken();
  }

  logout() {
    this.logoutService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    }).catch(erro => this.handler.handle(erro)
    );
  }

}
