import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';


import { Pessoa } from '../../core/model';
import { PessoasService } from './../pessoas.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {


  pessoa = new Pessoa();

  constructor(
    private handlerError: ErrorHandlerService,
    private toastyService: ToastyService,
    private pessoaService: PessoasService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    const codigo = this.route.snapshot.params['codigo'];
    this.title.setTitle('Cadastrado pessoa');

    if (codigo) {
      this.buscaPeloCodigo( codigo);
    }

  }

  salvar(form: FormControl) {
    if (this.editadoPessoa) {
      this.atualizarPessoa(form);
    } else {
      this.salvarPessoa(form);
    }
  }

  salvarPessoa(form: FormControl) {
    this.pessoaService.salvar(this.pessoa)
      .then(() => {
        this.toastyService.success(`${this.pessoa.nome} adicionada com sucesso!`);
        form.reset();
        this.pessoa = new Pessoa();
      }).catch(
        error => this.handlerError.handle(error)
      );
  }

  atualizarPessoa(form: FormControl) {
    this.pessoaService.AlterandoPessoa(this.pessoa)
      .then( pessoaAlt => {
        this.pessoa = pessoaAlt;
        this.toastyService.success('Pessoa alteranda');
        this.router.navigate(['pessoas/', pessoaAlt.codigo]);
      }).catch(
        error => this.handlerError.handle(error)
      );
  }

  buscaPeloCodigo(codigo: number) {
    this.pessoaService.buscarPeloCodigo(codigo)
    .then(pessoa => {
      this.pessoa = pessoa;
      this.titleAlterando();
    }).catch(
      erro => this.handlerError.handle(erro)
    );
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function(){
      this.pessoa = new Pessoa();
    }.bind(this), 1);
    this.router.navigate(['/pessoas/novo']);
  }

  get editadoPessoa() {
    return Boolean(this.pessoa.codigo);
  }

  titleAlterando() {
    this.title.setTitle(`Alterando pessoa: ${this.pessoa.nome}`);
  }


}
