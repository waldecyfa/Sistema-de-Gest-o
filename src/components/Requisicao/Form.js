import React, { Component } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    CardFooter,
    Col, 
    Row,
    Button,

    Collapse,

    Form,
    FormGroup,
    Label,
    Input,

    Table,

    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    
    FormFeedback,
} from 'reactstrap';
import Select from 'react-select';
import { 
    converteDataParaBr,
    getDataAtual,
    converteDataParaBd,
} from '../Util';
import { isNull } from 'util';
import {
    getApiAutenticado
} from '../Oauth';
import { 
    getEstiloInvalido,
    getEstiloValido,
} from '../Select';
import Carregando from '../Alerta/Carregando';
import Sucesso from '../Alerta/Sucesso';
import Erro from '../Alerta/Erro';
import RequisicaoResumo from './Resumo';
import { createHashHistory } from 'history';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as navegacaoActions } from '../../store/ducks/navegacao';


class RequisicaoForm extends Component {
  
    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);
    
        this.alternarModelModelo = this.alternarModelModelo.bind(this);
        this.erroForm = this.erroForm.bind(this);
        this.aoAlterarPorto = this.aoAlterarPorto.bind(this);
        this.alternarModelResumo = this.alternarModelResumo.bind(this);
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.alternarModelExclusao = this.alternarModelExclusao.bind(this);

        this.state = {     
            accordion: [true, false, false],
            exibeModelExclusao: false,       
            exibeModelModelo: false,
            exibeModelResumo: false,
            criarModelo: false,
            dataAtual: '',
            nomeModelo: '',

            /**
             * VALIDAÇÃO
             */
            validacao: {
                // REQUISIÇÃO
                porto: 'has-danger',
                cais: 'has-danger',
                berco: 'has-danger',
                navio: 'has-danger',
                dataOperacao: 'has-danger',
                turno: 'has-danger',
                // quantidadeTernos: 'has-danger',
                // ATIVIDADE
                qtdTerno: 'has-success',
                terno: 'has-danger',
                atividade: 'has-danger',
                funcao: 'has-danger',
                quantidade: 'has-danger',
                // PRODUÇÃO
                faina: 'has-danger',
                produto: 'has-danger',
                movimentacao: 'has-danger',
                producao: 'has-danger',
                tonelagem: 'has-danger',
                cliente: 'has-danger',

                nomeModelo: 'has-danger',
            }, 

            carregandoExibe: false,
            erroMensagem: '',
            erroExibe: false,
            sucessoExibe: false,
            
            /**
             * DADOS DA REQUISIÇÃO
             */
            id: 0, 
            portoSelecionado: null,
            portoOpcoes: [],
            portoCarregando: false,
            portoPlaceholder: "Selecione um porto",
            portoEstilo: "",

            caisSelecionado: null,
            caisOpcoes: [],
            caisCarregando: false,
            caisPlaceholder: "Selecione um porto",
            caisEstilo: "",

            bercoSelecionado: null,
            bercoOpcoes: [],
            bercoCarregando: false,
            bercoPlaceholder: "Selecione um porto",
            bercoEstilo: "",

            navioSelecionado: null,
            navioOpcoes: [],
            navioCarregando: false,
            navioPlaceholder: "Selecione um navio",
            navioEstilo: "",

            dataOperacao: '',
            
            turnoSelecionado: null,
            turnoOpcoes: [],
            turnoCarregando: false,
            turnoPlaceholder: "Selecione um turno",
            turnoEstilo: "",

            quantidadeTerno: 0,              
            programacaoNavio: '',              
            observacao: '',

            /**
             * ATIVIDADES / FUNÇÕES
             */
            terno: '',
            qtdTerno: '',
            exibeTerno: true,

            atividadeSelecionada: null,
            atividadeOpcoes: [],
            atividadeCarregando: false,
            atividadePlaceholder: "Selecione uma atividade",
            atividadeEstilo: "",

            funcaoSelecionada: null,
            funcaoOpcoes: [],
            funcaoCarregando: false,
            funcaoPlaceholder: "Selecione uma atividade",
            funcaoEstilo: "",

            quantidade: '',

            listaAtividade: [],
            listaConferente: [],
            listaEstivador: [],
            listaCapatazia: [],
            listaArrumador: [],
            listaVigia: [],

            /**
             * PRODUÇÕES
             */
            fainaSelecionada: null,
            fainaOpcoes: [],
            fainaCarregando: false,
            fainaPlaceholder: "Selecione uma faina",
            fainaEstilo: "",

            produtoSelecionado: null,
            produtoOpcoes: [],
            produtoCarregando: false,
            produtoPlaceholder: "Selecione um produto",
            produtoEstilo: "",

            movimentacaoSelecionada: null,
            movimentacaoOpcoes: [],
            movimentacaoCarregando: false,
            movimentacaoPlaceholder: "Selecione uma movimentação",
            movimentacaoEstilo: "",

            producao: '',              
            tonelagem: '',              

            clienteSelecionado: null,
            clienteOpcoes: [],
            clienteCarregando: false,
            clientePlaceholder: "Selecione um cliente",
            clienteEstilo: "",

            listaProducao: [],

            dtParede: "",
            numeroParede: 0,
        };
    }
       
    /***********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {
        
        this.setSelectInvalido('portoEstilo');
        this.setSelectInvalido('caisEstilo');
        this.setSelectInvalido('bercoEstilo');
        this.setSelectInvalido('navioEstilo');
        this.setSelectInvalido('turnoEstilo');
        this.setSelectInvalido('atividadeEstilo');
        this.setSelectInvalido('funcaoEstilo');
        this.setSelectInvalido('fainaEstilo');
        this.setSelectInvalido('produtoEstilo');
        this.setSelectInvalido('movimentacaoEstilo');
        this.setSelectInvalido('clienteEstilo');

        this.setState({ 
            // dataAtual: getDataAtual(),
            carregandoExibe: true

        }, () => {
            this.getListaPorto();
            this.getListaNavio();
            // this.getListaTurno();

            this.getListaAtividade();

            this.getListaFaina();
            this.getListaProduto();
            this.getListaMovimentacao();
            this.getListaCliente();
            this.getParametrizacaoParede();
        });
    }

    ehEdicao() {
        if( (this.props.id !== "") && (this.props.id !== null) && (this.props.id > 0) ) {
            return true;
        }
        else {
            return false;
        }
    }

    toggleAccordion(tab) {

        const prevState = this.state.accordion;
        const state = prevState.map((x, index) => tab === index ? !x : x);        
    
        this.setState({
            accordion: state,
        });
    }

    alternarModelExclusao() {
        this.setState({
            exibeModelExclusao: !this.state.exibeModelExclusao,
        });
    }

    alternarModelModelo() {
        this.setState({
            exibeModelModelo: !this.state.exibeModelModelo,
        });
    }

    alternarModelResumo() {
        this.setState({
            exibeModelResumo: !this.state.exibeModelResumo,
        });
    }

    aoAlterar = (event) => {

        this.setState({ [event.target.name]: event.target.value} );
    }

    aoMudarQtdTerno = (event) => {

        const { validacao } = this.state

        if( isNull(event) || (event.target.value === "") || (parseInt(event.target.value) === 0)) {
            validacao.qtdTerno = 'has-success';
            validacao.terno = 'has-danger';
            this.setState({ 
                exibeTerno: true,
                validacao
            });
        }
        else if( (parseInt(event.target.value) < 0)) {
            validacao.qtdTerno = 'has-danger';
            validacao.terno = 'has-danger';
            this.setState({ 
                exibeTerno: true,
                validacao
            });
        }
        else {
            validacao.qtdTerno = 'has-success';
            validacao.terno = 'has-success';
            this.setState({ 
                exibeTerno: false,
                validacao
            });
        }
    }
    
    defineCarregando(porto, navio, /*turno,*/ atividade, faina, produto, movimentacao, cliente, dtParede) {
        return {
            porto: porto, 
            navio: navio, 
            // turno: turno, 
            atividade: atividade, 
            faina: faina, 
            produto: produto, 
            movimentacao: movimentacao, 
            cliente: cliente,
            dtParede: (dtParede === "")
        };

    }

    verificaCarregando() {

        const listaCarregando = this.defineCarregando(
            this.state.portoCarregando, 
            this.state.navioCarregando,
            // this.state.turnoCarregando,
            this.state.atividadeCarregando,
            this.state.fainaCarregando,
            this.state.produtoCarregando,
            this.state.movimentacaoCarregando,
            this.state.clienteCarregando,
            this.state.dtParede
        );

        const existeCarregando = Object.keys(listaCarregando).some(x => listaCarregando[x]);

        if(!existeCarregando) {

            // MODELO
            if( this.props.navegacao.tipo === "modelo") {
                    
                if(this.ehEdicao()) {
                    this.getWsModeloRequisicao();
                }
                else {
                    this.setState({ carregandoExibe: false });
                }
            }            
            // REQUISICAO
            else {

                if(this.ehEdicao()) {

                    this.getWsControleRequisicao();
                }
                else {

                    if( this.props.idRequisicaoModelo > 0 ) {

                        this.getWsModeloRequisicao();
                    }
                    else {
                        this.setState({ carregandoExibe: false });
                    }
                }                                
            }
        }        
    }

    /************
     * GET LISTA PORTO
     */
    getListaPorto = async () => {
        try {

            this.setState({ 
                portoCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/porto',
                {},
            );

            if(response.ok && (response.data._embedded.porto.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.porto.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.porto[i].nome, 
                            value: response.data._embedded.porto[i].id,
                            // cais: response.data._embedded.porto[i]._links.cais.href,
                            // value: response.data._embedded.porto[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    portoOpcoes: [...opcoes],
                    portoCarregando: false,
                    caisOpcoes: [],
                    caisSelecionado: null,
                    bercoOpcoes: [],
                    bercoSelecionado: null,
                }, () => {

                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    portoCarregando: false,
                    portoPlaceholder: "Erro ao carregar...",
                    portoOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                portoCarregando: false,
                portoPlaceholder: "Erro ao carregar...",
                portoOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA CAIS
     */
    getListaCais = async () => {
        try {

            this.setState({ 
                caisCarregando: true,
                carregandoExibe: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/cais/search/findByIdPortoId',
                {},
                {
                    params: {
                        idPorto: this.state.portoSelecionado.value
                    }
                }
            );
               
            if(response.ok && (response.data._embedded.cais.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.cais.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.cais[i].nome, 
                            value: response.data._embedded.cais[i].id,
                            // bercos: response.data._embedded.cais[i]._links.bercos.href,
                            // value: response.data._embedded.cais[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    caisOpcoes: [...opcoes],
                    caisCarregando: false,
                    caisPlaceholder: "Selecione um cais",
                    bercoOpcoes: [],
                    bercoSelecionado: null,
                    bercoPlaceholder: "Selecione um cais",
                    carregandoExibe: false,
                });
            }
            else {

                this.setState({ 
                    caisCarregando: false,
                    caisPlaceholder: "Erro ao carregar...",
                    caisOpcoes: [],
                    carregandoExibe: false,
                });
            }
           
        } catch (err) {

            this.setState({ 
                caisCarregando: false,
                caisPlaceholder: "Erro ao carregar...",
                caisOpcoes: [],
                carregandoExibe: false,
            });
        }
    };

    /************
     * GET LISTA BERÇO
     */
    getListaBerco = async () => {
        try {

            this.setState({ 
                bercoCarregando: true,
                carregandoExibe: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/berco/search/findByIdCaisId',
                {},
                {
                    params: {
                        idCais: this.state.caisSelecionado.value
                    }
                }
            );

            if(response.ok && (response.data._embedded.berco.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.berco.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.berco[i].nome, 
                            value: response.data._embedded.berco[i].id,
                            // value: response.data._embedded.berco[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    bercoOpcoes: [...opcoes],
                    bercoCarregando: false,
                    bercoPlaceholder: "Selecione um berço",
                    carregandoExibe: false,
                });
            }
            else {

                this.setState({ 
                    bercoCarregando: false,
                    bercoPlaceholder: "Erro ao carregar...",
                    bercoOpcoes: [],
                    carregandoExibe: false,
                });
            }
           
        } catch (err) {

            this.setState({ 
                bercoCarregando: false,
                bercoPlaceholder: "Erro ao carregar...",
                bercoOpcoes: [],
                carregandoExibe: false,
            });
        }
    };

    /************
     * GET LISTA NAVIO
     */
    getListaNavio = async () => {
        try {

            this.setState({ 
                navioCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/navio/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok && (response.data._embedded.navio.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.navio.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.navio[i].nome, 
                            value: response.data._embedded.navio[i].id,
                            lloyd: response.data._embedded.navio[i].lloyd,
                            idTipoNavio: response.data._embedded.navio[i].idTipoNavio.id,
                            // value: response.data._embedded.navio[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    navioOpcoes: [...opcoes],
                    navioCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    navioCarregando: false,
                    navioPlaceholder: "Erro ao carregar...",
                    navioOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                navioCarregando: false,
                navioPlaceholder: "Erro ao carregar...",
                navioOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA TURNO
     */
    getListaTurno = async (doDia) => {
        try {

            this.setState({ 
                turnoCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/turno/search/getAtivos' + (doDia ? 'DoDia' : ''),
                {},
                {
                    params: {
                        'projection': 'completa',
                        'sort': 'id,asc'
                    }
                }
            );

            if(response.ok && (response.data._embedded.turno.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.turno.length; i++) {

                    if(!doDia || (this.state.numeroParede <= response.data._embedded.turno[i].numeroParede)) {
                        opcoes.push( 
                            { 
                                label: response.data._embedded.turno[i].descricao, 
                                value: response.data._embedded.turno[i].id,
                                // value: response.data._embedded.turno[i]._links.self.href
                            }
                        );
                    }
                }

                this.setState({ 
                    turnoOpcoes: [...opcoes],
                    turnoCarregando: false,
                    carregandoExibe: false,
                });
            }
            else {

                this.setState({ 
                    turnoCarregando: false,
                    turnoPlaceholder: "Erro ao carregar...",
                    turnoOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                turnoCarregando: false,
                turnoPlaceholder: "Erro ao carregar...",
                turnoOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA ATIVIDADE
     */
    getListaAtividade = async () => {
        try {

            this.setState({ 
                atividadeCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/atividade/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'lista'
                    }
                }
            );

            if(response.ok && (response.data._embedded.atividade.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.atividade.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.atividade[i].nome, 
                            value: response.data._embedded.atividade[i].id,
                            // funcoesEscalacao: response.data._embedded.atividade[i]._links.funcoesEscalacao.href,
                            numeroQuadro: response.data._embedded.atividade[i].numeroQuadro,
                            // value: response.data._embedded.atividade[i]._links.self.href   
                        }
                    );
                }

                this.setState({ 
                    atividadeOpcoes: [...opcoes],
                    atividadeCarregando: false,
                    funcaoOpcoes: [],
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    atividadeCarregando: false,
                    atividadePlaceholder: "Erro ao carregar...",
                    atividadeOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                atividadeCarregando: false,
                atividadePlaceholder: "Erro ao carregar...",
                atividadeOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA FUNÇÃO
     */
    getListaFuncao = async () => {
        try {

            this.setState({ 
                funcaoCarregando: true,
                carregandoExibe: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/associacaoFuncao/search/getAtivosPorAtividade',
                {},
                {
                    params: {
                        numeroQuadro: this.state.atividadeSelecionada.numeroQuadro
                    }
                }
            );            

            if(response.ok && (response.data._embedded.associacaoFuncao.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.associacaoFuncao.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.associacaoFuncao[i].idFuncaoEscalacao.nome, 
                            value: response.data._embedded.associacaoFuncao[i].id,
                            // value: response.data._embedded.associacaoFuncao[i]._links.self.href,
                            nomeAbreviado: response.data._embedded.associacaoFuncao[i].idFuncaoEscalacao.nomeAbreviado, 
                        }
                    );
                }

                const opcoesOrdenada = [].concat(opcoes)
                .sort( function(a, b) {
                    if(a.label < b.label) { return -1; }
                    if(a.label > b.label) { return 1; }
                    return 0;
                })

                this.setState({ 
                    funcaoOpcoes: [...opcoesOrdenada],
                    funcaoCarregando: false,
                    funcaoPlaceholder: "Selecione uma função",
                    carregandoExibe: false,
                });
            }
            else {

                this.setState({ 
                    funcaoCarregando: false,
                    funcaoPlaceholder: "Erro ao carregar...",
                    funcaoOpcoes: [],
                    carregandoExibe: false,
                });
            }
           
        } catch (err) {

            this.setState({ 
                funcaoCarregando: false,
                funcaoPlaceholder: "Erro ao carregar...",
                funcaoOpcoes: [],
                carregandoExibe: false,
            });
        }
    };

    /************
     * GET LISTA FAINA
     */
    getListaFaina = async () => {
        try {

            this.setState({ 
                fainaCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/faina/search/getAtivos',
                {},
            );

            if(response.ok && (response.data._embedded.faina.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.faina.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.faina[i].numero + " - " + response.data._embedded.faina[i].descricao, 
                            value: response.data._embedded.faina[i].id,
                            // value: response.data._embedded.faina[i]._links.self.href,
                            numero: response.data._embedded.faina[i].numero,
                        }
                    );
                }

                this.setState({ 
                    fainaOpcoes: [...opcoes],
                    fainaCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    fainaCarregando: false,
                    fainaPlaceholder: "Erro ao carregar...",
                    fainaOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                fainaCarregando: false,
                fainaPlaceholder: "Erro ao carregar...",
                fainaOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA PRODUTO
     */
    getListaProduto = async () => {
        try {

            this.setState({ 
                produtoCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/produtoEscalacao/search/getAtivos',
                {},
            );

            if(response.ok && (response.data._embedded.produtoEscalacao.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.produtoEscalacao.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.produtoEscalacao[i].nome, 
                            nomeAbreviado: response.data._embedded.produtoEscalacao[i].nomeAbreviado, 
                            value: response.data._embedded.produtoEscalacao[i].id,
                            // value: response.data._embedded.produtoEscalacao[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    produtoOpcoes: [...opcoes],
                    produtoCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    produtoCarregando: false,
                    produtoPlaceholder: "Erro ao carregar...",
                    produtoOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                produtoCarregando: false,
                produtoPlaceholder: "Erro ao carregar...",
                produtoOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA MOVIMENTAÇÃO
     */
    getListaMovimentacao = async () => {
        try {

            this.setState({ 
                movimentacaoCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/movimentacao',
                {},
            );
               
            if(response.ok && (response.data._embedded.movimentacao.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.movimentacao.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.movimentacao[i].descricao, 
                            descricaoAbreviada: response.data._embedded.movimentacao[i].descricaoAbreviada,
                            value: response.data._embedded.movimentacao[i].id,
                            // value: response.data._embedded.movimentacao[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    movimentacaoOpcoes: [...opcoes],
                    movimentacaoCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    movimentacaoCarregando: false,
                    movimentacaoPlaceholder: "Erro ao carregar...",
                    movimentacaoOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                movimentacaoCarregando: false,
                movimentacaoPlaceholder: "Erro ao carregar...",
                movimentacaoOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA CLIENTE
     */
    getListaCliente = async () => {
        try {

            this.setState({ 
                clienteCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/cliente/search/getAtivos',
                {},
            );

            if(response.ok && (response.data._embedded.cliente.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.cliente.length; i++) {

                    opcoes.push( 
                        { 
                            value: response.data._embedded.cliente[i].id,
                            cnpj: response.data._embedded.cliente[i].idPessoaJuridica.cnpj,
                            razaoSocial: response.data._embedded.cliente[i].idPessoaJuridica.razaoSocial,
                            label: response.data._embedded.cliente[i].idPessoaJuridica.nome,
                            // value: response.data._embedded.cliente[i]._links.self.href 
                        }
                    );
                }

                const opcoesOrdenada = [].concat(opcoes)
                .sort( function(a, b) {
                    if(a.label < b.label) { return -1; }
                    if(a.label > b.label) { return 1; }
                    return 0;
                })

                this.setState({ 
                    clienteOpcoes: [...opcoesOrdenada],
                    clienteCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    clienteCarregando: false,
                    clientePlaceholder: "Erro ao carregar...",
                    clienteOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                clienteCarregando: false,
                clientePlaceholder: "Erro ao carregar...",
                clienteOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };
    
    /*****************
     * GET REQUISIÇÃO
     */
    getWsControleRequisicao = async () => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/wsControleRequisicaoDto/" + this.props.id,
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

                    let clienteIndex = 0;
                    for (let i = 0; i < response.data.wsProducoes.length; i++) {

                        clienteIndex = this.state.clienteOpcoes.find(x => x.razaoSocial === response.data.wsProducoes[i].razaoSocialCliente);

                        if(clienteIndex !== undefined) {

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
                                    id: clienteIndex.id,
                                    cnpj: clienteIndex.cnpj,
                                    razaoSocial: clienteIndex.razaoSocial,
                                    label: clienteIndex.label,
                                    value: clienteIndex.value 
                                },
                            });
                        }
                        
                    }
                }

                /**
                 * DADOS DA REQUISIÇÃO
                 */
                let navioIndex = 0;
                navioIndex = this.state.navioOpcoes.find(x => (x.lloyd === response.data.lloyd) && (x.label === response.data.nomeNavio));

                const { validacao } = this.state

                validacao.porto = 'has-success';
                validacao.cais = 'has-success';
                validacao.berco = 'has-success';
                validacao.navio = 'has-success';
                validacao.turno = 'has-success';
                validacao.dataOperacao = 'has-success';
                // validacao.quantidadeTerno = 'has-success';

                this.setSelectValido('portoEstilo');
                this.setSelectValido('caisEstilo');
                this.setSelectValido('bercoEstilo');
                this.setSelectValido('navioEstilo');
                this.setSelectValido('turnoEstilo');

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
                        label: navioIndex.label, 
                        id: navioIndex.id,
                        lloyd: navioIndex.lloyd,
                        idTipoNavio: navioIndex.idTipoNavio,
                        value: navioIndex.value
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

                    /**
                     * ATIVIDADES / FUNÇÕES
                     */                                      
                    listaAtividade,

                    /**
                     * PRODUÇÕES
                     */
                    listaProducao,

                    /**
                     * VALIDAÇÃO
                     */
                    validacao,

                    carregandoExibe: false
                })
            }
            else {

                ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.value > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
                ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.value > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
                ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.value > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
                ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.value > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
                ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.value > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível obter a requisição.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.value > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
            ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.value > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
            ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.value > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
            ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.value > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
            ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.value > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar a consulta da requisição.",
                erroExibe: true,
            });
        }
    };
    
    /*****************
     * GET WS REQUISIÇÃO MODELO
     */
    getWsModeloRequisicao = async () => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/wsModeloRequisicao/" + ((this.props.idRequisicaoModelo > 0) ? this.props.idRequisicaoModelo : this.props.id),
                {},
                {
                    params: {
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok) {

                var jsonObj = JSON.parse(response.data.json);

                /**
                 * ATIVIDADES / FUNÇÕES
                 */                                      
                let listaAtividade = [];

                if(jsonObj.wsAtividades.length > 0) {

                    for (let i = 0; i < jsonObj.wsAtividades.length; i++) {

                        if(jsonObj.wsAtividades[i].wsFuncoes.length > 0) {

                            for (let j = 0; j < jsonObj.wsAtividades[i].wsFuncoes.length; j++) {

                                listaAtividade.push({
                                    // id: jsonObj.wsAtividades[i].idAtividade.id,
                                    terno: jsonObj.wsAtividades[i].numeroTerno,
                                    atividade: jsonObj.wsAtividades[i].idAtividade,
                                    funcao: jsonObj.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao,
                                    quantidade: jsonObj.wsAtividades[i].wsFuncoes[j].quantidadeHomem,
                                });
                            }
                        }
                    }
                }

                /**
                 * PRODUÇÕES
                 */
                let listaProducao = [];

                if(jsonObj.wsProducoes.length > 0) {

                    for (let i = 0; i < jsonObj.wsProducoes.length; i++) {

                        listaProducao.push({
                            id: jsonObj.wsProducoes[i].id,
                            faina: jsonObj.wsProducoes[i].idFaina,
                            produto: jsonObj.wsProducoes[i].idProdutoEscalacao,
                            movimentacao: jsonObj.wsProducoes[i].idMovimentacao,
                            producao: jsonObj.wsProducoes[i].quantidadeProduto,
                            tonelagem: jsonObj.wsProducoes[i].quantidadeTonelagem,
                            cliente: jsonObj.wsProducoes[i].idCliente,
                        });
                    }
                }

                /**
                 * DADOS DA REQUISIÇÃO
                 */

                const { validacao } = this.state

                validacao.porto = 'has-success';
                validacao.cais = 'has-success';
                validacao.berco = 'has-success';
                // validacao.navio = 'has-success';
                validacao.navio = 'has-danger';
                // validacao.turno = 'has-success';
                validacao.turno = 'has-danger';
                // validacao.dataOperacao = 'has-success';
                validacao.dataOperacao = 'has-danger';
                validacao.nomeModelo = 'has-success';
                // validacao.quantidadeTerno = 'has-success';

                this.setSelectValido('portoEstilo');
                this.setSelectValido('caisEstilo');
                this.setSelectValido('bercoEstilo');
                // this.setSelectValido('navioEstilo');
                this.setSelectInvalido('navioEstilo');
                // this.setSelectValido('turnoEstilo');
                this.setSelectInvalido('turnoEstilo');

                this.setState({ 

                    id: response.data.id,
                    nomeModelo: response.data.descricao,

                    /**
                     * DADOS DA REQUISIÇÃO
                     */                    
                    // idOperadorPortuario: jsonObj.idOperadorPortuario.id,
                    portoSelecionado: jsonObj.idPorto,
                    caisSelecionado: jsonObj.idCais,
                    bercoSelecionado: jsonObj.idBerco,
                    navioSelecionado: null, //jsonObj.idNavio,
                    dataOperacao: "", //jsonObj.dtRequisicao,
                    turnoSelecionado: null, //jsonObj.idTurno,
                    numeroRequisicaoOperador: jsonObj.numeroRequisicaoOperador,
                    numeroRequisicaoOgmo: jsonObj.numeroRequisicaoOgmo,
                    // quantidadeTerno: jsonObj.quantidadeTerno,              
                    programacaoNavio: "", //(jsonObj.numeroProgramacaoNavio === null) ? "" : jsonObj.numeroProgramacaoNavio,
                    observacao: "", //(jsonObj.observacao === null) ? "" : jsonObj.observacao,

                    /**
                     * ATIVIDADES / FUNÇÕES
                     */                                      
                    listaAtividade,

                    /**
                     * PRODUÇÕES
                     */
                    listaProducao,

                    /**
                     * VALIDAÇÃO
                     */
                    validacao,

                    carregandoExibe: false
                })
            }
            else {

                ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.value > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
                ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.value > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
                ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.value > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
                ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.value > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
                ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.value > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível obter o modelo de requisição.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.value > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
            ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.value > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
            ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.value > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
            ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.value > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
            ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.value > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar a busca dos dados do modelo.",
                erroExibe: true,
            });
        }
    };

    /************
     * GET PARAMETRIZACAO PAREDE
     */
    getParametrizacaoParede = async () => {
        try {

            // this.setState({ 
            //     existeCarregando: true
            // });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/parametrizacaoParede/search/getAtivo',
                {},
                {
                    params: {
                        'projection': 'completa',
                    }
                }
            );

            if(response.ok ) {

                this.setState({ 
                    dtParede: response.data.dtParede,
                    numeroParede: response.data.numeroParede,
                    // existeCarregando: false,
                }, () => {

                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não existe parede aberta!",
                    erroExibe: true,
                });
            }           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Não foi possível buscar a parametrização da parede.",
                erroExibe: true,
            });
        }
    };

    /************
     * GET LISTA TURNO OPERADOR PORTUARIO
     */
    getListaTurnoOperadorPortuario = async () => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/turnoOperadorPortuario/search/getAtivosDoDia',
                {},
                {
                    params: {
                        'projection': 'completa',
                        'idOperadorPortuario': this.props.idOperadorPortuario,
                    }
                }
            );

            if(response.ok && (response.data._embedded.turnoOperadorPortuario.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.turnoOperadorPortuario.length; i++) {

                    if(this.state.numeroParede <= response.data._embedded.turnoOperadorPortuario[i].numeroParede) {
                        opcoes.push( 
                            { 
                                label: response.data._embedded.turnoOperadorPortuario[i].idTurno.descricao, 
                                value: response.data._embedded.turnoOperadorPortuario[i].idTurno.id,
                            }
                        );
                    }
                }

                this.setState({ 
                    turnoOpcoes: [...opcoes],
                    turnoCarregando: false,
                    carregandoExibe: false,
                });
            }
            else {
                this.getListaTurno(true);
            }           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Não foi possível buscar os turnos (OP).",
                erroExibe: true,
            });
        }
    };


    /************
     * GET HORARIO REQUISICAO OPERADOR PORTUARIO
     */
    getHorarioRequisicaoOperadorPortuario = async () => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/horarioRequisicaoOperadorPortuario/search/getAtivoByNumeroParede',
                {},
                {
                    params: {
                        'projection': 'completa',
                        'idOperadorPortuario': this.props.idOperadorPortuario,
                        'numeroParede': this.state.numeroParede
                    }
                }
            );

            if(response.ok && (response.data._embedded.horarioRequisicaoOperadorPortuario.length > 0) ) {
            
                // let opcoes = [];

                // for (let i = 0; i < response.data._embedded.turnoOperadorPortuario.length; i++) {

                //     opcoes.push( 
                //         { 
                //             label: response.data._embedded.turno[i].descricao, 
                //             id: response.data._embedded.turno[i].id,
                //             value: response.data._embedded.turno[i]._links.self.href
                //         }
                //     );
                // }

                this.setState({ 
                    existeCarregando: false
                });
            }
            else {
                this.getHorarioRequisicao();
            }           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Não foi possível buscar os horários de requisição (OP).",
                erroExibe: true,
            });
        }
    };

    /************
     * GET HORARIO REQUISICAO
     */
    getHorarioRequisicao = async () => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/horarioRequisicao/search/getAtivoByNumeroParede',
                {},
                {
                    params: {
                        'projection': 'completa',
                        'numeroParede': this.state.numeroParede
                    }
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    existeCarregando: false,
                    horarioRecebimento: response.data.horarioRecebimento,
                    horarioAlteracao: response.data.horarioAlteracao,
                    horarioCancelamento: response.data.horarioCancelamento
                });

                // Verificar se Edição
                if(this.ehEdicao()) {

                    // Verificar se a hora atual é maior que a hora de alteração
                    // if() {
                    //     // Remover esse turno como opção de escolha
                    // }
                }
                // Caso seja Novo
                else {
                    // Verificar se a hora atual é maior que a hora de recebimento
                    // if() {
                    //     // Remover esse turno como opção de escolha
                    // }
                }

                this.setState({ 
                    existeCarregando: false
                });
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível encontrar os horários de requisição.",
                    erroExibe: true,
                });
            }           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Não foi possível buscar os horários de requisição.",
                erroExibe: true,
            });
        }
    };


    /*******************************
     ********************* VALIDAÇÃO
     */

    setSelectInvalido(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloInvalido() });
    }

    setSelectValido(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloValido() });
    }

    existeAtividade(comparaTerno, comparaAtividade, comparaFuncao, meuArray) {

        for (var i=0; i < meuArray.length; i++) {

            if ( 
                (meuArray[i].terno == comparaTerno) 
                && (meuArray[i].atividade.value == comparaAtividade.value) 
                && (meuArray[i].funcao.value == comparaFuncao.value) 
            ) {                
                return true;
            }
        }

        return false;
    }


    /**
      * REQUISIÇÃO
      */
    validaPorto(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.porto = 'has-danger';
        }
        else {
            validacao.porto = 'has-success';
        }

        this.setState({ validacao })
    }

    validaCais(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.cais = 'has-danger';
        }
        else {
            validacao.cais = 'has-success';
        }

        this.setState({ validacao })
    }

    validaBerco(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.berco = 'has-danger';
        }
        else {
            validacao.berco = 'has-success';
        }

        this.setState({ validacao })
    }

    validaNavio(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.navio = 'has-danger';
        }
        else {
            validacao.navio = 'has-success';
        }

        this.setState({ validacao })
    }

    validaTurno(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.turno = 'has-danger';
        }
        else {
            validacao.turno = 'has-success';
        }

        this.setState({ validacao })
    }

    validaDataOperacao(event) {
        
        const { validacao } = this.state
        if( event.target.value < this.state.dtParede ) {
            validacao.dataOperacao = 'has-danger';
            this.setSelectInvalido('turnoEstilo');
            this.setState({ 
                validacao,
                turnoSelecionado: null,
            })
        }
        else if( event.target.value === this.state.dtParede ) {
            validacao.dataOperacao = 'has-success';
            this.setSelectInvalido('turnoEstilo');
            this.setState({ 
                validacao,
                turnoSelecionado: null,
            }, () => {
                // this.getParametrizacaoParede();
                this.getListaTurnoOperadorPortuario();
            });
        }
        else {
            validacao.dataOperacao = 'has-success';
            this.setSelectInvalido('turnoEstilo');
            this.setState({ 
                validacao,
                turnoSelecionado: null,
            }, () => {
                this.getListaTurno(false);
            });
        }                
    }

    erroForm() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de continuar.',
            erroExibe: true,
        });
    }

    erroAdicionarTabela() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de adicioná-los.',
            erroExibe: true,
        });
    }

    erroAdicionarAtividadeTabela() {

        this.setState({ 
            erroMensagem: 'Já existe um terno contendo essa mesma atividade e função.',
            erroExibe: true,
        });
    }

    /**
      * ATIVIDADE
      */
    validaTerno(event) {
        
        const { validacao } = this.state

        if( event.target.value < 0) {
            validacao.terno = 'has-danger';
        }
        else {
            validacao.terno = 'has-success';
        }

        this.setState({ validacao })
    }

    validaAtividade(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.atividade = 'has-danger';
        }
        else {
            validacao.atividade = 'has-success';
        }

        this.setState({ validacao })
    }

    validaFuncao(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.funcao = 'has-danger';
        }
        else {
            validacao.funcao = 'has-success';
        }

        this.setState({ validacao })
    }

    validaQuantidade(event) {
        
        const { validacao } = this.state

        if( event.target.value <= 0) {
            validacao.quantidade = 'has-danger';
        }
        else {
            validacao.quantidade = 'has-success';
        }

        this.setState({ validacao })
    }

    /**
      * PRODUÇÃO
      */
    validaFaina(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.faina = 'has-danger';
        }
        else {
            validacao.faina = 'has-success';
        }

        this.setState({ validacao })
    }

    validaProduto(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.produto = 'has-danger';
        }
        else {
            validacao.produto = 'has-success';
        }

        this.setState({ validacao })
    }

    validaMovimentacao(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.movimentacao = 'has-danger';
        }
        else {
            validacao.movimentacao = 'has-success';
        }

        this.setState({ validacao })
    }

    validaProducao(event) {
        
        const { validacao } = this.state

        if( event.target.value < 0) {
            validacao.producao = 'has-danger';
        }
        else {
            validacao.producao = 'has-success';
        }

        this.setState({ validacao })
    }

    validaTonelagem(event) {
        
        const { validacao } = this.state

        if( event.target.value < 0) {
            validacao.tonelagem = 'has-danger';
        }
        else {
            validacao.tonelagem = 'has-success';
        }

        this.setState({ validacao })
    }

    validaCliente(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.cliente = 'has-danger';
        }
        else {
            validacao.cliente = 'has-success';
        }

        this.setState({ validacao })
    }

    validaNomeModelo(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.nomeModelo = 'has-danger';
        }
        else {
            validacao.nomeModelo = 'has-success';
        }

        this.setState({ validacao })
    }
 

    /************
     * DADOS DA REQUISIÇÃO
     */
    aoAlterarPorto = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('portoEstilo');
            this.setState({ 
                portoSelecionado: null,
                caisSelecionado: null,
                caisPlaceholder: "Selecione um porto",
                bercoSelecionado: null,
                bercoPlaceholder: "Selecione um porto",
            });
        }
        else {
            this.setSelectValido('portoEstilo');
            this.setState({ 
                portoSelecionado: event,
                caisSelecionado: null,
                caisPlaceholder: "Carregando...",
                bercoSelecionado: null,
            }, () => {
                this.getListaCais();
            }); 
        }
    }

    aoAlterarCais = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('caisEstilo');
            this.setState({ 
                caisSelecionado: null,
                caisPlaceholder: "Selecione um cais",
                bercoSelecionado: null,
                bercoPlaceholder: "Selecione um cais",
            });
        }
        else {
            this.setSelectValido('caisEstilo');
            this.setState({ 
                caisSelecionado: event,
                bercoSelecionado: null,
                bercoPlaceholder: "Carregando...",
            }, () => {
                this.getListaBerco();
            }); 
        }
    }

    aoAlterarBerco = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('bercoEstilo');
            this.setState({ 
                bercoSelecionado: null,
                bercoPlaceholder: "Selecione um berço",
            });
        }
        else {
            this.setSelectValido('bercoEstilo');
            this.setState({ bercoSelecionado: event });
        }
    }

    aoAlterarNavio = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('navioEstilo');
            this.setState({ 
                navioSelecionado: null,
            });
        }
        else {
            this.setSelectValido('navioEstilo');
            this.setState({ navioSelecionado: event });
        }
    }

    aoAlterarTurno = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('turnoEstilo');
            this.setState({ 
                turnoSelecionado: null,
            });
        }
        else {
            this.setSelectValido('turnoEstilo');
            this.setState({ turnoSelecionado: event });
        }
    }


    /*************
     * ATIVIDADES / FUNÇÕES
     */
    aoAlterarAtividade = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('atividadeEstilo');
            this.setState({ 
                atividadeSelecionada: null,
                funcaoSelecionada: null,
                funcaoPlaceholder: "Selecione uma atividade",
            });
        }
        else {
            this.setSelectValido('atividadeEstilo');
            this.setState({ 
                atividadeSelecionada: event,
                funcaoSelecionada: null,
                funcaoPlaceholder: "Carregando...",
            }, () => {
                this.getListaFuncao();
            }); 
        }
    }

    aoAlterarFuncao = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('funcaoEstilo');
            this.setState({ funcaoSelecionada: null });
        }
        else {
            this.setSelectValido('funcaoEstilo');
            this.setState({ funcaoSelecionada: event });
        }
    }


    adicionarAtividade = (terno) => {

        terno = (terno === "") ? 0 : parseInt(terno);

        let existeAtividade = this.state.listaAtividade.findIndex(x => 
            (x.terno === terno)
            && (x.atividade.value === this.state.atividadeSelecionada.value)
            && (x.funcao.value === this.state.funcaoSelecionada.value)
        );

        if(existeAtividade >= 0) {

            const listaInicio = this.state.listaAtividade.slice(0, existeAtividade);
            const listaFim = this.state.listaAtividade.slice(existeAtividade+1);

            let editaAtividade = [];
            editaAtividade.push({
                terno: terno,
                atividade: this.state.atividadeSelecionada,
                funcao: this.state.funcaoSelecionada,
                quantidade: this.state.quantidade,
            });

            let novaLista = [...listaInicio, ...editaAtividade, ...listaFim];

            const { validacao } = this.state;
            validacao.terno = 'has-danger';
            validacao.atividade = 'has-danger';
            validacao.funcao = 'has-danger';
            validacao.quantidade = 'has-danger';

            this.setSelectInvalido('atividadeEstilo');
            this.setSelectInvalido('funcaoEstilo');

            this.setState({
                qtdTerno: '',
                listaAtividade: novaLista,
                terno: '',
                atividadeSelecionada: null,
                funcaoSelecionada: null,
                quantidade: '',
                exibeTerno: true,
                validacao,
            });
        }
        else {
            this.adicionarNovaAtividade(terno);
        }
    }

    adicionarNovaAtividade = (terno) => {

        let novaAtividade = this.state.listaAtividade;

        novaAtividade.push({
            terno: parseInt(terno),
            atividade: this.state.atividadeSelecionada,
            funcao: this.state.funcaoSelecionada,
            quantidade: this.state.quantidade,
        });

        const { validacao } = this.state;
        validacao.terno = 'has-danger';
        validacao.atividade = 'has-danger';
        validacao.funcao = 'has-danger';
        validacao.quantidade = 'has-danger';

        this.setSelectInvalido('atividadeEstilo');
        this.setSelectInvalido('funcaoEstilo');

        this.setState({
            qtdTerno: '',
            listaAtividade: novaAtividade,
            terno: '',
            atividadeSelecionada: null,
            funcaoSelecionada: null,
            quantidade: '',
            exibeTerno: true,
            validacao,
        });
    }

    aoAdicionarAtividade = () => {

        if (
            (this.state.validacao.qtdTerno === 'has-success') &&
            (this.state.validacao.terno === 'has-success') &&
            (this.state.validacao.atividade === 'has-success') &&
            (this.state.validacao.funcao === 'has-success') &&
            (this.state.validacao.quantidade === 'has-success')
        ) {
            if( (this.state.qtdTerno !== "") && (parseInt(this.state.qtdTerno) > 0) ) {
                
                for (let terno = 1; terno <= parseInt(this.state.qtdTerno); terno++) {

                    this.adicionarAtividade(terno);
                }
            }
            else {
                this.adicionarAtividade(this.state.terno);
            }
        }
        else {
            this.erroAdicionarTabela();
        }
    }

    aoEditarAtividade = (event) => {

        const idx = parseInt(event.target.getAttribute('idx'));
        let linhaAtividade = this.state.listaAtividade[idx];

        const { validacao } = this.state;
        validacao.terno = 'has-success';
        validacao.atividade = 'has-success';
        validacao.funcao = 'has-success';
        validacao.quantidade = 'has-success';

        this.setState({ 
            terno: linhaAtividade.terno,
            atividadeSelecionada: linhaAtividade.atividade,
            funcaoSelecionada: linhaAtividade.funcao,
            quantidade: linhaAtividade.quantidade,
            atividadeEstilo: getEstiloValido(),
            funcaoEstilo: getEstiloValido(),
            validacao
        });
    }

    aoRemoverAtividade = (event) => {

        const listaAtividade = [...this.state.listaAtividade];
        listaAtividade.splice(event.currentTarget.id, 1);
        this.setState({ listaAtividade });
    }


    /************
     * PRODUÇÕES
     */
    aoAlterarFaina = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('fainaEstilo');
            this.setState({ fainaSelecionada: null });
        }
        else {
            this.setSelectValido('fainaEstilo');
            this.setState({ fainaSelecionada: event });
        }
    }

    aoAlterarProduto = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('produtoEstilo');
            this.setState({ produtoSelecionado: null });
        }
        else {
            this.setSelectValido('produtoEstilo');
            this.setState({ produtoSelecionado: event });
        }
    }

    aoAlterarMovimentacao = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('movimentacaoEstilo');
            this.setState({ movimentacaoSelecionada: null });
        }
        else {
            this.setSelectValido('movimentacaoEstilo');
            this.setState({ movimentacaoSelecionada: event });
        }
    }

    aoAlterarCliente = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('clienteEstilo');
            this.setState({ clienteSelecionado: null });
        }
        else {
            this.setSelectValido('clienteEstilo');
            this.setState({ clienteSelecionado: event });
        }
    }

    aoAdicionarProducao = () => {

        if (
            (this.state.validacao.faina === 'has-success') &&
            (this.state.validacao.produto === 'has-success') &&
            (this.state.validacao.movimentacao === 'has-success') &&
            (this.state.validacao.producao === 'has-success') &&
            (this.state.validacao.tonelagem === 'has-success') &&
            (this.state.validacao.cliente === 'has-success')
        ) {
            let novaProducao = this.state.listaProducao;

            novaProducao.push({
                faina: this.state.fainaSelecionada,
                produto: this.state.produtoSelecionado,
                movimentacao: this.state.movimentacaoSelecionada,
                producao: this.state.producao,
                tonelagem: this.state.tonelagem,
                cliente: this.state.clienteSelecionado,
            });

            const { validacao } = this.state;
            validacao.faina = 'has-danger';
            validacao.produto = 'has-danger';
            validacao.movimentacao = 'has-danger';
            validacao.producao = 'has-danger';
            validacao.tonelagem = 'has-danger';
            validacao.cliente = 'has-danger';

            this.setSelectInvalido('fainaEstilo');
            this.setSelectInvalido('produtoEstilo');
            this.setSelectInvalido('movimentacaoEstilo');
            this.setSelectInvalido('clienteEstilo');

            this.setState({
                listaProducao: novaProducao,
                fainaSelecionada: null,
                produtoSelecionado: null,
                movimentacaoSelecionada: null,
                producao: '',              
                tonelagem: '',              
                clienteSelecionado: null,

                validacao,
            });
        }
        else {
            this.erroAdicionarTabela();
        }
    }


    aoEditarProducao = (event) => {

        const idx = parseInt(event.target.getAttribute('idx'));
        let linhaProducao = this.state.listaProducao[idx];

        const { validacao } = this.state;
        validacao.faina = 'has-success';
        validacao.produto = 'has-success';
        validacao.movimentacao = 'has-success';
        validacao.producao = 'has-success';
        validacao.tonelagem = 'has-success';
        validacao.cliente = 'has-success';

        this.setState({
            fainaSelecionada: linhaProducao.faina,
            produtoSelecionado: linhaProducao.produto,
            movimentacaoSelecionada: linhaProducao.movimentacao,
            producao: linhaProducao.producao,              
            tonelagem: linhaProducao.tonelagem,              
            clienteSelecionado: linhaProducao.cliente,
            fainaEstilo: getEstiloValido(),
            produtoEstilo: getEstiloValido(),
            movimentacaoEstilo: getEstiloValido(),
            clienteEstilo: getEstiloValido(),
            validacao,
        });
    }

    aoRemoverProducao = (event) => {
        const listaProducao = [...this.state.listaProducao];
        listaProducao.splice(event.currentTarget.id, 1);
        this.setState({ listaProducao });
    }


    /**************
     * BOTÕES DE AÇÃO
     */

    aoSalvar = () => {

        if (
            (this.state.validacao.porto === 'has-success')
            && (this.state.validacao.cais === 'has-success')
            && (this.state.validacao.berco === 'has-success')
            && (this.state.validacao.navio === 'has-success')
            && (this.state.validacao.dataOperacao === 'has-success')
            && (this.state.validacao.turno === 'has-success')
            // && (this.state.validacao.quantidadeTernos === 'has-success')
            && (this.state.listaAtividade.length > 0)
            // && (this.state.listaProducao.length > 0)
        ) {

            const listaAtividadeOrdenada = [].concat(this.state.listaAtividade)
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

            this.setState({
                quantidadeTerno: qtdTerno,
                listaEstivador: listaEstivadorOrdenada,
                listaConferente: listaConferenteOrdenada,
                listaVigia: listaVigiaOrdenada,
                listaArrumador: listaArrumadorOrdenada,
                listaCapatazia: listaCapataziaOrdenada
            }, () => {

                // Confirma dados informados
                this.alternarModelResumo();
            })
        }
        else {
            this.erroForm();
        }
    }

    aoCriarModelo = () => {

        this.setState({ criarModelo: true }, () => {
            this.aoSalvar();
        })
    }

    aoExcluir = () => {

        this.alternarModelExclusao();
        
        // MODELO
        if( this.props.navegacao.tipo === "modelo" ) {

            this.deleteWsModeloRequisicao();
        }
        // REQUISIÇÃO        
        else {
            
            this.deleteWsControleRequisicao();
        }
    }

    aoVoltar = () => {
        const history = createHashHistory();

        history.push(this.props.navegacao.ultimaPagina);        
    }

    aoConfirmarResumo = () => {

        this.alternarModelResumo();

        // MODELO
        if( this.props.navegacao.tipo === "modelo" ) {

            this.alternarModelModelo();
        }        
        // REQUISIÇÃO
        else {                        
            if( this.state.criarModelo ) {
    
                this.alternarModelModelo();
            }
            else {
    
                if( this.ehEdicao() ) {
                    this.patchWsControleRequisicaoDto();
                }
                else {
                    this.postWsPacoteFull();
                }
            }
        }
    }
  
    aoCancelarResumo = () => {
        this.setState({ criarModelo: false }, () => {
            this.alternarModelResumo();
        })        
    }

    aoConfirmarModelo = () => {

        this.alternarModelModelo();
        
        // MODELO
        if( this.props.navegacao.tipo === "modelo" ) {

            if( this.ehEdicao() ) {

                this.patchWsModeloRequisicao();
            }
            else {
                this.postWsModeloRequisicao();
            } 
            
        }
        // REQUISIÇÃO        
        else {
            this.postWsModeloRequisicao();
        }
    }
    
    aoCancelarModelo = () => {
        this.setState({ criarModelo: false }, () => {
            this.alternarModelModelo();
        })        
    }


    /**********
     * MONTAR BLOCO DE INFORMAÇÃO
     */
    
    exibeListaFuncoes(listaFuncoes) {

        let terno = -1;
        let jsx = [];
        let ternoTexto = '';
        let totalHomens = 0;
        let x = 0;

        
        for (let i = 0; i < listaFuncoes.length; i++) {

            totalHomens += parseInt(listaFuncoes[i].quantidade);

            if (listaFuncoes[i].terno > terno) {
                terno = listaFuncoes[i].terno;
            }

            if (listaFuncoes[i].terno === 0) {
                ternoTexto = <span>&nbsp;&nbsp;</span>;
            }
            else {
                ternoTexto = listaFuncoes[i].terno;
            }

            jsx.push(
                <tr key={i}>
                    <td>
                        {ternoTexto}
                    </td>                    
                    <td>
                        {listaFuncoes[i].funcao.nomeAbreviado}
                    </td>
                    <td>
                        {("0" + listaFuncoes[i].quantidade).slice(-2)}
                    </td>
                </tr>
            )

            x = i;
        }

        x++;
        jsx.push(
            <tr key={x} className="table-secondary">
                <th scope="row" colSpan="2">
                    Total
                </th>
                <th scope="row">
                    {("0" + totalHomens).slice(-2)}
                </th>
            </tr>
        )

        return jsx;
    }

    montaProducao() {

        let arrayProducao = [];
        let idFaina = [];
        let idMovimentacao = [];
        let idProdutoEscalacao = [];
        let idCliente = [];

        if( 
            ((this.props.navegacao.tipo === "requisicao") && this.state.criarModelo) ||
            (this.props.navegacao.tipo === "modelo")
        ) {

            for (let i = 0; i < this.state.listaProducao.length; i++) {

                idFaina = this.state.fainaOpcoes.find(x => x.value === this.state.listaProducao[i].faina.value);
                idMovimentacao = this.state.movimentacaoOpcoes.find(x => x.value === this.state.listaProducao[i].movimentacao.value);
                idProdutoEscalacao = this.state.produtoOpcoes.find(x => x.value === this.state.listaProducao[i].produto.value);
                idCliente = this.state.clienteOpcoes.find(x => x.razaoSocial === this.state.listaProducao[i].cliente.razaoSocial);

                arrayProducao.push({
                    idFaina: idFaina,
                    idMovimentacao: idMovimentacao,
                    classificacaoPorao: null,
                    quantidadeProduto: this.state.listaProducao[i].producao,
                    quantidadeTonelagem: this.state.listaProducao[i].tonelagem,
                    cnpjCliente: this.state.listaProducao[i].cliente.cnpj,
                    razaoSocialCliente: this.state.listaProducao[i].cliente.razaoSocial,
                    nomeFantasiaCliente: this.state.listaProducao[i].cliente.label,
                    idProdutoEscalacao: idProdutoEscalacao,
                    idCliente: idCliente
                })
            }
        }
        else {

            for (let i = 0; i < this.state.listaProducao.length; i++) {

                arrayProducao.push({
                    idFaina: {
                        id: this.state.listaProducao[i].faina.value
                    },
                    idMovimentacao: {
                        id: this.state.listaProducao[i].movimentacao.value
                    },
                    classificacaoPorao: null,
                    quantidadeProduto: this.state.listaProducao[i].producao,
                    quantidadeTonelagem: this.state.listaProducao[i].tonelagem,
                    cnpjCliente: this.state.listaProducao[i].cliente.cnpj,
                    razaoSocialCliente: this.state.listaProducao[i].cliente.razaoSocial,
                    nomeFantasiaCliente: this.state.listaProducao[i].cliente.label,
                    idProdutoEscalacao: {
                        id: this.state.listaProducao[i].produto.value
                    }
                })
            }
        }

        return arrayProducao;
    }

    montaAtividade() {
        const listaAtividadeOrdenada = [].concat(this.state.listaAtividade)
            .sort( function(a, b) {
                if( (a.terno < b.terno) || (a.atividade.value < b.atividade.value) ) { return -1; }
                if( (a.terno > b.terno) || (a.atividade.value < b.atividade.value) ) { return 1; }
                return 0;
            })

        let atividadeAtual = null; 
        let ternoAtual = null;
        
        let arrayAtividade = [];
        let arrayFuncao = [];

        if( 
            ((this.props.navegacao.tipo === "requisicao") && this.state.criarModelo) ||
            (this.props.navegacao.tipo === "modelo")
        ) {
        
            for (let i = 0; i < listaAtividadeOrdenada.length; i++) {

                if( (atividadeAtual === listaAtividadeOrdenada[i].atividade) && (ternoAtual === listaAtividadeOrdenada[i].terno)  ) {

                    arrayFuncao.push({
                        idFuncaoEscalacao: null,
                        quantidadeHomem: listaAtividadeOrdenada[i].quantidade,
                        idAssociacaoFuncao: listaAtividadeOrdenada[i].funcao
                    });
                } 
                else {
                    // Caso não seja a primeira vez
                    if( arrayFuncao.length > 0 ) {

                        arrayAtividade.push({               
                            idAtividade: atividadeAtual, 
                            numeroTerno: ternoAtual,
                            wsFuncoes: arrayFuncao
                        });

                        // Limpa as funções
                        arrayFuncao = [];
                    }

                    atividadeAtual = listaAtividadeOrdenada[i].atividade;
                    ternoAtual = listaAtividadeOrdenada[i].terno;
                    
                    arrayFuncao.push({
                        idFuncaoEscalacao: null,
                        quantidadeHomem: listaAtividadeOrdenada[i].quantidade,
                        idAssociacaoFuncao: listaAtividadeOrdenada[i].funcao
                    });
                }
            }

            // Último registro a incluir na atividade
            arrayAtividade.push({               
                idAtividade: atividadeAtual, 
                numeroTerno: ternoAtual,
                wsFuncoes: arrayFuncao
            });

        }
        else {

            for (let i = 0; i < listaAtividadeOrdenada.length; i++) {

                if( (atividadeAtual === listaAtividadeOrdenada[i].atividade.value) && (ternoAtual === listaAtividadeOrdenada[i].terno)  ) {

                    arrayFuncao.push({
                        idFuncaoEscalacao: null,
                        quantidadeHomem: listaAtividadeOrdenada[i].quantidade,
                        idAssociacaoFuncao: {
                            id: listaAtividadeOrdenada[i].funcao.value
                        }
                    });
                } 
                else {
                    // Caso não seja a primeira vez
                    if( arrayFuncao.length > 0 ) {

                        arrayAtividade.push({               
                            idAtividade: {
                                id: atividadeAtual
                            }, 
                            numeroTerno: ternoAtual,
                            wsFuncoes: arrayFuncao
                        });

                        // Limpa as funções
                        arrayFuncao = [];
                    }

                    atividadeAtual = listaAtividadeOrdenada[i].atividade.value;
                    ternoAtual = listaAtividadeOrdenada[i].terno;
                    
                    arrayFuncao.push({
                        idFuncaoEscalacao: null,
                        quantidadeHomem: listaAtividadeOrdenada[i].quantidade,
                        idAssociacaoFuncao: {
                            id: listaAtividadeOrdenada[i].funcao.value
                        }
                    });
                }
            }

            // Último registro a incluir na atividade
            arrayAtividade.push({               
                idAtividade: {
                    id: atividadeAtual
                }, 
                numeroTerno: ternoAtual,
                wsFuncoes: arrayFuncao
            });

        }

        return arrayAtividade;
    }


    /*********************
     * POST, PATCH E DELETE
     */

    postWsPacoteFull = async () => {
        try {

            this.setState({ carregandoExibe: true });

            /**
             * PRODUÇÕES
             */
            let arrayProducao = this.montaProducao();

            /**
             * ATIVIDADE
             */            
            let arrayAtividade = this.montaAtividade();

            /**
             * CONTROLE REQUISIÇÃO
             */
            let arrayControleRequisicao = [];
            arrayControleRequisicao.push({
                idCais: {
                    id: this.state.caisSelecionado.value
                }, 
                idOperadorPortuario: {
                    id: this.props.idOperadorPortuario
                },
                idBerco: {
                    id: this.state.bercoSelecionado.value
                },
                idPorto: {
                    id: this.state.portoSelecionado.value
                },
                idTurno: {
                    id: this.state.turnoSelecionado.value
                },
                numeroRequisicaoOperador: null,
                numeroRequisicaoOgmo: null,
                // status: "R",
                lloyd: this.state.navioSelecionado.lloyd,
                nomeNavio: this.state.navioSelecionado.label,
                quantidadeTerno: this.state.quantidadeTerno,
                numeroProgramacaoNavio: this.state.programacaoNavio,
                // dtEnvio: getDataHoraAtualBr(),
                dtRequisicao: converteDataParaBr(this.state.dataOperacao),
                dtCancelamento: null,
                observacao: this.state.observacao,
                wsAtividades: arrayAtividade,
                wsProducoes: arrayProducao
            });

            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/wsPacoteDto',
                {
                    numeroRemessa: null,
                    wsControleRequisicoes: arrayControleRequisicao
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A requisição foi salva!",
                    sucessoExibe: true 
                });
            }
            else if(response.status === 500) {
                
                const message = response.data.message.split("content:\n");
                let erro = null;

                if(message.length > 0) {
                    erro = message[1];
                }
                else {
                    erro = "Não foi possível salvar a requisição.";
                }

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: erro,
                    erroExibe: true,
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar a requisição.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio da requisição.",
                erroExibe: true,
            });
        }
    }
    
    patchWsControleRequisicaoDto = async () => {

        try {            

            this.setState({ carregandoExibe: true });

            /**
             * PRODUÇÕES
             */
            let arrayProducao = this.montaProducao();

            /**
             * ATIVIDADE
             */            
            let arrayAtividade = this.montaAtividade();

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/wsControleRequisicaoDto',
                {
                    id: this.props.id,
                    idCais: {
                        id: this.state.caisSelecionado.value
                    }, 
                    idOperadorPortuario: {
                        id: this.props.idOperadorPortuario
                    },
                    idBerco: {
                        id: this.state.bercoSelecionado.value
                    },
                    idPorto: {
                        id: this.state.portoSelecionado.value
                    },
                    idTurno: {
                        id: this.state.turnoSelecionado.value
                    },
                    idWsPacote: {
                        id: this.state.idWsPacote
                    },
                    numeroRequisicaoOperador: this.state.numeroRequisicaoOperador,
                    numeroRequisicaoOgmo: this.state.numeroRequisicaoOgmo,
                    // status: "R",
                    lloyd: this.state.navioSelecionado.lloyd,
                    nomeNavio: this.state.navioSelecionado.label,
                    quantidadeTerno: this.state.quantidadeTerno,
                    numeroProgramacaoNavio: this.state.programacaoNavio,
                    // dtEnvio: getDataHoraAtualBr(),
                    dtRequisicao: converteDataParaBr(this.state.dataOperacao),
                    dtCancelamento: null,
                    observacao: this.state.observacao,
                    wsAtividades: arrayAtividade,
                    wsProducoes: arrayProducao
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A requisição foi editada!",
                    sucessoExibe: true 
                });
            }
            else if(response.status === 500) {
                
                const message = response.data.message.split("content:\n");
                let erro = null;

                if(message.length > 0) {
                    erro = message[1];
                }
                else {
                    erro = "Não foi possível editar a requisição.";
                }

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: erro,
                    erroExibe: true,
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar a requisição.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar a alteração da requisição.",
                erroExibe: true,
            });
        }
    }

    deleteWsControleRequisicao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.delete(
                "/wsControleRequisicaoDto/" + this.props.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A requisição foi cancelada!",
                    sucessoExibe: true 
                });
            }
            else if(response.status === 500) {
                
                const message = response.data.message.split("content:\n");
                let erro = null;

                if(message.length > 0) {
                    erro = message[1];
                }
                else {
                    erro = "Não foi possível cancelar a requisição.";
                }

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: erro,
                    erroExibe: true,
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível cancelar a requisição.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar o cancelamento da requisição.",
                erroExibe: true,
            });
        }
    }

    postWsModeloRequisicao = async () => {
        
        try {

            this.setState({ carregandoExibe: true });

           /**
             * PRODUÇÕES
             */
            let arrayProducao = this.montaProducao();

            /**
             * ATIVIDADE
             */            
            let arrayAtividade = this.montaAtividade();

            /**
             * CONTROLE REQUISIÇÃO
             */
            const controleRequisicao = {
                idCais: this.state.caisSelecionado, 
                idOperadorPortuario: {
                    id: this.props.idOperadorPortuario
                },
                idBerco: this.state.bercoSelecionado,
                idPorto: this.state.portoSelecionado,
                idTurno: this.state.turnoSelecionado,
                numeroRequisicaoOperador: null,
                numeroRequisicaoOgmo: null,
                // status: "R",
                lloyd: this.state.navioSelecionado.lloyd,
                nomeNavio: this.state.navioSelecionado.label,
                idNavio: this.state.navioSelecionado,
                quantidadeTerno: this.state.quantidadeTerno,
                numeroProgramacaoNavio: this.state.programacaoNavio,
                // dtEnvio: getDataHoraAtualBr(),
                dtRequisicao: this.state.dataOperacao,
                dtCancelamento: null,
                observacao: this.state.observacao,
                wsAtividades: arrayAtividade,
                wsProducoes: arrayProducao
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/wsModeloRequisicaoDto',
                {
                    idOperadorPortuario: {
                        id: this.props.idOperadorPortuario
                    },
                    descricao: this.state.nomeModelo,
                    json: JSON.stringify(controleRequisicao)
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O modelo foi salvo!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar o modelo.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a criação do modelo.",
                erroExibe: true,
            });
        }
    }
    
    patchWsModeloRequisicao = async () => {
        
        try {

            this.setState({ carregandoExibe: true });

            /**
             * PRODUÇÕES
             */
            let arrayProducao = this.montaProducao();

            /**
             * ATIVIDADE
             */            
            let arrayAtividade = this.montaAtividade();

            /**
             * CONTROLE REQUISIÇÃO
             */
            const controleRequisicao = {
                idCais: this.state.caisSelecionado, 
                idOperadorPortuario: {
                    id: this.props.idOperadorPortuario
                },
                idBerco: this.state.bercoSelecionado,
                idPorto: this.state.portoSelecionado,
                idTurno: this.state.turnoSelecionado,
                numeroRequisicaoOperador: null,
                numeroRequisicaoOgmo: null,
                // status: "R",
                lloyd: this.state.navioSelecionado.lloyd,
                nomeNavio: this.state.navioSelecionado.label,
                idNavio: this.state.navioSelecionado,
                quantidadeTerno: this.state.quantidadeTerno,
                numeroProgramacaoNavio: this.state.programacaoNavio,
                // dtEnvio: getDataHoraAtualBr(),
                dtRequisicao: this.state.dataOperacao,
                dtCancelamento: null,
                observacao: this.state.observacao,
                wsAtividades: arrayAtividade,
                wsProducoes: arrayProducao
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/wsModeloRequisicaoDto',
                {
                    id: this.props.id,
                    idOperadorPortuario: {
                        id: this.props.idOperadorPortuario
                    },
                    descricao: this.state.nomeModelo,
                    json: JSON.stringify(controleRequisicao)
                },
            );
                
            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O modelo foi editado!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar o modelo.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a edição do modelo.",
                erroExibe: true,
            });
        }
    }

    deleteWsModeloRequisicao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.delete(
                "/wsModeloRequisicao/" + this.props.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O modelo foi excluído!",
                    sucessoExibe: true 
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível excluir o modelo.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a exclusão do modelo.",
                erroExibe: true,
            });
        }
    }

    /************
     * RENDER
     */
    render() {
        
        return (

            <div className="animated fadeIn">

                <Row>

                    <Col xs="12" md="12">

                        <Card>

                            <CardHeader>
                                <i className={this.ehEdicao() ? "fa fa-pencil" : "fa fa-file"}></i> {this.props.titulo}
                            </CardHeader>

                            <CardBody>
                                <Form >
                                    <div id="accordion">
 
                                        <Card>
                                        
                                            <CardHeader id="headingOne">
                                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]} aria-controls="collapseOne">
                                                    <h5 className="m-0 p-0">
                                                        <i className="fa fa-file-text"></i> Dados da Requisição
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                                <CardBody>
                                                
                                                    <Row>
                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="porto">Porto</Label>
                                                                <Select
                                                                    id="porto"
                                                                    name="porto"
                                                                    value={this.state.portoSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaPorto(event)
                                                                        this.aoAlterarPorto(event)
                                                                    }}
                                                                    options={this.state.portoOpcoes}
                                                                    required
                                                                    autoFocus
                                                                    isClearable
                                                                    isLoading={this.state.portoCarregando}
                                                                    placeholder={this.state.portoPlaceholder}
                                                                    styles={this.state.portoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.porto === 'has-success' } 
                                                                    invalid={ this.state.validacao.porto === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="cais">Cais</Label>
                                                                <Select
                                                                    id="cais"
                                                                    name="cais"
                                                                    value={this.state.caisSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaCais(event)
                                                                        this.aoAlterarCais(event)
                                                                    }}
                                                                    options={this.state.caisOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.caisCarregando}
                                                                    placeholder={this.state.caisPlaceholder}
                                                                    styles={this.state.caisEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.cais === 'has-success' } 
                                                                    invalid={ this.state.validacao.cais === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="berco">Berço</Label>
                                                                <Select
                                                                    id="berco"
                                                                    name="berco"
                                                                    value={this.state.bercoSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaBerco(event)
                                                                        this.aoAlterarBerco(event)
                                                                    }}
                                                                    options={this.state.bercoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.bercoCarregando}
                                                                    placeholder={this.state.bercoPlaceholder}
                                                                    styles={this.state.bercoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.berco === 'has-success' } 
                                                                    invalid={ this.state.validacao.berco === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="navio">Navio</Label>
                                                                <Select
                                                                    id="navio"
                                                                    name="navio"
                                                                    value={this.state.navioSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaNavio(event)
                                                                        this.aoAlterarNavio(event)
                                                                    }}
                                                                    options={this.state.navioOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.navioCarregando}
                                                                    placeholder={this.state.navioPlaceholder}
                                                                    styles={this.state.navioEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.navio === 'has-success' } 
                                                                    invalid={ this.state.validacao.navio === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="dataOperacao">Data de Operação</Label>
                                                                <Input 
                                                                    type="date" 
                                                                    min={this.state.dtParede}
                                                                    id="dataOperacao" 
                                                                    name="dataOperacao" 
                                                                    required 
                                                                    value={this.state.dataOperacao}
                                                                    onChange={(event) => { 
                                                                        this.validaDataOperacao(event)
                                                                        this.aoAlterar(event)
                                                                    }}
                                                                    valid={ this.state.validacao.dataOperacao === 'has-success' } 
                                                                    invalid={ this.state.validacao.dataOperacao === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="turno">Turno</Label>
                                                                <Select
                                                                    id="turno"
                                                                    name="turno"
                                                                    value={this.state.turnoSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaTurno(event)
                                                                        this.aoAlterarTurno(event)
                                                                    }}
                                                                    options={this.state.turnoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.turnoCarregando}
                                                                    placeholder={this.state.turnoPlaceholder}
                                                                    styles={this.state.turnoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.turno === 'has-success' } 
                                                                    invalid={ this.state.validacao.turno === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        {/* <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="quantidadeTerno">Qtd Terno</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0"
                                                                    id="quantidadeTerno" 
                                                                    name="quantidadeTerno"
                                                                    required 
                                                                    value={this.state.quantidadeTerno}
                                                                    onChange={(event) => { 
                                                                        this.validaQuantidadeTerno(event)
                                                                        this.aoAlterar(event)
                                                                    }}
                                                                    valid={ this.state.validacao.quantidadeTerno === 'has-success' } 
                                                                    invalid={ this.state.validacao.quantidadeTerno === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col> */}

                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="programacaoNavio">Programação do Navio</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0"
                                                                    id="programacaoNavio" 
                                                                    name="programacaoNavio"
                                                                    required 
                                                                    value={this.state.programacaoNavio}
                                                                    onChange={this.aoAlterar}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12">
                                                            <FormGroup>
                                                                <Label htmlFor="observacao">Observação</Label>
                                                                <Input 
                                                                    type="textarea" 
                                                                    id="observacao" 
                                                                    name="observacao" 
                                                                    rows="4" 
                                                                    value={this.state.observacao}
                                                                    onChange={this.aoAlterar}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                </CardBody>
                                            </Collapse>
                                        </Card>

                                        <Card>
                                            <CardHeader id="headingTwo">
                                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseTwo">
                                                    <h5 className="m-0 p-0">
                                                        <i className="fa fa-users"></i> Atividades e Funções
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseTwo">
                                                <CardBody>
                                                    <Row>
                                                        <Col xs="12" md="4">
                                                        </Col>
                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="qtdTerno">Quantidade de Terno</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0"
                                                                    id="qtdTerno" 
                                                                    name="qtdTerno"
                                                                    required 
                                                                    value={this.state.qtdTerno}
                                                                    onChange={(event) => { 
                                                                        this.aoAlterar(event)
                                                                        this.aoMudarQtdTerno(event)
                                                                    }}
                                                                    valid={ this.state.validacao.qtdTerno === 'has-success' } 
                                                                    invalid={ this.state.validacao.qtdTerno === 'has-danger' } 
                                                                />
                                                                <FormFeedback>O valor deve ser positivo</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="12" md="4">
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xs="12" md="2">
                                                            {this.state.exibeTerno &&
                                                                <FormGroup>
                                                                    <Label htmlFor="terno">Terno</Label>
                                                                    <Input 
                                                                        type="number" 
                                                                        min="0"
                                                                        id="terno" 
                                                                        name="terno"
                                                                        required 
                                                                        value={this.state.terno}
                                                                        onChange={(event) => { 
                                                                            this.validaTerno(event)
                                                                            this.aoAlterar(event)
                                                                        }}
                                                                        valid={ this.state.validacao.terno === 'has-success' } 
                                                                        invalid={ this.state.validacao.terno === 'has-danger' } 
                                                                    />
                                                                    <FormFeedback>Campo obrigatório</FormFeedback>
                                                                </FormGroup>
                                                            }
                                                        </Col>

                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="atividade">Atividade</Label>
                                                                <Select
                                                                    id="atividade"
                                                                    name="atividade"
                                                                    value={this.state.atividadeSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaAtividade(event)
                                                                        this.aoAlterarAtividade(event)
                                                                    }}
                                                                    options={this.state.atividadeOpcoes}
                                                                    required
                                                                    autoFocus
                                                                    isClearable
                                                                    isLoading={this.state.atividadeCarregando}
                                                                    placeholder={this.state.atividadePlaceholder}
                                                                    styles={this.state.atividadeEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.atividade === 'has-success' } 
                                                                    invalid={ this.state.validacao.atividade === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="funcao">Função</Label>
                                                                <Select
                                                                    id="funcao"
                                                                    name="funcao"
                                                                    value={this.state.funcaoSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaFuncao(event)
                                                                        this.aoAlterarFuncao(event)
                                                                    }}
                                                                    options={this.state.funcaoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.funcaoCarregando}
                                                                    placeholder={this.state.funcaoPlaceholder}
                                                                    styles={this.state.funcaoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.funcao === 'has-success' } 
                                                                    invalid={ this.state.validacao.funcao === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="2">
                                                            <FormGroup>
                                                                <Label htmlFor="quantidade">Quantidade</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="1"
                                                                    id="quantidade" 
                                                                    name="quantidade" 
                                                                    required 
                                                                    value={this.state.quantidade}
                                                                    onChange={(event) => { 
                                                                        this.validaQuantidade(event)
                                                                        this.aoAlterar(event)
                                                                    }}
                                                                    valid={ this.state.validacao.quantidade === 'has-success' } 
                                                                    invalid={ this.state.validacao.quantidade === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">
                                                            <Button 
                                                                type="button" 
                                                                color="primary" 
                                                                size="sm"
                                                                onClick={this.aoAdicionarAtividade}
                                                            >
                                                                <i className="fa fa-plus-square"></i> Adicionar
                                                            </Button>
                                                        </Col>
                                                    </Row>

                                                    <hr/>

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">

                                                            <Table responsive striped hover size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Terno</th>
                                                                        <th>Atividade</th>
                                                                        <th>Função</th>
                                                                        <th>Quantidade</th>
                                                                        <th>Editar</th>
                                                                        <th>Excluir</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.listaAtividade.map((linha, idx) => (
                                                                    <tr key={idx}>
                                                                        <td>{linha.terno}</td>
                                                                        <td>{linha.atividade.label}</td>
                                                                        <td>{linha.funcao.label}</td>
                                                                        <td>{linha.quantidade}</td>
                                                                        <td>
                                                                            <i 
                                                                                className="fa fa-pencil fa-lg btn-acao" 
                                                                                id={linha.value} 
                                                                                idx={idx}
                                                                                onClick={this.aoEditarAtividade}
                                                                            ></i>
                                                                        </td>
                                                                        <td>
                                                                            <i 
                                                                                className="fa fa-trash fa-lg btn-acao" 
                                                                                id={idx} 
                                                                                onClick={this.aoRemoverAtividade}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Collapse>
                                        </Card>
 
                                        <Card>
                                            <CardHeader id="headingThree">
                                                <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)} aria-expanded={this.state.accordion[2]} aria-controls="collapseThree">
                                                    <h5 className="m-0 p-0">
                                                        <i className="fa fa-ship"></i> Produções
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseThree">
                                                <CardBody>

                                                    <Row>
                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="movimentacao">Movimentação</Label>
                                                                <Select
                                                                    id="movimentacao"
                                                                    name="movimentacao"
                                                                    value={this.state.movimentacaoSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaMovimentacao(event)
                                                                        this.aoAlterarMovimentacao(event)
                                                                    }}
                                                                    options={this.state.movimentacaoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.movimentacaoCarregando}
                                                                    placeholder={this.state.movimentacaoPlaceholder}
                                                                    styles={this.state.movimentacaoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.movimentacao === 'has-success' } 
                                                                    invalid={ this.state.validacao.movimentacao === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="producao">Quantidade</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0"
                                                                    id="producao" 
                                                                    name="producao"
                                                                    required 
                                                                    value={this.state.producao}
                                                                    onChange={(event) => { 
                                                                        this.validaProducao(event)
                                                                        this.aoAlterar(event)
                                                                    }}
                                                                    valid={ this.state.validacao.producao === 'has-success' } 
                                                                    invalid={ this.state.validacao.producao === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="tonelagem">Tonelagem</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0"
                                                                    id="tonelagem" 
                                                                    name="tonelagem"
                                                                    required 
                                                                    value={this.state.tonelagem}
                                                                    onChange={(event) => { 
                                                                        this.validaTonelagem(event)
                                                                        this.aoAlterar(event)
                                                                    }}
                                                                    valid={ this.state.validacao.tonelagem === 'has-success' } 
                                                                    invalid={ this.state.validacao.tonelagem === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="6">
                                                            <FormGroup>
                                                                <Label htmlFor="produto">Produto</Label>
                                                                <Select
                                                                    id="produto"
                                                                    name="produto"
                                                                    value={this.state.produtoSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaProduto(event)
                                                                        this.aoAlterarProduto(event)
                                                                    }}
                                                                    options={this.state.produtoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.produtoCarregando}
                                                                    placeholder={this.state.produtoPlaceholder}
                                                                    styles={this.state.produtoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.produto === 'has-success' } 
                                                                    invalid={ this.state.validacao.produto === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="12" md="6">
                                                            <FormGroup>
                                                                <Label htmlFor="faina">Faina</Label>
                                                                <Select
                                                                    id="faina"
                                                                    name="faina"
                                                                    value={this.state.fainaSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaFaina(event)
                                                                        this.aoAlterarFaina(event)
                                                                    }}
                                                                    options={this.state.fainaOpcoes}
                                                                    required
                                                                    autoFocus
                                                                    isClearable
                                                                    isLoading={this.state.fainaCarregando}
                                                                    placeholder={this.state.fainaPlaceholder}
                                                                    styles={this.state.fainaEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.faina === 'has-success' } 
                                                                    invalid={ this.state.validacao.faina === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="12">
                                                            <FormGroup>
                                                                <Label htmlFor="cliente">Cliente</Label>
                                                                <Select
                                                                    id="cliente"
                                                                    name="cliente"
                                                                    value={this.state.clienteSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaCliente(event)
                                                                        this.aoAlterarCliente(event)
                                                                    }}
                                                                    options={this.state.clienteOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.clienteCarregando}
                                                                    placeholder={this.state.clientePlaceholder}
                                                                    styles={this.state.clienteEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.cliente === 'has-success' } 
                                                                    invalid={ this.state.validacao.cliente === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">
                                                            <Button 
                                                                type="button" 
                                                                color="primary" 
                                                                size="sm"
                                                                onClick={this.aoAdicionarProducao}
                                                            >
                                                                <i className="fa fa-plus-square"></i> Adicionar
                                                            </Button>
                                                        </Col>
                                                    </Row>

                                                    <hr/>

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">

                                                            <Table responsive striped hover size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Movimentação</th>
                                                                        <th>Produção</th>
                                                                        <th>Tonelagem</th>
                                                                        <th>Produto</th>
                                                                        <th>Faina</th>
                                                                        <th>Cliente</th>
                                                                        <th>Editar</th>
                                                                        <th>Excluir</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                {this.state.listaProducao.map((linha, idx) => (
                                                                    <tr key={idx}>                                                                        
                                                                        <td>{linha.movimentacao.label}</td>
                                                                        <td>{linha.producao}</td>
                                                                        <td>{linha.tonelagem}</td>
                                                                        <td>{linha.produto.label}</td>
                                                                        <td>{linha.faina.label}</td>
                                                                        <td>{linha.cliente.label}</td>
                                                                        <td>
                                                                            <i 
                                                                                className="fa fa-pencil fa-lg btn-acao" 
                                                                                id={linha.value} 
                                                                                idx={idx}
                                                                                onClick={this.aoEditarProducao}
                                                                            ></i>
                                                                        </td>
                                                                        <td>
                                                                            <i 
                                                                                className="fa fa-trash fa-lg btn-acao" 
                                                                                id={idx} 
                                                                                onClick={this.aoRemoverProducao}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table>
                                                        </Col>
                                                    </Row>

                                                </CardBody>
                                            </Collapse>
                                        </Card>
 
                                    </div>
                                </Form>                            
                                
                            </CardBody>

                            <CardFooter>
                                <Row>
                                    <Col xs="12" md={
                                        (
                                            ((this.props.navegacao.tipo === "requisicao") && this.ehEdicao()) ? 
                                            "3" : 
                                            (
                                                (this.props.navegacao.tipo === "requisicao") ? 
                                                "4" : 
                                                (
                                                    this.ehEdicao() ? "4" : "6"
                                                )
                                            )
                                        )}
                                        className="botao-centro"
                                    >
                                        <Button 
                                            type="button" 
                                            color="primary" 
                                            onClick={this.aoSalvar}
                                        >
                                            <i className="fa fa-floppy-o"></i> Salvar
                                        </Button>
                                    </Col>
                                    
                                    {(this.props.navegacao.tipo === "requisicao") &&
                                    <Col xs="12" md={this.ehEdicao() ? "3" : "4"} className="botao-centro">
                                        <Button 
                                            type="button" 
                                            color="primary" 
                                            onClick={this.aoCriarModelo}
                                        >
                                            <i className="fa fa-heart"></i> Criar Modelo
                                        </Button>
                                    </Col>
                                    }

                                    {(this.ehEdicao()) &&
                                    <Col xs="12" md={(this.props.navegacao.tipo === "requisicao") ? "3" : "4"} className="botao-centro">
                                        <Button type="button" color="primary" onClick={this.alternarModelExclusao}><i className="fa fa-trash"></i> Excluir</Button>
                                    </Col>
                                    }

                                    <Col xs="12" md={
                                        (
                                            ((this.props.navegacao.tipo === "requisicao") && this.ehEdicao()) ? 
                                            "3" : 
                                            (
                                                (this.props.navegacao.tipo === "requisicao") ? 
                                                "4" : 
                                                (
                                                    this.ehEdicao() ? "4" : "6"
                                                )
                                            )
                                        )} 
                                        className="botao-centro"
                                    >
                                        <Button type="button" color="primary" onClick={this.aoVoltar}><i className="fa fa-undo"></i> Voltar</Button>
                                    </Col>
                                </Row>
                            </CardFooter>

                        </Card>

                    </Col>
                    
                </Row>

                <RequisicaoResumo 
                    exibeModelResumo={this.state.exibeModelResumo} 
                    alternarModelResumo={this.alternarModelResumo}
                    className={this.props.className}

                    nomeOperadorPortuario={this.props.nomeOperadorPortuario}
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
                    aoConfirmarResumo={this.aoConfirmarResumo}
                    aoCancelarResumo={this.aoCancelarResumo}
                />

                <Modal 
                    isOpen={this.state.exibeModelModelo} 
                    toggle={this.alternarModelModelo}
                    className={'modal-primary ' + this.props.className}
                >
                    <ModalHeader toggle={this.alternarModelModelo}>{((this.props.navegacao.tipo === "requisicao") ? "Salvar como" : (this.ehEdicao() ? "Editar" : "Novo"))} Modelo</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label htmlFor="nomeModelo">Nome</Label>
                            <Input  
                                type="text" 
                                name="nomeModelo" 
                                placeholder="Nome do Modelo"                                 
                                value={this.state.nomeModelo}                                 
                                valid={ this.state.validacao.nomeModelo === 'has-success' } 
                                invalid={ this.state.validacao.nomeModelo === 'has-danger' } 
                                onChange={ (event) => { 
                                    this.validaNomeModelo(event) 
                                    this.aoAlterar(event) 
                                }}
                            />
                        <FormFeedback>Campo obrigatório</FormFeedback>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.aoConfirmarModelo}>Salvar</Button>{' '}
                        <Button color="secondary" onClick={this.aoCancelarModelo}>Cancelar</Button>
                    </ModalFooter>
                </Modal>              

                <Modal 
                    isOpen={this.state.exibeModelExclusao} 
                    toggle={this.alternarModelExclusao}
                    className={'modal-primary ' + this.props.className}
                >
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir {(this.props.navegacao.tipo === "requisicao") ? "Requisição" : "Modelo"}</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir {(this.props.navegacao.tipo === "requisicao") ? "a requisição" : "o modelo"}?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.aoExcluir}>Excluir</Button>{' '}
                        <Button color="secondary" onClick={this.alternarModelExclusao}>Cancelar</Button>
                    </ModalFooter>
                </Modal>

                <Sucesso 
                    aoConfirmar={() =>
                        this.setState({sucessoExibe: false}, () => {
                            this.aoVoltar()    
                        })
                    }
                    exibe={this.state.sucessoExibe}
                    mensagem={this.state.sucessoMensagem}
                />

                <Erro 
                    aoConfirmar={() => this.setState({erroExibe: false})}
                    exibe={this.state.erroExibe}
                    mensagem={this.state.erroMensagem}
                />

                <Carregando
                    exibe={this.state.carregandoExibe}
                />
            </div>

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, navegacaoActions), dispatch)

const mapStateToProps = state => ({
    navegacao: state.navegacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(RequisicaoForm));
