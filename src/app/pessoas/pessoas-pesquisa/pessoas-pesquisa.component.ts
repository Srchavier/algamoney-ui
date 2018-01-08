import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { PessoaFiltro } from './../pessoas.service';
import { PessoasService } from '../pessoas.service';

import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { ToastyService } from 'ng2-toasty';

import { ErrorHandlerService } from './../../core/error-handler.service';


@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalDeItens = 0;
  pessoaFiltro = new PessoaFiltro();
  pessoas = [ ];
  @ViewChild('tabelaPessoa') grid;

  constructor(
    private pessoaService: PessoasService,
    private toasty: ToastyService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private title: Title
    ) {
  }
  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');
    // this.pesquisar();
  }

  pesquisar(pagina = 0 ) {
    this.pessoaFiltro.paginas = pagina;
    this.pessoaService.pesquisar(this.pessoaFiltro)
    .then(result => {
      this.pessoas = result.pessoas;
      this.totalDeItens = result.total;
    }).catch(
      erro => this.errorHandler.handle(erro)
    );
  }

  aoMudarDePagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }


  confirmarExcluir(pessoa: any) {
    this.confirmation.confirm({
      message: `Confirma a exclusão de ${pessoa.nome}`,
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoaService.excluir(pessoa.codigo)
    .then (() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        }else {
          this.grid.first = 0;
        }
        this.toasty.success(`${pessoa.nome} excluída!`);
      }
    ).catch(
      erro => this.errorHandler.handle(erro)
    );
  }

  mudarStatus(pessoa: any): void {
    const pessoaStatus = !pessoa.ativo;

    this.pessoaService.mudarStatus(pessoa.codigo, pessoaStatus)
    .then(() => {
      const tipo = pessoaStatus ? 'ativada' : 'desativada';
      pessoa.ativo = pessoaStatus;
      this.toasty.success(`${pessoa.nome} agora está ${tipo}`);

    }
  ).catch (
      erro => this.errorHandler.handle(erro)
    );
  }

}
