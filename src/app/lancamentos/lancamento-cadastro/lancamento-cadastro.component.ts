import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { PessoasService } from './../../pessoas/pessoas.service';
import { LancamentoService } from './../lancamento.service';
import { CategoriaService } from '../../categorias/categoria.service';
import { Lancamento } from '../../core/model';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { ToastyService } from 'ng2-toasty';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];
  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();

  constructor(
    private categoriaService: CategoriaService,
    private lancamentoService: LancamentoService,
    private pessoaService: PessoasService,
    private toastyService: ToastyService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle(`Novo lançamento`);

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
    .then( lancamento => {
      this.lancamento = lancamento;
      this.alterarTitle();
    }).catch(
      error => this.errorHandler.handle(error)
    );
  }

  get editando(){
    return Boolean(this.lancamento.codigo);
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarLancamento(form);
    }else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoadd => {
        this.toastyService.success('Lançamento adicionado com sucesso!');

        // this.lancamento = new Lancamento();
        // form.reset();
        this.router.navigate(['/lancamentos', lancamentoadd.codigo]);
      }).catch(
        error => this.errorHandler.handle(error)
      );
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
      .then( lancamento => {
        this.lancamento = lancamento;
        this.toastyService.success('Alterando com sucesso!');
        this.alterarTitle();
      }).catch(
        erro => this.errorHandler.handle(erro)
      );

  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
    .then(categorias => {
      this.categorias = categorias.map(c => ({label: c.nome, value: c.codigo }));
    }).catch(
      erro => this.errorHandler.handle(erro)
    );
  }

  carregarPessoas() {
    return this.pessoaService.listarTodos()
    .then(pessoas => {
      this.pessoas = pessoas.map(p => ({label: p.nome, value: p.codigo}));
  })
    .catch(
      erro => this.errorHandler.handle(erro)
    );
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1); // modo gabirrara ativa em 1 milisegundo pf....
    this.router.navigate(['/lancamentos/novo']);
  }

  alterarTitle() {
    this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
  }

}
