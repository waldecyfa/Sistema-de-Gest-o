import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';


function Loading() {
    return <div>Carregando...</div>;
}

//--------------------------------

const Inicio = Loadable({
    loader: () => import('./views/Inicio'),
    loading: Loading,
});

// --------------------------- ESCALAÇÃO -------------------------------------

/********
 * LOCAL DE OPERAÇÃO
 */
const LocalOperacaoLista = Loadable({
  loader: () => import('./views/Escalacao/LocalOperacao/Lista'),
  loading: Loading,
});

const LocalOperacaoNovo = Loadable({
loader: () => import('./views/Escalacao/LocalOperacao/Novo'),
loading: Loading,
});

const LocalOperacaoEditar = Loadable({
loader: () => import('./views/Escalacao/LocalOperacao/Editar'),
loading: Loading,
});


// --------------------------- SEGURANÇA -------------------------------------

/********
 * USUÁRIO
 */
const AlterarSenha = Loadable({
    loader: () => import('./views/Seguranca/Usuario/AlterarSenha/AlterarSenha'),
    loading: Loading,
});

const SegurancaUsuarioLista = Loadable({
    loader: () => import('./views/Seguranca/Usuario/Lista'),
    loading: Loading,
});

const SegurancaUsuarioNovo = Loadable({
  loader: () => import('./views/Seguranca/Usuario/Novo'),
  loading: Loading,
});

const SegurancaUsuarioEditar = Loadable({
  loader: () => import('./views/Seguranca/Usuario/Editar'),
  loading: Loading,
});

/********
 * PERFIL
 */
const SegurancaPerfilLista = Loadable({
    loader: () => import('./views/Seguranca/Perfil/Lista'),
    loading: Loading,
});

const SegurancaPerfilNovo = Loadable({
  loader: () => import('./views/Seguranca/Perfil/Novo'),
  loading: Loading,
});

const SegurancaPerfilEditar = Loadable({
  loader: () => import('./views/Seguranca/Perfil/Editar'),
  loading: Loading,
});

/********
 * FUNÇÃO
 */
const SegurancaFuncaoLista = Loadable({
    loader: () => import('./views/Seguranca/Funcao/Lista'),
    loading: Loading,
});

const SegurancaFuncaoNovo = Loadable({
  loader: () => import('./views/Seguranca/Funcao/Novo'),
  loading: Loading,
});

const SegurancaFuncaoEditar = Loadable({
  loader: () => import('./views/Seguranca/Funcao/Editar'),
  loading: Loading,
});

/********
 * MENU
 */
const SegurancaMenuLista = Loadable({
  loader: () => import('./views/Seguranca/Menu/Lista'),
  loading: Loading,
});

const SegurancaMenuNovo = Loadable({
  loader: () => import('./views/Seguranca/Menu/Novo'),
  loading: Loading,
});

const SegurancaMenuEditar = Loadable({
  loader: () => import('./views/Seguranca/Menu/Editar'),
  loading: Loading,
});

/********
 * MODELO
 */
const SegurancaModeloLista = Loadable({
    loader: () => import('./views/Seguranca/Modelo/Lista'),
    loading: Loading,
});

const SegurancaModeloNovo = Loadable({
  loader: () => import('./views/Seguranca/Modelo/Novo'),
  loading: Loading,
});

const SegurancaModeloEditar = Loadable({
  loader: () => import('./views/Seguranca/Modelo/Editar'),
  loading: Loading,
});

/********
 * SERVIÇO
 */
const SegurancaServicoLista = Loadable({
    loader: () => import('./views/Seguranca/Servico/Lista'),
    loading: Loading,
});

const SegurancaServicoNovo = Loadable({
  loader: () => import('./views/Seguranca/Servico/Novo'),
  loading: Loading,
});

const SegurancaServicoEditar = Loadable({
  loader: () => import('./views/Seguranca/Servico/Editar'),
  loading: Loading,
});


// --------------------------- OPERADOR PORTUÁRIO -------------------------------------

