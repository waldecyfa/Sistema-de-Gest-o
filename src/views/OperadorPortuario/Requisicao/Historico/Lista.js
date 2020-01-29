import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Lista from '../../../../components/Lista/Lista';
import {create} from 'apisauce';
import { 
    converteDataHoraSemTimezoneParaBr,
    converteSomenteDataParaBr,
    converteRequisicaoStatus,
    converteDataParaBd,
} from '../../../../components/Util';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as requisicaoActions } from '../../../../store/ducks/requisicao';
import { Creators as navegacaoActions } from '../../../../store/ducks/navegacao';
import {
    getBaseUrl,
} from '../../../../components/Oauth';
import debounce from 'lodash.debounce';
import RequisicaoResumo from '../../../../components/Requisicao/Resumo';

class RequisicaoLista extends Component {
    
    constructor(props) {
        super(props);

        // Delay action 1 second
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000);
    
        this.state = {
            carregandoExibe: false,

            erroTitulo: '',
            erroMensagem: '',
            erroExibe: false,

            lista: [],

            sortField: 'dtRequisicao',
            sortOrder: 'desc',
            busca: '',

            pageNumber: 1,
            pageSize: 20,
            pageTotalElements: 0,
            pageTotalPages: 0,

            exibeModelResumo: false,


            /**
             * DADOS DO RESUMO DA REQUISIÇÃO
             */
            id: 0,
            portoSelecionado: null,
            caisSelecionado: null,
            bercoSelecionado: null,
            navioSelecionado: null,
            dataOperacao: '',
            turnoSelecionado: null,
            quantidadeTerno: 0,              
            programacaoNavio: '',              
            observacao: '',

            listaAtividade: [],
            listaConferente: [],
            listaEstivador: [],
            listaCapatazia: [],
            listaArrumador: [],
            listaVigia: [],
            listaProducao: [],
        };
    }

       
    /**********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {

        this.getListaRequisicao();
    }

    aoMudarTabela = (type, { page, sizePerPage, sortField, sortOrder }) => {

        let newPage = (page !== undefined) ? page : this.state.pageNumber;
        let newSizePerPage = (sizePerPage !== undefined) ? sizePerPage : this.state.pageSize;
        let newSortField = (sortField !== undefined) ? sortField : this.state.sortField;
        let newSortOrder = (sortOrder !== undefined) ? sortOrder : this.state.sortOrder;

        this.setState({ 
            pageNumber: newPage,
            pageSize: newSizePerPage,
            sortField: newSortField,
            sortOrder: newSortOrder,
        }, () => {
            this.getListaRequisicao();
        });
    }

    aoBuscar = (event) => {

        this.setState({ busca: event.target.value });

        this.onChangeDebounced(event);        
    };

    onChangeDebounced = () => {
        // Delayed logic goes here
        this.getListaRequisicao();
    }

    /************
     * GET LISTA REQUISIÇÃO
     */
    getListaRequisicao = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = create({
                baseURL: getBaseUrl(),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ this.props.autenticacao.accessToken,
                }
            });

            // start making calls
            const response = await api.get(
                '/wsControleRequisicao/search/getPageableHistoricoPorIdOperadorPortuario',
                {},
                {
                    params: {
                        'idOperadorPortuario': this.props.autenticacao.idOperadorPortuario,
                        'projection': 'lista',
                        'sort': this.state.sortField + "," + this.state.sortOrder,
                        'search': this.state.busca,
                        'page': this.state.pageNumber - 1,
                        'size': this.state.pageSize
                    }
                }
            );

            if(response.ok) {
                
                let lista = [];
            
                for (let i = 0; i < response.data._embedded.wsControleRequisicao.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.wsControleRequisicao[i].id,
                            dtEnvio: converteDataHoraSemTimezoneParaBr(response.data._embedded.wsControleRequisicao[i].dtEnvio),
                            dtRequisicao: converteSomenteDataParaBr(response.data._embedded.wsControleRequisicao[i].dtRequisicao),
                            turno: response.data._embedded.wsControleRequisicao[i].idTurno.descricao,
                            numeroRemessa: (response.data._embedded.wsControleRequisicao[i].idWsPacote.numeroRemessa === null) ? '-' : response.data._embedded.wsControleRequisicao[i].idWsPacote.numeroRemessa,
                            numeroRequisicaoOperador: (response.data._embedded.wsControleRequisicao[i].numeroRequisicaoOperador === null) ? '-' : response.data._embedded.wsControleRequisicao[i].numeroRequisicaoOperador,
                            status: converteRequisicaoStatus(response.data._embedded.wsControleRequisicao[i].status),
                            detail: <i className="fa fa fa-file-text-o fa-lg btn-acao" id={response.data._embedded.wsControleRequisicao[i].id} onClick={this.exibeResumo}></i>
                        },
                    );                    
                }

                this.setState({                     
                    pageNumber: response.data.page.number + 1,
                    pageSize: response.data.page.size,
                    pageTotalElements: response.data.page.totalElements,
                    pageTotalPages: response.data.page.totalPages,
                    lista: lista,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de requisições.',
                    erroExibe: true,
                });
            }
           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de requisições.',
                erroExibe: true,
            });
        }
    };


    /***********
     * ADICIONAR REQUISIÇÃO
     */
    adicionar = () => {
        this.props.setNavegacao(
            '/operador-portuario/requisicao/historico',
            'requisicao'
        );

        this.props.history.push('/operador-portuario/requisicao/novo');
    }

    /*********
     * EXIBE O RESUMO DA REQUISIÇÃO
     */
    exibeResumo = (event) => {

        this.getWsControleRequisicao(event.target.id);
    }

    alternarModelResumo = () => {
        this.setState({
            exibeModelResumo: !this.state.exibeModelResumo,
        });
    }

    /*****************
     * GET REQUISIÇÃO
     */
    getWsControleRequisicao = async (idWsControleRequisicao) => {
        try {

            // define the api
            const api = create({
                baseURL: getBaseUrl(),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ this.props.autenticacao.accessToken,
                }
            });

            // start making calls
            const response = await api.get(
                "/wsControleRequisicaoDto/" + idWsControleRequisicao,
                {},
            );

            if(response.ok) {

                /**
                 * ATIVIDADES / FUNÇÕES
                 */                                      
                let listaAtividade = [];

                if(response.data.wsAtividades.length > 0) {

                    for (let i = 0; i < response.data.wsAtividades.length; i++) {

                        if(response.data.wsAtividades[i].wsFuncoes.length > 0) {

                            for (let j = 0; j < response.data.wsAtividades[i].wsFuncoes.length; j++) {

                                listaAtividade.push({
                                    id: response.data.wsAtividades[i].id,
                                    terno: response.data.wsAtividades[i].numeroTerno,
                                    atividade: {
                                        label: response.data.wsAtividades[i].idAtividade.nome, 
                                        value: response.data.wsAtividades[i].idAtividade.id, 
                                        numeroQuadro: response.data.wsAtividades[i].idAtividade.numeroQuadro,
                                        // value: response.data.wsAtividades[i].idAtividade._links.self.href
                                    },
                                    funcao: {
                                        label: response.data.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao.idFuncaoEscalacao.nome, 
                                        value: response.data.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao.id,
                                        // id: response.data.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao.id,
                                        // value: response.data.wsAtividades[i].wsFuncoes[j]._links.self.href,
                                        nomeAbreviado: response.data.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao.idFuncaoEscalacao.nomeAbreviado, 
                                    },
                                    quantidade: response.data.wsAtividades[i].wsFuncoes[j].quantidadeHomem,
                                });
                            }
                        }
                    }
                }

                /**
                 * PRODUÇÕES
                 */
                let listaProducao = [];

                if((response.data.wsProducoes !== null) && (response.data.wsProducoes.length > 0)) {

                    for (let i = 0; i < response.data.wsProducoes.length; i++) {

                        listaProducao.push({
                            id: response.data.wsProducoes[i].id,
                            faina: {
                                label: response.data.wsProducoes[i].idFaina.descricao, 
                                value: response.data.wsProducoes[i].idFaina.id,
                                // value: response.data.wsProducoes[i].idFaina._links.self.href,
                                numero: response.data.wsProducoes[i].idFaina.numero,
                            },
                            produto: {
                                label: response.data.wsProducoes[i].idProdutoEscalacao.nome, 
                                nomeAbreviado: response.data.wsProducoes[i].idProdutoEscalacao.nomeAbreviado, 
                                value: response.data.wsProducoes[i].idProdutoEscalacao.id,
                                // value: response.data.wsProducoes[i].idProdutoEscalacao._links.self.href
                            },
                            movimentacao: {
                                label: response.data.wsProducoes[i].idMovimentacao.descricao, 
                                descricaoAbreviada: response.data.wsProducoes[i].idMovimentacao.descricaoAbreviada,
                                value: response.data.wsProducoes[i].idMovimentacao.id,
                                // value: response.data.wsProducoes[i].idMovimentacao._links.self.href 
                            },
                            producao: response.data.wsProducoes[i].quantidadeProduto,
                            tonelagem: response.data.wsProducoes[i].quantidadeTonelagem,
                            cliente: {
                                cnpj: response.data.wsProducoes[i].cnpjCliente,
                                razaoSocial: response.data.wsProducoes[i].razaoSocialCliente,
                                label: response.data.wsProducoes[i].nomeFantasiaCliente,
                            },
                        });
                    }
                }

                const listaAtividadeOrdenada = [].concat(listaAtividade)
                .sort( function(a, b) {
                    if( (a.atividade.value < b.atividade.value) ) { return -1; }
                    return 0;
                })

                let listaEstivador = [];
                let listaConferente = [];
                let listaVigia = [];
                let listaArrumador = [];
                let listaCapatazia = [];

                let qtdTerno = 0;

                for (let i = 0; i < listaAtividadeOrdenada.length; i++) {

                    if ( listaAtividadeOrdenada[i].terno > qtdTerno ) {
                        qtdTerno = listaAtividadeOrdenada[i].terno;
                    }

                    switch (listaAtividadeOrdenada[i].atividade.value) {

                        // ESTIVADOR
                        case 1:    
                            listaEstivador.push( listaAtividadeOrdenada[i] );
                            break;

                        // CONFERENTE
                        case 2:    
                            listaConferente.push( listaAtividadeOrdenada[i] );
                            break;
                    
                        // VIGIA
                        case 4:    
                            listaVigia.push( listaAtividadeOrdenada[i] );
                            break;

                        // ARRUMADOR
                        case 7:    
                            listaArrumador.push( listaAtividadeOrdenada[i] );
                            break;

                        // CAPATAZIA
                        case 11:    
                            listaCapatazia.push( listaAtividadeOrdenada[i] );
                            break;

                        default:
                            break;
                    }

                }

                const listaEstivadorOrdenada = [].concat(listaEstivador)
                    .sort( function(a, b) {
                        if( (a.terno < b.terno) ) { return -1; }
                        return 0;
                    })

                const listaConferenteOrdenada = [].concat(listaConferente)
                    .sort( function(a, b) {
                        if( (a.terno < b.terno) ) { return -1; }
                        return 0;
                    })

                const listaVigiaOrdenada = [].concat(listaVigia)
                    .sort( function(a, b) {
                        if( (a.terno < b.terno) ) { return -1; }
                        return 0;
                    })

                const listaArrumadorOrdenada = [].concat(listaArrumador)
                    .sort( function(a, b) {
                        if( (a.terno < b.terno) ) { return -1; }
                        return 0;
                    })

                const listaCapataziaOrdenada = [].concat(listaCapatazia)
                    .sort( function(a, b) {
                        if( (a.terno < b.terno) ) { return -1; }
                        return 0;
                    })

                /**
                 * DADOS DA REQUISIÇÃO
                 */
                this.setState({ 

                    /**
                     * DADOS DA REQUISIÇÃO
                     */
                    id: response.data.id,
                    // idOperadorPortuario: response.data.idOperadorPortuario.id,
                    portoSelecionado: {
                        label: response.data.idPorto.nome, 
                        value: response.data.idPorto.id,
                        // value: response.data.idPorto._links.self.href
                    },
                    caisSelecionado: {
                        label: response.data.idCais.nome, 
                        value: response.data.idCais.id,
                        // value: response.data.idCais._links.self.href 
                    },
                    bercoSelecionado: {
                        label: response.data.idBerco.nome, 
                        value: response.data.idBerco.id,
                        // value: response.data.idBerco._links.self.href
                    },
                    navioSelecionado: {
                        label: response.data.nomeNavio, 
                        lloyd: response.data.lloyd,
                    },
                    dataOperacao: converteDataParaBd(response.data.dtRequisicao),
                    turnoSelecionado: {
                        label: response.data.idTurno.descricao, 
                        value: response.data.idTurno.id,
                        // value: response.data.idTurno._links.self.href
                    },
                    // idWsPacote: response.data.idWsPacote.id,
                    numeroRequisicaoOperador: response.data.numeroRequisicaoOperador,
                    numeroRequisicaoOgmo: response.data.numeroRequisicaoOgmo,
                    // quantidadeTerno: response.data.quantidadeTerno,              
                    programacaoNavio: (response.data.numeroProgramacaoNavio === null) ? "" : response.data.numeroProgramacaoNavio,
                    observacao: (response.data.observacao === null) ? "" : response.data.observacao,

                    quantidadeTerno: qtdTerno,
                    listaEstivador: listaEstivadorOrdenada,
                    listaConferente: listaConferenteOrdenada,
                    listaVigia: listaVigiaOrdenada,
                    listaArrumador: listaArrumadorOrdenada,
                    listaCapatazia: listaCapataziaOrdenada,

                    listaProducao,

                    carregandoExibe: false
                }, () => {
                    this.alternarModelResumo();
                })
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível obter a requisição.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar a consulta da requisição.",
                erroExibe: true,
            });
        }
    };

    /************
     * RENDER
     */
    render() {

        const colunas = [
            {
                dataField: 'id',
                text: 'Sequência',
                sort: true,
                headerAlign: 'center',
                align: 'center'
            // }, {
            //     dataField: 'numeroRemessa',
            //     text: 'Remessa',
            //     sort: true,
            //     headerAlign: 'center',
            //     align: 'center'
            }, {
                dataField: 'numeroRequisicaoOperador',
                text: 'Requisição (OP)',
                sort: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'dtEnvio',
                text: 'Data Envio',
                sort: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'dtRequisicao',
                text: 'Data Requisição',
                sort: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'turno',
                text: 'Turno',
                sort: false,
                headerAlign: 'center',            
                align: 'center'
            }, {
                dataField: 'status',
                text: 'Status',
                sort: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'detail',
                text: 'Detalhe',
                headerAlign: 'center',
                align: 'center',
                // formatter: formataEdicao
            }
        ];

        return (

            <div>
                <Lista
                    titulo="Histórico de Requisições"

                    lista={ this.state.lista } 
                    colunas={ colunas } 
                    remota={true}

                    pageNumber={ this.state.pageNumber }
                    pageSize={ this.state.pageSize }
                    pageTotalElements={ this.state.pageTotalElements }
                    pageTotalPages={ this.state.pageTotalPages }
                    aoMudarTabela={ this.aoMudarTabela }

                    busca={this.state.busca}
                    aoBuscar={(event) => this.aoBuscar(event)}

                    sucessoExibe={false}

                    aoConfirmarErro={() => this.setState({erroExibe: false})}
                    exibeErro={this.state.erroExibe}
                    mensagemErro={this.state.erroMensagem}
                    
                    exibeCarregando={this.state.carregandoExibe}
                    aoAdicionar={this.adicionar}
                />

                {(this.state.exibeModelResumo) &&
                    <RequisicaoResumo 
                        exibeModelResumo={this.state.exibeModelResumo} 
                        alternarModelResumo={this.alternarModelResumo}
                        className={this.props.className}

                        nomeOperadorPortuario={this.props.autenticacao.nomeCompleto}
                        portoSelecionado={this.state.portoSelecionado}
                        caisSelecionado={this.state.caisSelecionado}
                        bercoSelecionado={this.state.bercoSelecionado}
                        navioSelecionado={this.state.navioSelecionado}
                        dataOperacao={this.state.dataOperacao}
                        turnoSelecionado={this.state.turnoSelecionado}
                        quantidadeTerno={this.state.quantidadeTerno}
                        programacaoNavio={this.state.programacaoNavio}

                        listaProducao={this.state.listaProducao}
                        listaConferente={this.state.listaConferente}
                        listaEstivador={this.state.listaEstivador}
                        listaCapatazia={this.state.listaCapatazia}
                        listaArrumador={this.state.listaArrumador}
                        listaVigia={this.state.listaVigia}
                        
                        observacao={this.state.observacao}
                        aoVoltarResumo={this.alternarModelResumo}
                    />
                }
            </div>
        );
    }
}


/************
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, requisicaoActions, navegacaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    requisicao: state.requisicao,
    navegacao: state.navegacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(RequisicaoLista));
