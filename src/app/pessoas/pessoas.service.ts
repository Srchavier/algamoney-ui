import { Injectable } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Pessoa } from '../core/model';
import { AuthHttp } from 'angular2-jwt';
import { environment } from '../../environments/environment';

export class PessoaFiltro {
  nome: string;
  paginas = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoasService {

  PessoaUrl: string;

  constructor(private http: AuthHttp) {
    this.PessoaUrl = `${environment.apiUrl}/pessoas`;
  }

  pesquisar(filtro: PessoaFiltro ): Promise<any> {
    const params = new URLSearchParams();
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    params.set('page', filtro.paginas.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }


    return this.http.get(`${this.PessoaUrl}`, { search: params })
    .toPromise()
    .then(response => {
      const respostaJson = response.json();
      console.log(response.json().content);
      const pessoas = response.json().content;

      const result = {
        pessoas,
        total: respostaJson.totalElements
      };
      return result;
    });
  }

  listarTodos(): Promise<any> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.get(`${this.PessoaUrl}`)
    .toPromise()
    .then(response =>
        response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.http.delete(`${this.PessoaUrl}/${codigo}`)
    .toPromise()
    .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    // headers.append('content-Type', 'application/json');

    return this.http.put(`${this.PessoaUrl}/${codigo}/ativo`, ativo)
      .toPromise()
      .then(() => null);
  }

  salvar(pessoa: Pessoa): Promise<Pessoa> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    // headers.append('content-Type', 'application/json');

    return this.http.post(`${this.PessoaUrl}`, JSON.stringify(pessoa))
      .toPromise()
      .then(response =>
          response.json());
  }

  buscarPeloCodigo(codigo: number): Promise<Pessoa> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    // headers.append('content-Type', 'application/json');

    return this.http.get(`${this.PessoaUrl}/${codigo}`)
      .toPromise()
      .then( respose => {
        const pessoas = respose.json() as Pessoa;

        return pessoas;
      });
  }

  AlterandoPessoa(pessoa: Pessoa): Promise<Pessoa> {
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    // headers.append('content-Type', 'application/json');

    return this.http.put(`${this.PessoaUrl}/${pessoa.codigo}`, JSON.stringify(pessoa))
      .toPromise()
      .then( respose => {
        const pessoaAlt = respose.json() as Pessoa;

        return pessoaAlt;
      });
  }


}