const RelatorioConsolidacao = Loadable({
    loader: () => import('./views/OperadorPortuario/RelatorioConsolidacao'),
    loading: Loading,
});

const FiltrarRelatorioCons = Loadable({
    loader: () => import('./views/OperadorPortuario/FiltrarRelatorioCons'),
    loading: Loading,
});

const FolhaPagamentoFiltro = Loadable({
    loader: () => import('./views/OperadorPortuario/Relatorio/FolhaPagamento/Filtro'),
    loading: Loading,
});

const FolhaPagamentoModelo = Loadable({
    loader: () => import('./views/OperadorPortuario/Relatorio/FolhaPagamento/Modelo'),
    loading: Loading,
});

//
const EstatisticaFiltro = Loadable({
    loader: () => import('./views/OperadorPortuario/Relatorio/Estatistica/Filtro'),
    loading: Loading,
});

const EstatisticaModelo = Loadable({
    loader: () => import('./views/OperadorPortuario/Relatorio/Estatistica/Modelo'),
    loading: Loading,
});

const RequisicaoLista = Loadable({
    loader: () => import('./views/OperadorPortuario/Requisicao/Lista'),
    loading: Loading,
});

const RequisicaoPendente = Loadable({
  loader: () => import('./views/OperadorPortuario/Requisicao/Pendente/Lista'),
  loading: Loading,
});

const RequisicaoHistorico = Loadable({
  loader: () => import('./views/OperadorPortuario/Requisicao/Historico/Lista'),
  loading: Loading,
});

const RequisicaoNovo = Loadable({
  loader: () => import('./views/OperadorPortuario/Requisicao/Novo'),
  loading: Loading,
});

const RequisicaoEditar = Loadable({
  loader: () => import('./views/OperadorPortuario/Requisicao/Editar'),
  loading: Loading,
});

const RequisicaoModeloLista = Loadable({
    loader: () => import('./views/OperadorPortuario/Requisicao/Modelo/Lista'),
    loading: Loading,
});

const RequisicaoModeloNovo = Loadable({
  loader: () => import('./views/OperadorPortuario/Requisicao/Modelo/Novo'),
  loading: Loading,
});

const RequisicaoModeloEditar = Loadable({
  loader: () => import('./views/OperadorPortuario/Requisicao/Modelo/Editar'),
  loading: Loading,
});

const Pdf = Loadable({
    loader: () => import('./views/Pdf'),
    loading: Loading,
});


// --------------------------- OPERADOR PORTUÁRIO -------------------------------------

// const ProcessoLista = Loadable({
//     loader: () => import('./views/OperadorPortuario/Requisicao/Lista'),
//     loading: Loading,
// });

const ProcessoNovo = Loadable({
  loader: () => import('./views/Juridico/Processo/Novo'),
  loading: Loading,
});

