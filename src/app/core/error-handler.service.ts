import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { NotAuthenticatedError } from '../seguranca/money-http';
import { ToastyService } from 'ng2-toasty';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private toasty: ToastyService,
    private router: Router
  ) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Seção expiranda!';
      this.router.navigate(['/login']);
    } else if (errorResponse instanceof Response
      && errorResponse.status >= 400 && errorResponse.status <= 499 ) {
        let errors;
        msg = 'Erro ao precessar serviço remoto. Tente novamente.';
        if (errorResponse.status === 403) {
          msg = 'Você nao tem permissão para executa essa ação!';
        }

        try {
          errors = errorResponse.json();
          msg = errors[0].mensagemUsuario;
        }catch (e) {}
        console.log('Ocorreu um erro', errorResponse);
    }else {
      msg = 'Erro ao precessar serviço remoto. Tente novamente.';
      console.log('Ocorreu um erro', errorResponse);
    }

    this.toasty.error(msg);
  }
}