// const ProcessoEditar = Loadable({
//   loader: () => import('./views/OperadorPortuario/Requisicao/Editar'),
//   loading: Loading,
// });


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    { path: '/', exact: true, name: 'Início', component: DefaultLayout },

    { path: '/escalacao/local-operacao/lista', name: 'Listar Local Operação', component: LocalOperacaoLista },
    { path: '/escalacao/local-operacao/novo', name: 'Novo Local Operação', component: LocalOperacaoNovo },
    { path: '/escalacao/local-operacao/editar', name: 'Editar Local Operação', component: LocalOperacaoEditar },

    { path: '/operador-portuario/requisicao/editar', name: 'Editar Requisição', component: RequisicaoEditar },    
    { path: '/operador-portuario/requisicao/pendente', name: 'Requisições Pendentes', component: RequisicaoPendente },
    { path: '/operador-portuario/requisicao/historico', name: 'Histórico de Requisições', component: RequisicaoHistorico },

    { path: '/operador-portuario/relatorioConsolidacao', name: 'Relatório Consolidação', component: RelatorioConsolidacao },
    { path: '/operador-portuario/filtrarRelatorioConsolidacao', name: 'Filtrar Relatório', component: FiltrarRelatorioCons },

    { path: '/operador-portuario/requisicao/lista', name: 'Listar Requisições', component: RequisicaoLista },
    { path: '/operador-portuario/requisicao/novo', name: 'Nova Requisição', component: RequisicaoNovo },
    { path: '/operador-portuario/requisicao/editar', name: 'Editar Requisição', component: RequisicaoEditar },

    { path: '/operador-portuario/requisicao/modelo/lista', name: 'Listar Modelos', component: RequisicaoModeloLista },
    { path: '/operador-portuario/requisicao/modelo/novo', name: 'Novo Modelo', component: RequisicaoModeloNovo },
    { path: '/operador-portuario/requisicao/modelo/editar', name: 'Editar Modelo', component: RequisicaoModeloEditar },

    { path: '/pdf', name: 'Pdf', component: Pdf },
    { path: '/operador-portuario/relatorio/folha-pagamento/filtro', name: 'Filtro Folha', component: FolhaPagamentoFiltro },
    { path: '/operador-portuario/relatorio/folha-pagamento/modelo', name: 'Modelo', component: FolhaPagamentoModelo },
    { path: '/operador-portuario/relatorio/estatistica/filtro', name: 'Filtro Estatistica', component: EstatisticaFiltro },
    { path: '/operador-portuario/relatorio/estatistica/modelo', name: 'Modelo', component: EstatisticaModelo },

    { path: '/inicio', name: 'Início', component: Inicio },    
    { path: '/seguranca/usuario/alterar-senha', name: 'Alterar Senha', component: AlterarSenha },
    { path: '/seguranca/usuario/lista', name: 'Listar Usuários', component: SegurancaUsuarioLista },
    { path: '/seguranca/usuario/novo', name: 'Novo Usuário', component: SegurancaUsuarioNovo },
    { path: '/seguranca/usuario/editar', name: 'Editar Usuário', component: SegurancaUsuarioEditar },

    { path: '/seguranca/funcao/lista', name: 'Listar Funções', component: SegurancaFuncaoLista },
    { path: '/seguranca/funcao/novo', name: 'Nova Função', component: SegurancaFuncaoNovo },
    { path: '/seguranca/funcao/editar', name: 'Editar Função', component: SegurancaFuncaoEditar },

    { path: '/seguranca/menu/lista', name: 'Listar Menu', component: SegurancaMenuLista },
    { path: '/seguranca/menu/novo', name: 'Novo Menu', component: SegurancaMenuNovo },
    { path: '/seguranca/menu/editar', name: 'Editar Menu', component: SegurancaMenuEditar },

    { path: '/seguranca/modelo/lista', name: 'Listar Modelos', component: SegurancaModeloLista },
    { path: '/seguranca/modelo/novo', name: 'Novo Modelo', component: SegurancaModeloNovo },
    { path: '/seguranca/modelo/editar', name: 'Editar Modelo', component: SegurancaModeloEditar },

    { path: '/seguranca/perfil/lista', name: 'Listar Perfis', component: SegurancaPerfilLista },
    { path: '/seguranca/perfil/novo', name: 'Novo Perfil', component: SegurancaPerfilNovo },
    { path: '/seguranca/perfil/editar', name: 'Editar Perfil', component: SegurancaPerfilEditar },

    { path: '/seguranca/servico/lista', name: 'Listar Serviços', component: SegurancaServicoLista },
    { path: '/seguranca/servico/novo', name: 'Novo Serviço', component: SegurancaServicoNovo },
    { path: '/seguranca/servico/editar', name: 'Editar Serviço', component: SegurancaServicoEditar },

    // { path: '/operador-portuario/requisicao/lista', name: 'Lista Requisições', component: RequisicaoLista },
    { path: '/juridico/processo/novo', name: 'Novo Processo', component: ProcessoNovo },
    // { path: '/operador-portuario/requisicao/editar', name: 'Editar Requisição', component: RequisicaoEditar },
];

export default routes;
