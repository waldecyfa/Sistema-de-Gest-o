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
import { AppSwitch } from '@coreui/react'
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import MaskedInput from 'react-text-mask';
import { 
    converteDataParaBr,
    getDataAtual,
    converteDataHoraParaSomenteDataBd,
} from '../../Util';
import { isNull } from 'util';
import {
    getApiAutenticado
} from '../../Oauth';
import { 
    getEstiloInvalido,
    getEstiloValido,
    getEstiloInvalidoEsocial,
    getEstiloValidoEsocial,
    getEstiloNormal
} from '../../Select';
import Carregando from '../../Alerta/Carregando';
import Sucesso from '../../Alerta/Sucesso';
import Erro from '../../Alerta/Erro';
import { createHashHistory } from 'history'


class ProcessoForm extends Component {
  
    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);
    
        this.alternarModelModelo = this.alternarModelModelo.bind(this);
        this.erroForm = this.erroForm.bind(this);
        this.handlePortoSelectChange = this.handlePortoSelectChange.bind(this);
        this.alternarModelResumo = this.alternarModelResumo.bind(this);
        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.alternarModelExclusao = this.alternarModelExclusao.bind(this);

        this.state = {     
            accordion: [true, false, false, false],    
            exibeModelExclusao: false,       
            exibeModelModelo: false,
            exibeModelResumo: false,
            criarModelo: false,
            dataAtual: '',
            nomeModelo: '',

            /**
             * MASK INPUT COMPONENTE
             */
            maskInput: {
                numeroProcessoClasse: 'form-control is-invalid',
                numeroProcessoMascara: [/[0-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '.',  /\d/, /\d/, /\d/, /\d/, '.', /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/],
                numeroProcessoFeedback: 'Campo obrigatório',
            }, 
            

            /**
             * eSOCIAL
             */            
            estiloEsocial: null,
            isDisabledEsocial: true,

            /**
             * DADOS DO PROCESSO -- PRJUR
             */
            eSocialFlag: false,
            id: 0,
            idVara: null,
            numeroProcesso: null,
            numeroProcessoAntigo: null,
            dataDistribuicao: '',
            dataRecepcao: '',
            valorCausa: null,
            valorAtual: null,

            grauRiscoSelecionado: null,
            grauRiscoOpcoes: [
                {
                    value: '0',
                    label: 'ALTO'
                }, {
                    value: '1',
                    label: 'MÉDIO'
                }, {
                    value: '2',
                    label: 'BAIXO'
                },                
            ],
            grauRiscoPlaceholder: "Selecione o Grau de Risco",
            grauRiscoEstilo: "",

            tipoCausaSelecionado: null,
            tipoCausaOpcoes: [
                {
                    value: '0',
                    label: 'ADMINISTRATIVO'
                }, {
                    value: '1',
                    label: 'JUDICIAL'
                },
            ],
            tipoCausaPlaceholder: "Selecione o Tipo de Causa",
            tipoCausaEstilo: "",

            categoriaSelecionado: null,
            categoriaOpcoes: [
                {
                    value: '0',
                    label: 'CÍVEL'
                }, {
                    value: '1',
                    label: 'TRABALHISTA'
                }, {
                    value: '2',
                    label: 'TRIBUTÁRIA'
                },
            ],
            categoriaPlaceholder: "Selecione a Categoria",
            categoriaEstilo: "",

            instanciaSelecionado: null,
            instanciaOpcoes: [
                {
                    value: '0',
                    label: 'ESTADUAL'
                }, {
                    value: '1',
                    label: 'FEDERAL'
                },
            ],
            instanciaPlaceholder: "Selecione a Instância",
            instanciaEstilo: "",

            varaSelecionada: null,
            varaOpcoes: [],
            varaCarregando: false,
            varaPlaceholder: "Selecione a Vara",
            varaEstilo: "",

            autoriaSelecionada: null,
            autoriaOpcoes: [
                {
                    value: '1',
                    label: '1 - PRÓPRIO CONTRIBUINTE'
                }, {
                    value: '2',
                    label: '2 - OUTRA ENTIDADE, EMPRESA OU EMPREGADO'
                },
            ],
            autoriaPlaceholder: "Selecione a Autoria",
            autoriaEstilo: "",

            tipoProcessoSelecionado: null,
            tipoProcessoOpcoes: [],
            tipoProcessoCarregando: false,
            tipoProcessoPlaceholder: "Selecione o Tipo",
            tipoProcessoEstilo: "",

            indicativoMateriaSelecionado: null,
            indicativoMateriaOpcoes: [],
            indicativoMateriaCarregando: false,
            indicativoMateriaPlaceholder: "Selecione o Indicativo de Matéria",
            indicativoMateriaEstilo: "",

            /**
             * DADOS DO RÉU - REIDO
             */
            reuID: '',
            reuFlag: '',
            reuDataInicio: '',
            reuLista: [],
            reuPesquisa: '',
            
            reuSelecionado: null,
            reuOpcoes: [],
            reuCarregando: false,
            reuPlaceholder: "Selecione o Réu",
            reuEstilo: "",

            /**
             * DADOS DO AUTOR - RENTE
             */
            autorID: '',
            autorFlag: '',
            autorDataInicio: '',
            autorLista: [],
            autorPesquisa: '',
            
            autorSelecionado: null,
            autorOpcoes: [],
            autorCarregando: false,
            autorPlaceholder: "Selecione o Autor",
            autorEstilo: "",

            /**
             * DADOS DA DECIÇÃO
             */
            decisaoID: '',
            decisaoFlag: '',
            decisaoDataRecepcao: '',
            decisaoDescricao: null,
            decisaoLista: [],
            
            decisaoSelecionada: null,
            decisaoOpcoes: [],
            decisaoCarregando: false,
            decisaoPlaceholder: "Selecione o Indicativo de Decisão",
            decisaoEstilo: "",

            /**
             * VALIDAÇÃO
             */
            validacao: {
                // PROCESSO JURÍDICO
                    //numeroProcesso: 'has-danger',
                tipoProcessoSelect: '',
                grauRiscoSelect: 'has-danger',
                varaSelect: 'has-danger',
                autoriaSelect: '',
                indicativoMateriaSelect: '',

                // DECISAO
                decisaoSelect: 'has-danger',
                decisaoDataRecepcao: 'has-danger',
                
                
                // REQUISIÇÃO
                porto: 'has-danger',
                cais: 'has-danger',
                berco: 'has-danger',
                navio: 'has-danger',
                dataOperacao: 'has-danger',
                turno: 'has-danger',
                // quantidadeTernos: 'has-danger',
                // ATIVIDADE
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
            //id: 0, 
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
        };
    }
       
    /***********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {

        //this.setSelectInvalidoEsocial('tipoProcessoEstilo');
        this.setSelectInvalido('grauRiscoEstilo');
        //this.setSelectInvalido('autoriaEstilo');
        //this.setSelectInvalidoEsocial('indicativoMateriaEstilo');
        this.setSelectInvalido('varaEstilo');
        this.setSelectInvalido('reuEstilo');
        this.setSelectInvalido('autorEstilo');
        this.setSelectInvalido('decisaoEstilo');
        
        // this.setSelectInvalido('portoEstilo');
        // this.setSelectInvalido('caisEstilo');
        // this.setSelectInvalido('bercoEstilo');
        // this.setSelectInvalido('navioEstilo');
        // this.setSelectInvalido('turnoEstilo');
        // this.setSelectInvalido('atividadeEstilo');
        // this.setSelectInvalido('funcaoEstilo');
        // this.setSelectInvalido('fainaEstilo');
        // this.setSelectInvalido('produtoEstilo');
        // this.setSelectInvalido('movimentacaoEstilo');
        // this.setSelectInvalido('clienteEstilo');

        this.setState({ 
        //     dataAtual: getDataAtual(),
            carregandoExibe: true

         }, () => {

            this.getListaVaras();            
            this.getListaTipoProcesso();
            this.getListaIndicativoMateria();
            this.getListaDecisoes();

        //     this.getListaPorto();
        //     this.getListaNavio();
        //     this.getListaTurno();

        //     this.getListaAtividade();

        //     this.getListaFaina();
        //     this.getListaProduto();
        //     this.getListaMovimentacao();
        //     this.getListaCliente();
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

    handleChange = (event) => {

        this.setState({ [event.target.name]: event.target.value} );
    }
    
    // defineCarregando(porto, navio, turno, atividade, faina, produto, movimentacao, cliente) {
    //     return {
    //         vara: vara,
    //         tipoProcesso: tipoProcesso

    //         porto: porto, 
    //         navio: navio, 
    //         turno: turno, 
    //         atividade: atividade, 
    //         faina: faina, 
    //         produto: produto, 
    //         movimentacao: movimentacao, 
    //         cliente: cliente
    //     };

    // }

    verificaCarregando() {

        const listaCarregando = [ 
            this.state.varaCarregando,
            this.state.tipoProcessoCarregando,
            this.state.indicativoMateriaCarregando,
            this.state.decisaoCarregando
        ]
        // this.defineCarregando(
        //     this.state.portoCarregando, 
        //     this.state.navioCarregando,
        //     this.state.turnoCarregando,
        //     this.state.atividadeCarregando,
        //     this.state.fainaCarregando,
        //     this.state.produtoCarregando,
        //     this.state.movimentacaoCarregando,
        //     this.state.clienteCarregando,
        // );

        const existeCarregando = Object.keys(listaCarregando).some(x => listaCarregando[x]);

        if(!existeCarregando) {

            // // REQUISICAO
            // if( this.props.tipo === "requisicao") {
                    
            //     if(this.ehEdicao()) {

            //         this.getWsControleRequisicao();
            //     }
            //     else {

            //         if( this.props.idRequisicaoModelo > 0 ) {

            //             this.getWsModeloRequisicao();
            //         }
            //         else {
            //             this.setState({ carregandoExibe: false });
            //         }
            //     }                
            // }
            // // PROCESSO JURÍDICO
            // else {

                if(this.ehEdicao()) {
                    // this.getWsModeloRequisicao();
                }
                else {
                    this.setState({ carregandoExibe: false });
                }
            // }
        }        
    }

    /************
     * GET LISTA VARAS
     */
    getListaVaras = async () => {
        try {

            this.setState({ 
                varaCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/vara',
                {},
                {
                    params: {
                        'projection': 'lista'
                    }
                }
            );
               
            if(response.ok && (response.data._embedded.vara.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.vara.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.vara[i].dsCodigo + ' - ' + response.data._embedded.vara[i].dsVara, 
                            id: response.data._embedded.vara[i].id,
                            value: response.data._embedded.vara[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    varaOpcoes: [...opcoes],
                    varaCarregando: false,
                }, () => {
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    varaCarregando: false,
                    varaPlaceholder: "Erro ao carregar..."
                }, () => {
                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                varaCarregando: false,
                varaPlaceholder: "Erro ao carregar..."
            }, () => {
                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA TIPO PROCESSO JURÍDICO
     */
    getListaTipoProcesso = async () => {
        try {

            this.setState({ 
                tipoProcessoCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/tipoProcessoJuridico/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'lista'
                    }
                }
            );
               
            if(response.ok && (response.data._embedded.tipoProcessoJuridico.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.tipoProcessoJuridico.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.tipoProcessoJuridico[i].noEsocial + ' - '
                                + response.data._embedded.tipoProcessoJuridico[i].dsTipoProcessoJuridico, 
                            id: response.data._embedded.tipoProcessoJuridico[i].id,
                            value: response.data._embedded.tipoProcessoJuridico[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    tipoProcessoOpcoes: [...opcoes],
                    tipoProcessoCarregando: false,
                }, () => {
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    tipoProcessoOpcoes: false,
                    tipoProcessoPlaceholder: "Erro ao carregar..."
                }, () => {
                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                varaCarregando: false,
                tipoProcessoPlaceholder: "Erro ao carregar..."
            }, () => {
                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA INDICATIVO DE MATÉRIA DO PROCESSO
     */
    getListaIndicativoMateria = async () => {
        try {

            this.setState({ 
                indicativoMateriaCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/materiaProcesso/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'lista'
                    }
                }
            );
               
            if(response.ok && (response.data._embedded.materiaProcesso.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.materiaProcesso.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.materiaProcesso[i].noEsocial + ' - '
                                + response.data._embedded.materiaProcesso[i].dsMateriaProcesso, 
                            id: response.data._embedded.materiaProcesso[i].id,
                            value: response.data._embedded.materiaProcesso[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    indicativoMateriaOpcoes: [...opcoes],
                    indicativoMateriaCarregando: false,
                }, () => {
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    indicativoMateriaOpcoes: false,
                    indicativoMateriaPlaceholder: "Erro ao carregar..."
                }, () => {
                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                indicativoMateriaOpcoes: false,
                indicativoMateriaPlaceholder: "Erro ao carregar..."
            }, () => {
                this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA DE RÉUS
     */
    getListaReu = async (pesquisa) => {
        try {

            this.setState({ 
                reuCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/reu/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'list',
                         'search': pesquisa
                    }
                }
            );

            if(response.ok && (response.data._embedded.reu.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.reu.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.reu[i].idPessoa.nmPessoa, 
                            id: response.data._embedded.reu[i].id,
                            value: response.data._embedded.reu[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    reuOpcoes: [...opcoes],
                    reuCarregando: false,
                }, () => {
                    // this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    reuCarregando: false,
                    reuPlaceholder: "Erro ao carregar...",
                    reuOpcoes: [],
                }, () => {
                    // this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                reuCarregando: false,
                reuPlaceholder: "Erro ao carregar...",
                reuOpcoes: [],
            }, () => {
                // this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA DE AUTORES
     */
    getListaAutor = async (pesquisa) => {
        try {

            this.setState({ 
                autorCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/autor/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'list',
                         'search': pesquisa
                    }
                }
            );

            if(response.ok && (response.data._embedded.autor.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.autor.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.autor[i].idPessoa.nmPessoa, 
                            id: response.data._embedded.autor[i].id,
                            value: response.data._embedded.autor[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    autorOpcoes: [...opcoes],
                    autorCarregando: false,
                }, () => {
                    // this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    autorCarregando: false,
                    autorPlaceholder: "Erro ao carregar...",
                    autorOpcoes: [],
                }, () => {
                    // this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                autorCarregando: false,
                autorPlaceholder: "Erro ao carregar...",
                autorOpcoes: [],
            }, () => {
                // this.verificaCarregando();
            });
        }
    };

    /************
     * GET LISTA DECISÕES
     */
    getListaDecisoes = async () => {
        try {

            this.setState({ 
                decisaoCarregando: true,
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/indicativoDecisao/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'lista'
                    }
                }
            );
               
            if(response.ok && (response.data._embedded.indicativoDecisao.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.indicativoDecisao.length; i++) {

                    opcoes.push( 
                        { 
                            
                            label: (response.data._embedded.indicativoDecisao[i].noEsocial != null) ? 
                                        response.data._embedded.indicativoDecisao[i].noEsocial + ' - '
                                            + response.data._embedded.indicativoDecisao[i].dsIndicativoDecisao : 
                                        response.data._embedded.indicativoDecisao[i].dsIndicativoDecisao,
                            id: response.data._embedded.indicativoDecisao[i].id, 
                            value: response.data._embedded.indicativoDecisao[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    decisaoOpcoes: [...opcoes],
                    decisaoCarregando: false,
                }, () => {
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    decisaoCarregando: false,
                    decisaoPlaceholder: "Erro ao carregar..."
                }, () => {
                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                decisaoCarregando: false,
                decisaoPlaceholder: "Erro ao carregar..."
            }, () => {
                this.verificaCarregando();
            });
        }
    };

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
                            id: response.data._embedded.porto[i].id,
                            // cais: response.data._embedded.porto[i]._links.cais.href,
                            value: response.data._embedded.porto[i]._links.self.href 
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

            const idArray = this.state.portoSelecionado.value.split('/');

            // start making calls
            const response = await api.get(
                '/cais/search/findByIdPortoId',
                {},
                {
                    params: {
                        idPorto: idArray[idArray.length-1]
                    }
                }
            );
               
            if(response.ok && (response.data._embedded.cais.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.cais.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.cais[i].nome, 
                            id: response.data._embedded.cais[i].id,
                            // bercos: response.data._embedded.cais[i]._links.bercos.href,
                            value: response.data._embedded.cais[i]._links.self.href 
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

            const idArray = this.state.caisSelecionado.value.split('/');

            // start making calls
            const response = await api.get(
                '/berco/search/findByIdCaisId',
                {},
                {
                    params: {
                        idCais: idArray[idArray.length-1]
                    }
                }
            );

            if(response.ok && (response.data._embedded.berco.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.berco.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.berco[i].nome, 
                            id: response.data._embedded.berco[i].id,
                            value: response.data._embedded.berco[i]._links.self.href 
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
                            id: response.data._embedded.navio[i].id,
                            lloyd: response.data._embedded.navio[i].lloyd,
                            idTipoNavio: response.data._embedded.navio[i].idTipoNavio.id,
                            value: response.data._embedded.navio[i]._links.self.href 
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
    getListaTurno = async () => {
        try {

            this.setState({ 
                turnoCarregando: true
            });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/turno/search/getAtivos',
                {},
                {
                    params: {
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok && (response.data._embedded.turno.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.turno.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.turno[i].descricao, 
                            id: response.data._embedded.turno[i].id,
                            value: response.data._embedded.turno[i]._links.self.href
                        }
                    );
                }

                this.setState({ 
                    turnoOpcoes: [...opcoes],
                    turnoCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
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
                            id: response.data._embedded.atividade[i].id,
                            // funcoesEscalacao: response.data._embedded.atividade[i]._links.funcoesEscalacao.href,
                            numeroQuadro: response.data._embedded.atividade[i].numeroQuadro,
                            value: response.data._embedded.atividade[i]._links.self.href   
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
                            id: response.data._embedded.associacaoFuncao[i].id,
                            value: response.data._embedded.associacaoFuncao[i]._links.self.href,
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
                            label: response.data._embedded.faina[i].descricao, 
                            id: response.data._embedded.faina[i].id,
                            value: response.data._embedded.faina[i]._links.self.href,
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
                            id: response.data._embedded.produtoEscalacao[i].id,
                            value: response.data._embedded.produtoEscalacao[i]._links.self.href 
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
                            id: response.data._embedded.movimentacao[i].id,
                            value: response.data._embedded.movimentacao[i]._links.self.href 
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
                            id: response.data._embedded.cliente[i].id,
                            cnpj: response.data._embedded.cliente[i].idPessoaJuridica.cnpj,
                            razaoSocial: response.data._embedded.cliente[i].idPessoaJuridica.razaoSocial,
                            label: response.data._embedded.cliente[i].idPessoaJuridica.nome,
                            value: response.data._embedded.cliente[i]._links.self.href 
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
                                        id: response.data.wsAtividades[i].idAtividade.id, 
                                        numeroQuadro: response.data.wsAtividades[i].idAtividade.numeroQuadro,
                                        value: response.data.wsAtividades[i].idAtividade._links.self.href
                                    },
                                    funcao: {
                                        label: response.data.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao.idFuncaoEscalacao.nome, 
                                        // id: response.data.wsAtividades[i].wsFuncoes[j].id,
                                        id: response.data.wsAtividades[i].wsFuncoes[j].idAssociacaoFuncao.id,
                                        value: response.data.wsAtividades[i].wsFuncoes[j]._links.self.href,
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

                if(response.data.wsProducoes.length > 0) {

                    let clienteIndex = 0;
                    for (let i = 0; i < response.data.wsProducoes.length; i++) {

                        clienteIndex = this.state.clienteOpcoes.find(x => x.razaoSocial === response.data.wsProducoes[i].razaoSocialCliente);

                        if(clienteIndex !== undefined) {

                            listaProducao.push({
                                id: response.data.wsProducoes[i].id,
                                faina: {
                                    label: response.data.wsProducoes[i].idFaina.descricao, 
                                    id: response.data.wsProducoes[i].idFaina.id,
                                    value: response.data.wsProducoes[i].idFaina._links.self.href,
                                    numero: response.data.wsProducoes[i].idFaina.numero,
                                },
                                produto: {
                                    label: response.data.wsProducoes[i].idProdutoEscalacao.nome, 
                                    nomeAbreviado: response.data.wsProducoes[i].idProdutoEscalacao.nomeAbreviado, 
                                    id: response.data.wsProducoes[i].idProdutoEscalacao.id,
                                    value: response.data.wsProducoes[i].idProdutoEscalacao._links.self.href
                                },
                                movimentacao: {
                                    label: response.data.wsProducoes[i].idMovimentacao.descricao, 
                                    descricaoAbreviada: response.data.wsProducoes[i].idMovimentacao.descricaoAbreviada,
                                    id: response.data.wsProducoes[i].idMovimentacao.id,
                                    value: response.data.wsProducoes[i].idMovimentacao._links.self.href 
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
                        id: response.data.idPorto.id,
                        value: response.data.idPorto._links.self.href
                    },
                    caisSelecionado: {
                        label: response.data.idCais.nome, 
                        id: response.data.idCais.id,
                        value: response.data.idCais._links.self.href 
                    },
                    bercoSelecionado: {
                        label: response.data.idBerco.nome, 
                        id: response.data.idBerco.id,
                        value: response.data.idBerco._links.self.href
                    },
                    navioSelecionado: {
                        label: navioIndex.label, 
                        id: navioIndex.id,
                        lloyd: navioIndex.lloyd,
                        idTipoNavio: navioIndex.idTipoNavio,
                        value: navioIndex.value
                    },
                    dataOperacao: converteDataHoraParaSomenteDataBd(response.data.dtRequisicao),
                    turnoSelecionado: {
                        label: response.data.idTurno.descricao, 
                        id: response.data.idTurno.id,
                        value: response.data.idTurno._links.self.href
                    },
                    idWsPacote: response.data.idWsPacote.id,
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

                ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.id > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
                ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.id > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
                ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.id > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
                ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.id > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
                ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.id > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível obter a requisição.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.id > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
            ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.id > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
            ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.id > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
            ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.id > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
            ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.id > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

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
                validacao.navio = 'has-success';
                validacao.turno = 'has-success';
                validacao.dataOperacao = 'has-success';
                validacao.nomeModelo = 'has-success';
                // validacao.quantidadeTerno = 'has-success';

                this.setSelectValido('portoEstilo');
                this.setSelectValido('caisEstilo');
                this.setSelectValido('bercoEstilo');
                this.setSelectValido('navioEstilo');
                this.setSelectValido('turnoEstilo');

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
                    navioSelecionado: jsonObj.idNavio,
                    dataOperacao: jsonObj.dtRequisicao,
                    turnoSelecionado: jsonObj.idTurno,
                    numeroRequisicaoOperador: jsonObj.numeroRequisicaoOperador,
                    numeroRequisicaoOgmo: jsonObj.numeroRequisicaoOgmo,
                    // quantidadeTerno: jsonObj.quantidadeTerno,              
                    programacaoNavio: (jsonObj.numeroProgramacaoNavio === null) ? "" : jsonObj.numeroProgramacaoNavio,
                    observacao: (jsonObj.observacao === null) ? "" : jsonObj.observacao,

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

                ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.id > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
                ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.id > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
                ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.id > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
                ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.id > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
                ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.id > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível obter o modelo de requisição.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            ( (this.state.portoSelecionado !== null) && (this.state.portoSelecionado.id > 0) ) ? this.setSelectValido('portoEstilo') : this.setSelectInvalido('portoEstilo');
            ( (this.state.caisSelecionado !== null) && (this.state.caisSelecionado.id > 0) ) ? this.setSelectValido('caisEstilo') : this.setSelectInvalido('caisEstilo');
            ( (this.state.bercoSelecionado !== null) && (this.state.bercoSelecionado.id > 0) ) ? this.setSelectValido('bercoEstilo') : this.setSelectInvalido('bercoEstilo');
            ( (this.state.navioSelecionado !== null) && (this.state.navioSelecionado.id > 0) ) ? this.setSelectValido('navioEstilo') : this.setSelectInvalido('navioEstilo');
            ( (this.state.turnoSelecionado !== null) && (this.state.turnoSelecionado.id > 0) ) ? this.setSelectValido('turnoEstilo') : this.setSelectInvalido('turnoEstilo');

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar a busca dos dados do modelo.",
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

    setSelectInvalidoEsocial(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloInvalidoEsocial() });
    }

    setSelectValidoEsocial(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloValidoEsocial() });
    }

    setSelectNormal(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloNormal() });
    }

    
    

    existeAtividade(comparaTerno, comparaAtividade, comparaFuncao, meuArray) {

        for (var i=0; i < meuArray.length; i++) {

            if ( (meuArray[i].terno == comparaTerno) && (meuArray[i].atividade.id == comparaAtividade.id) && (meuArray[i].funcao.id == comparaFuncao.id) ) {
                
                return true;
            }
        }

        return false;
    }

    /**
      * PROCESSO JURÍDICO
      */
    validaFlagEsocial (event) {
        
        if(event.target.value === 'false'){
        this.setState({ eSocialFlag: true });
        } 
        else {
            this.setState({ eSocialFlag: false });
        }

        this.validaCamposEsocial();
    }

    validaCamposEsocial () {

        if (this.state.eSocialFlag === true) {
            this.setState({ 
                isDisabledEsocial: true,
                tipoProcessoSelecionado: null,
                grauRiscoSelecionado: null,
                varaSelecionada: null,
                autoriaSelecionada: null,
                indicativoMateriaSelecionado: null,
                decisaoSelecionada: null,
                validacao:{
                    tipoProcessoSelect: 'has-success',
                    autoriaSelect: 'has-success',
                    indicativoMateriaSelect: 'has-success',
                    grauRiscoSelect: 'has-danger',
                    varaSelect: 'has-danger',
                    decisaoSelect: 'has-danger',
                },
                estiloEsocial:{backgroundColor: '#FFFFFF'}
            });
            this.setSelectNormal('tipoProcessoEstilo');
            this.setSelectInvalido('varaEstilo');
            this.setSelectInvalido('grauRiscoEstilo')
            this.setSelectNormal('autoriaEstilo');
            this.setSelectNormal('indicativoMateriaEstilo');
            this.setSelectInvalido('decisaoEstilo');            
        }
        else {
            this.setState({ 
                isDisabledEsocial: false,
                grauRiscoSelecionado: null,
                varaSelecionada: null,                
                decisaoSelecionada: null,
                validacao:{
                    tipoProcessoSelect: 'has-danger',
                    autoriaSelect: 'has-danger',
                    indicativoMateriaSelect: 'has-danger',
                    grauRiscoSelect: 'has-danger',
                    varaSelect: 'has-danger',
                    decisaoSelect: 'has-danger',
                },                
                estiloEsocial:{backgroundColor: '#c0dcc0'} 
            });            
            this.setSelectInvalidoEsocial('tipoProcessoEstilo');
            this.setSelectInvalidoEsocial('varaEstilo');
            this.setSelectInvalidoEsocial('autoriaEstilo');
            this.setSelectInvalidoEsocial('indicativoMateriaEstilo');
            this.setSelectInvalidoEsocial('decisaoEstilo');
            
        }
    }

    validaNumeroProcesso(event){
        const { validacao, maskInput } = this.state

        // if( isNull(event.target.value) || event.target.value === '') {
        //     validacao.numeroProcesso = 'has-danger';
        // }
        // else {
        //     validacao.numeroProcesso = 'has-success';
        // }

        // this.setState({ validacao })

        if ( event.target.value.length === 0 ) {
            maskInput.numeroProcessoFeedback = 'Campo obrigatório';
            maskInput.numeroProcessoClasse = 'form-control is-invalid';
            
            // this.setState({
            //     cpfError: "Campo obrigatório",
            //     cpfClass: "form-control is-invalid"
            // })
        }
        else if ( event.target.value.length === 25 ) {
            maskInput.numeroProcessoFeedback = '';
            maskInput.numeroProcessoClasse = 'form-control is-valid';
        //     this.setState({
        //         cpfError: "",
        //         cpfClass: "form-control"
        //     })
        }
        else {
            maskInput.numeroProcessoFeedback = '';
            maskInput.numeroProcessoClasse = 'form-control is-invalid';
            // this.setState({
            //     cpfError: "CPF inválido",
            //     cpfClass: "form-control is-invalid"
            // })
        }
    }

    validaTipoProcesso(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.tipoProcessoSelect = 'has-danger';
        }
        else {
            validacao.tipoProcessoSelect = 'has-success';
        }

        this.setState({ validacao })
    }

    validaGrauRisco(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.grauRiscoSelect = 'has-danger';
        }
        else {
            validacao.grauRiscoSelect = 'has-success';
        }

        this.setState({ validacao })
    }

    validaVara(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.varaSelect = 'has-danger';
        }
        else {
            validacao.varaSelect = 'has-success';
        }

        this.setState({ validacao })
    }

    validaAutoria(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.autoriaSelect = 'has-danger';
        }
        else {
            validacao.autoriaSelect = 'has-success';
        }

        this.setState({ validacao })
    }

    validaIndicativoMateria(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.indicativoMateriaSelect = 'has-danger';
        }
        else {
            validacao.indicativoMateriaSelect = 'has-success';
        }

        this.setState({ validacao })
    }

    /**
      * DECISÃO
      */
    validaDecisaoSelect(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.decisaoSelect = 'has-danger';
        }
        else {
            validacao.decisaoSelect = 'has-success';
        }

        this.setState({ validacao })
    }

    validaDecisaoDataRecepcao(event) {
        
        const { validacao } = this.state

        if( isNull(event.target.value) || event.target.value === '') {
            validacao.decisaoDataRecepcao = 'has-danger';
        }
        else {
            validacao.decisaoDataRecepcao = 'has-success';
        }

        this.setState({ validacao })
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
        
        if( event.target.value < this.state.dataAtual ) {
            validacao.dataOperacao = 'has-danger';
        }
        else {
            validacao.dataOperacao = 'has-success';
        }

        this.setState({ validacao })
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
     * DADOS DO GRAU DE RISCO
     */
    aoSelecionarGrauRisco = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('grauRiscoEstilo');
            this.setState({ grauRiscoSelecionado: null });
        }
        else {
            this.setSelectValido('grauRiscoEstilo');
            this.setState({ grauRiscoSelecionado: event });
        }
    }

    /************
     * DADOS DO TIPO DE CAUSA
     */
    aoSelecionarTipoCausa = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('tipoCausaEstilo');
            this.setState({ tipoCausaSelecionado: null });
        }
        else {
            this.setSelectValido('tipoCausaEstilo');
            this.setState({ tipoCausaSelecionado: event });
        }
    }

    /************
     * DADOS DA CATEGORIA
     */
    aoSelecionarCategoria = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('categoriaEstilo');
            this.setState({ categoriaSelecionado: null });
        }
        else {
            this.setSelectValido('categoriaEstilo');
            this.setState({ categoriaSelecionado: event });
        }
    }

    /************
     * DADOS DA INSTÂNCIA
     */
    aoSelecionarInstancia = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('instanciaEstilo');
            this.setState({ instanciaSelecionado: null });
        }
        else {
            this.setSelectValido('instanciaEstilo');
            this.setState({ instanciaSelecionado: event });
        }
    }
    
    /************
     * DADOS DA VARA
     */
    aoSelecionarVara = (event) => {
        
        if (this.state.eSocialFlag === true) {
            if( isNull(event)) {          

                this.setSelectInvalidoEsocial('varaEstilo');
                this.setState({ varaSelecionada: null });
            }
            else {
                this.setSelectValidoEsocial('varaEstilo');
                this.setState({ varaSelecionada: event });
            }
        } else{
            if( isNull(event)) {          

                this.setSelectInvalido('varaEstilo');
                this.setState({ varaSelecionada: null });
            }
            else {
                this.setSelectValido('varaEstilo');
                this.setState({ varaSelecionada: event });
            }
        }
    }

    /************
     * DADOS DO TIPO DE PROCESSO JURÍDICO
     */
    aoSelecionarTipoProcesso = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalidoEsocial('tipoProcessoEstilo');
            this.setState({ tipoProcessoSelecionado: null });
        }
        else {
            this.setSelectValidoEsocial('tipoProcessoEstilo');
            this.setState({ tipoProcessoSelecionado: event });
        }
    }

    /************
     * DADOS DA AUTORIA
     */
    aoSelecionarAutoria = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalidoEsocial('autoriaEstilo');
            this.setState({ autoriaSelecionada: null });
        }
        else {
            this.setSelectValidoEsocial('autoriaEstilo');
            this.setState({ autoriaSelecionada: event });
        }
    }

    /************
     * DADOS DO INDICATIVO DE MATÉRIA DO PROCESSO
     */
    aoSelecionarIndicativoMateria = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalidoEsocial('indicativoMateriaEstilo');
            this.setState({ indicativoMateriaSelecionado: null });
        }
        else {
            this.setSelectValidoEsocial('indicativoMateriaEstilo');
            this.setState({ indicativoMateriaSelecionado: event });
        }
    }
 
    /************
     * DADOS DO RÉU
     */
    aoSelecionarReu = (event) => {        

        if( isNull(event)) {

            this.setState({ 
                reuSelecionado: null
            });
            
            this.setSelectInvalido('reuEstilo');
        }
        else {
        
            this.setState({ 
                reuID: event.value,
                reuSelecionado: event
            });
            
            this.setSelectValido('reuEstilo')
        }
    }

    aoPesquisarReu = (event) => {

        const inputValue = event.replace(/\W/g, '');
        this.setState({ reuPesquisa: (inputValue === null ? '' : inputValue) });

        return inputValue;
    };

    carregarOpcoesReu = (inputValue, callback) => {
        
        setTimeout(() => {
            this.getListaReu(inputValue);
        }, 1000);

        setTimeout(() => {                        
            callback(this.state.reuOpcoes);            
        }, 2000);
    };

    /************
     * DADOS DO AUTOR
     */
    aoSelecionarAutor = (event) => {        

        if( isNull(event)) {

            this.setState({ 
                autorSelecionado: null
            });
            
            this.setSelectInvalido('autorEstilo');
        }
        else {
        
            this.setState({ 
                autorID: event.value,
                autorSelecionado: event
            });
            
            this.setSelectValido('autorEstilo')
        }
    }

    aoPesquisarAutor = (event) => {

        const inputValue = event.replace(/\W/g, '');
        this.setState({ autorPesquisa: (inputValue === null ? '' : inputValue) });

        return inputValue;
    };

    carregarOpcoesAutor = (inputValue, callback) => {
        
        setTimeout(() => {
            this.getListaAutor(inputValue);
        }, 1000);

        setTimeout(() => {                        
            callback(this.state.autorOpcoes);            
        }, 2000);
    };

    /************
     * DADOS DA DECISÃO
     */
    aoSelecionarDecisao = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalidoEsocial('decisaoEstilo');
            this.setState({ decisaoSelecionada: null });
        }
        else {
            this.setSelectValidoEsocial('decisaoEstilo');
            this.setState({ decisaoSelecionada: event });
        }
    }

    /************
     * DADOS DA REQUISIÇÃO
     */
    handlePortoSelectChange = (event) => {
        
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

    handleCaisSelectChange = (event) => {
        
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

    handleBercoSelectChange = (event) => {
        
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

    handleNavioSelectChange = (event) => {
        
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

    handleTurnoSelectChange = (event) => {
        
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
    handleAtividadeSelectChange = (event) => {
        
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

    handleFuncaoSelectChange = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('funcaoEstilo');
            this.setState({ funcaoSelecionada: null });
        }
        else {
            this.setSelectValido('funcaoEstilo');
            this.setState({ funcaoSelecionada: event });
        }
    }

    handleAdicionarAtividade = () => {

        if (
            (this.state.validacao.terno === 'has-success') &&
            (this.state.validacao.atividade === 'has-success') &&
            (this.state.validacao.funcao === 'has-success') &&
            (this.state.validacao.quantidade === 'has-success')
        ) {
           
            if( !this.existeAtividade(this.state.terno, this.state.atividadeSelecionada, this.state.funcaoSelecionada, this.state.listaAtividade) ) {

                let novaAtividade = this.state.listaAtividade;

                novaAtividade.push({
                    terno: this.state.terno,
                    atividade: this.state.atividadeSelecionada,
                    funcao: this.state.funcaoSelecionada,
                    quantidade: this.state.quantidade,
                    // excluir: <i className="fa fa-trash fa-lg" onClick={this.handleRemoverAtividade}></i>
                });

                const { validacao } = this.state;
                validacao.terno = 'has-danger';
                validacao.atividade = 'has-danger';
                validacao.funcao = 'has-danger';
                validacao.quantidade = 'has-danger';

                this.setSelectInvalido('atividadeEstilo');
                this.setSelectInvalido('funcaoEstilo');

                this.setState({
                    listaAtividade: novaAtividade,
                    terno: '',
                    atividadeSelecionada: null,
                    funcaoSelecionada: null,
                    quantidade: '',

                    validacao,
                });
            }
            else {
                this.erroAdicionarAtividadeTabela();
            }
        }
        else {
            this.erroAdicionarTabela();
        }
    }

    handleRemoverAtividade = (event) => {

        const listaAtividade = [...this.state.listaAtividade];
        listaAtividade.splice(event.currentTarget.id, 1);
        this.setState({ listaAtividade });
    }


    /************
     * PRODUÇÕES
     */
    handleFainaSelectChange = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('fainaEstilo');
            this.setState({ fainaSelecionada: null });
        }
        else {
            this.setSelectValido('fainaEstilo');
            this.setState({ fainaSelecionada: event });
        }
    }

    handleProdutoSelectChange = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('produtoEstilo');
            this.setState({ produtoSelecionado: null });
        }
        else {
            this.setSelectValido('produtoEstilo');
            this.setState({ produtoSelecionado: event });
        }
    }

    handleMovimentacaoSelectChange = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('movimentacaoEstilo');
            this.setState({ movimentacaoSelecionada: null });
        }
        else {
            this.setSelectValido('movimentacaoEstilo');
            this.setState({ movimentacaoSelecionada: event });
        }
    }

    handleClienteSelectChange = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('clienteEstilo');
            this.setState({ clienteSelecionado: null });
        }
        else {
            this.setSelectValido('clienteEstilo');
            this.setState({ clienteSelecionado: event });
        }
    }

    handleAdicionarProducao = () => {

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

    handleRemoverProducao = (event) => {
        const listaProducao = [...this.state.listaProducao];
        listaProducao.splice(event.currentTarget.id, 1);
        this.setState({ listaProducao });
    }


    /**************
     * BOTÕES DE AÇÃO
     */

    aoSalvar = () => {

        if (
            (this.state.validacao.porto === 'has-success') &&
            (this.state.validacao.cais === 'has-success') &&
            (this.state.validacao.berco === 'has-success') &&
            (this.state.validacao.navio === 'has-success') &&
            (this.state.validacao.dataOperacao === 'has-success') &&
            (this.state.validacao.turno === 'has-success') &&
            // (this.state.validacao.quantidadeTernos === 'has-success') &&
            (this.state.listaAtividade.length > 0) &&
            (this.state.listaProducao.length > 0)
        ) {

            const listaAtividadeOrdenada = [].concat(this.state.listaAtividade)
                .sort( function(a, b) {
                    if( (a.atividade.id < b.atividade.id) ) { return -1; }
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

                switch (listaAtividadeOrdenada[i].atividade.id) {

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

        // REQUISIÇÃO
        if( this.props.tipo === "requisicao" ) {

            this.deleteWsControleRequisicao();
        }
        // MODELO
        else {
            this.deleteWsModeloRequisicao();
        }
    }

    aoVoltar = () => {
        const history = createHashHistory();

        // REQUISIÇÃO
        if(this.props.tipo === "requisicao") {
            history.push('/operador-portuario/requisicao/lista');
        }
        // MODELO
        else {
            history.push('/operador-portuario/requisicao/modelo/lista');
        }
        
    }

    aoConfirmarResumo = () => {

        this.alternarModelResumo();

        // REQUISIÇÃO
        if( this.props.tipo === "requisicao" ) {

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
        // MODELO
        else {            
            this.alternarModelModelo();
        }
    }
  
    aoCancelarResumo = () => {
        this.setState({ criarModelo: false }, () => {
            this.alternarModelResumo();
        })        
    }

    aoConfirmarModelo = () => {

        this.alternarModelModelo();

        // REQUISIÇÃO
        if( this.props.tipo === "requisicao" ) {

            this.postWsModeloRequisicao();
        }
        // MODELO
        else {
            if( this.ehEdicao() ) {

                this.patchWsModeloRequisicao();
            }
            else {
                this.postWsModeloRequisicao();
            } 
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
            ((this.props.tipo === "requisicao") && this.state.criarModelo) ||
            (this.props.tipo === "modelo")
        ) {

            for (let i = 0; i < this.state.listaProducao.length; i++) {

                idFaina = this.state.fainaOpcoes.find(x => x.id === this.state.listaProducao[i].faina.id);
                idMovimentacao = this.state.movimentacaoOpcoes.find(x => x.id === this.state.listaProducao[i].movimentacao.id);
                idProdutoEscalacao = this.state.produtoOpcoes.find(x => x.id === this.state.listaProducao[i].produto.id);
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
                        id: this.state.listaProducao[i].faina.id
                    },
                    idMovimentacao: {
                        id: this.state.listaProducao[i].movimentacao.id
                    },
                    classificacaoPorao: null,
                    quantidadeProduto: this.state.listaProducao[i].producao,
                    quantidadeTonelagem: this.state.listaProducao[i].tonelagem,
                    cnpjCliente: this.state.listaProducao[i].cliente.cnpj,
                    razaoSocialCliente: this.state.listaProducao[i].cliente.razaoSocial,
                    nomeFantasiaCliente: this.state.listaProducao[i].cliente.label,
                    idProdutoEscalacao: {
                        id: this.state.listaProducao[i].produto.id
                    }
                })
            }
        }

        return arrayProducao;
    }

    montaAtividade() {
        const listaAtividadeOrdenada = [].concat(this.state.listaAtividade)
            .sort( function(a, b) {
                if( (a.terno < b.terno) || (a.atividade.id < b.atividade.id) ) { return -1; }
                if( (a.terno > b.terno) || (a.atividade.id < b.atividade.id) ) { return 1; }
                return 0;
            })

        let atividadeAtual = null; 
        let ternoAtual = null;
        
        let arrayAtividade = [];
        let arrayFuncao = [];

        if( 
            ((this.props.tipo === "requisicao") && this.state.criarModelo) ||
            (this.props.tipo === "modelo")
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

                if( (atividadeAtual === listaAtividadeOrdenada[i].atividade.id) && (ternoAtual === listaAtividadeOrdenada[i].terno)  ) {

                    arrayFuncao.push({
                        idFuncaoEscalacao: null,
                        quantidadeHomem: listaAtividadeOrdenada[i].quantidade,
                        idAssociacaoFuncao: {
                            id: listaAtividadeOrdenada[i].funcao.id
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

                    atividadeAtual = listaAtividadeOrdenada[i].atividade.id;
                    ternoAtual = listaAtividadeOrdenada[i].terno;
                    
                    arrayFuncao.push({
                        idFuncaoEscalacao: null,
                        quantidadeHomem: listaAtividadeOrdenada[i].quantidade,
                        idAssociacaoFuncao: {
                            id: listaAtividadeOrdenada[i].funcao.id
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
                    id: this.state.caisSelecionado.id
                }, 
                idOperadorPortuario: {
                    id: this.props.idOperadorPortuario
                },
                idBerco: {
                    id: this.state.bercoSelecionado.id
                },
                idPorto: {
                    id: this.state.portoSelecionado.id
                },
                idTurno: {
                    id: this.state.turnoSelecionado.id
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
                        id: this.state.caisSelecionado.id
                    }, 
                    idOperadorPortuario: {
                        id: this.props.idOperadorPortuario
                    },
                    idBerco: {
                        id: this.state.bercoSelecionado.id
                    },
                    idPorto: {
                        id: this.state.portoSelecionado.id
                    },
                    idTurno: {
                        id: this.state.turnoSelecionado.id
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
                erroMensagem: "Falha ao realizar a solicitação da requisição.",
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
                "/wsControleRequisicao/" + this.props.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A requisição foi cancelada!",
                    sucessoExibe: true 
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
                                                        <i className="fa fa-file-text"></i> Geral
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                                                <CardBody>
                                                    
                                                    <Row>
                                                        <Col xs="12" md="3">
                                                            <Label htmlFor="eSocial">eSocial</Label><br />
                                                            <AppSwitch 
                                                                className={'mx-1'}
                                                                variant={'pill'}
                                                                id="eSocialFlag"
                                                                name="eSocialFlag"
                                                                color={'primary'}
                                                                outline={'alt'}
                                                                value={this.state.eSocialFlag}
                                                                defaultChecked={false}
                                                                onChange={(event) => {this.validaFlagEsocial(event)}}
                                                            />
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="6">
                                                            <FormGroup>
                                                                <Label htmlFor="tipoProcesso">Tipo de Processo</Label>
                                                                <Select
                                                                    id="tipoProcesso"
                                                                    name="tipoProcesso"
                                                                    value={this.state.tipoProcessoSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaTipoProcesso(event)
                                                                        this.aoSelecionarTipoProcesso(event)
                                                                    }}
                                                                    options={this.state.tipoProcessoOpcoes}                                                                    
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.tipoProcessoCarregando}
                                                                    placeholder={this.state.tipoProcessoPlaceholder}
                                                                    styles={this.state.tipoProcessoEstilo}
                                                                    isDisabled= {this.state.isDisabledEsocial}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.tipoProcessoSelect === 'has-success' } 
                                                                    invalid={ this.state.validacao.tipoProcessoSelect === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        
                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="numeroProcesso">Número (Unificado)</Label>
                                                                <MaskedInput
                                                                    mask= {  this.state.maskInput.numeroProcessoMascara }
                                                                    className = { this.state.maskInput.numeroProcessoClasse }
                                                                    placeholder= "Ex.: 0000000-00.0000.0.00.0000"
                                                                    guide={false}
                                                                    keepCharPositions={false}
                                                                    showMask={false}
                                                                    type="text" 
                                                                    id="numeroProcesso" 
                                                                    name="numeroProcesso"                                                                    
                                                                    required 
                                                                    value={this.state.numeroProcesso}
                                                                    onChange={(event) => { 
                                                                        this.validaNumeroProcesso(event)
                                                                        this.handleChange(event)
                                                                    }}
                                                                    style= {this.state.estiloEsocial}
                                                                />
                                                                <FormFeedback>{ this.state.maskInput.numeroProcessoFeedback }</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="numeroProcessoAntigo">Número Antigo</Label>
                                                                <Input 
                                                                    type="text" 
                                                                    id="numeroProcessoAntigo"
                                                                    name="numeroProcessoAntigo"
                                                                    required 
                                                                    value={this.state.numeroProcessoAntigo}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    
                                                    <Row>
                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="valorCausa">Valor da Causa (R$)</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    id="valorCausa" 
                                                                    name="valorCausa"
                                                                    min={0}
                                                                    required 
                                                                    value={this.state.valorCausa}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="valorAtual">Valor Atual (R$)</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    id="valorAtual"
                                                                    name="valorAtual"
                                                                    min={0}
                                                                    required 
                                                                    value={this.state.valorAtual}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="dataRecepcao">Data de Recepção</Label>
                                                                <Input 
                                                                    type="date" 
                                                                    //min={this.state.dataAtual}
                                                                    id="dataRecepcao" 
                                                                    name="dataRecepcao" 
                                                                    required 
                                                                    value={this.state.dataRecepcao}
                                                                    onChange={(event) => { 
                                                                        //this.validaDataOperacao(event)
                                                                        this.handleChange(event)
                                                                    }}
                                                                    //valid={ this.state.validacao.dataRecepcao === 'has-success' } 
                                                                    //invalid={ this.state.validacao.dataRecepcao === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="dataDistribuicao">Data de Distribuição</Label>
                                                                <Input 
                                                                    type="date" 
                                                                    //min={this.state.dataAtual}
                                                                    id="dataDistribuicao" 
                                                                    name="dataDistribuicao" 
                                                                    required 
                                                                    value={this.state.dataDistribuicao}
                                                                    onChange={(event) => { 
                                                                        //this.validaDataOperacao(event)
                                                                        this.handleChange(event)
                                                                    }}
                                                                    //valid={ this.state.validacao.dataDistribuicao === 'has-success' } 
                                                                    //invalid={ this.state.validacao.dataDistribuicao === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row> 

                                                    <Row>
                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="grauRisco">Grau de Risco</Label>
                                                                <Select
                                                                    id="grauRisco"
                                                                    name="grauRisco"
                                                                    value={this.state.grauRiscoSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaGrauRisco(event)
                                                                        this.aoSelecionarGrauRisco(event)
                                                                    }}
                                                                    options={this.state.grauRiscoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    placeholder={this.state.grauRiscoPlaceholder}
                                                                    styles={this.state.grauRiscoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.grauRiscoSelect === 'has-success' } 
                                                                    invalid={ this.state.validacao.grauRiscoSelect === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="tipoCausa">Tipo de Causa</Label>
                                                                <Select
                                                                    id="tipoCausa"
                                                                    name="tipoCausa"
                                                                    value={this.state.tipoCausaSelecionado}
                                                                    onChange={(event) => { 
                                                                        // this.validaPorto(event)
                                                                        this.aoSelecionarTipoCausa(event)
                                                                    }}
                                                                    options={this.state.tipoCausaOpcoes}
                                                                    required
                                                                    isClearable
                                                                    placeholder={this.state.tipoCausaPlaceholder}
                                                                    styles={this.state.tipoCausaEstilo}
                                                                />
                                                                {/* <Input 
                                                                    valid={ this.state.validacao.porto === 'has-success' } 
                                                                    invalid={ this.state.validacao.porto === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback> */}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="categoria">Categoria</Label>
                                                                <Select
                                                                    id="categoria"
                                                                    name="categoria"
                                                                    value={this.state.categoriaSelecionado}
                                                                    onChange={(event) => { 
                                                                        // this.validaPorto(event)
                                                                        this.aoSelecionarCategoria(event)
                                                                    }}
                                                                    options={this.state.categoriaOpcoes}
                                                                    required
                                                                    isClearable
                                                                    placeholder={this.state.categoriaPlaceholder}
                                                                    styles={this.state.categoriaEstilo}
                                                                />
                                                                {/* <Input 
                                                                    valid={ this.state.validacao.porto === 'has-success' } 
                                                                    invalid={ this.state.validacao.porto === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback> */}
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="instancia">Instância</Label>
                                                                <Select
                                                                    id="instancia"
                                                                    name="instancia"
                                                                    value={this.state.instanciaSelecionado}
                                                                    onChange={(event) => { 
                                                                        // this.validaPorto(event)
                                                                        this.aoSelecionarInstancia(event)
                                                                    }}
                                                                    options={this.state.instanciaOpcoes}
                                                                    required
                                                                    isClearable
                                                                    placeholder={this.state.instanciaPlaceholder}
                                                                    styles={this.state.instanciaEstilo}
                                                                />
                                                                {/* <Input 
                                                                    valid={ this.state.validacao.porto === 'has-success' } 
                                                                    invalid={ this.state.validacao.porto === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback> */}
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="6">
                                                            <FormGroup>
                                                                <Label htmlFor="vara">Vara</Label>
                                                                <Select
                                                                    id="vara"
                                                                    name="vara"
                                                                    value={this.state.varaSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaVara(event)
                                                                        this.aoSelecionarVara(event)
                                                                    }}
                                                                    options={this.state.varaOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.varaCarregando}
                                                                    placeholder={this.state.varaPlaceholder}
                                                                    styles={this.state.varaEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.varaSelect === 'has-success' } 
                                                                    invalid={ this.state.validacao.varaSelect === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="6">
                                                            <FormGroup>
                                                                <Label htmlFor="autoria">Autoria</Label>
                                                                <Select
                                                                    id="autoria"
                                                                    name="autoria"
                                                                    value={this.state.autoriaSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaAutoria(event)
                                                                        this.aoSelecionarAutoria(event)
                                                                    }}
                                                                    options={this.state.autoriaOpcoes}
                                                                    required
                                                                    isClearable
                                                                    placeholder={this.state.autoriaPlaceholder}
                                                                    styles={this.state.autoriaEstilo}                                                                    
                                                                    isDisabled= {this.state.isDisabledEsocial}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.autoriaSelect === 'has-success' } 
                                                                    invalid={ this.state.validacao.autoriaSelect === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="9">
                                                            <FormGroup>
                                                                <Label htmlFor="indicativoMateria">Indicativo de Matéria</Label>
                                                                <Select
                                                                    id="indicativoMateria"
                                                                    name="indicativoMateria"
                                                                    value={this.state.indicativoMateriaSelecionado}
                                                                    onChange={(event) => { 
                                                                        this.validaIndicativoMateria(event)
                                                                        this.aoSelecionarIndicativoMateria(event)
                                                                    }}
                                                                    options={this.state.indicativoMateriaOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.indicativoMateriaCarregando}
                                                                    placeholder={this.state.indicativoMateriaPlaceholder}
                                                                    styles={this.state.indicativoMateriaEstilo}
                                                                    isDisabled= {this.state.isDisabledEsocial}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.indicativoMateriaSelect === 'has-success' } 
                                                                    invalid={ this.state.validacao.indicativoMateriaSelect === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    {/*<Row>
                                                        <Col xs="12" md="9">
                                                            <FormGroup>
                                                                <Label htmlFor="indicativoMateria">Indicativo de Matéria</Label>
                                                                <Select
                                                                    id="indicativoMateria"
                                                                    name="indicativoMateria"
                                                                    value={this.state.indicativoMateriaSelecionado}
                                                                    // onChange={(event) => { 
                                                                    //     this.validaPorto(event)
                                                                    //     this.handlePortoSelectChange(event)
                                                                    // }}
                                                                    options={this.state.indicativoMateriaOpcoes}
                                                                    required
                                                                    autoFocus
                                                                    isClearable
                                                                    //isLoading={this.state.varaCarregando}
                                                                    placeholder={this.state.indicativoMateriaPlaceholder}
                                                                    styles={this.state.indicativoMateriaEstilo}
                                                                />
                                                                {/* <Input 
                                                                    valid={ this.state.validacao.porto === 'has-success' } 
                                                                    invalid={ this.state.validacao.porto === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>                                                   
                                                
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
                                                                        this.handlePortoSelectChange(event)
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
                                                                        this.handleCaisSelectChange(event)
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
                                                                        this.handleBercoSelectChange(event)
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
                                                                        this.handleNavioSelectChange(event)
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
                                                                    min={this.state.dataAtual}
                                                                    id="dataOperacao" 
                                                                    name="dataOperacao" 
                                                                    required 
                                                                    value={this.state.dataOperacao}
                                                                    onChange={(event) => { 
                                                                        this.validaDataOperacao(event)
                                                                        this.handleChange(event)
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
                                                                        this.handleTurnoSelectChange(event)
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
                                                        </Col> */}

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
                                                                        this.handleChange(event)
                                                                    }}
                                                                    valid={ this.state.validacao.quantidadeTerno === 'has-success' } 
                                                                    invalid={ this.state.validacao.quantidadeTerno === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col> */}

                                                        {/* <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="programacaoNavio">Programação do Navio</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    min="0"
                                                                    id="programacaoNavio" 
                                                                    name="programacaoNavio"
                                                                    required 
                                                                    value={this.state.programacaoNavio}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row> */}

                                                    <Row>
                                                        <Col xs="12">
                                                            <FormGroup>
                                                                <Label htmlFor="observacao">Observação</Label>
                                                                <Input 
                                                                    type="textarea" 
                                                                    id="observacao" 
                                                                    name="observacao" 
                                                                    rows="4"
                                                                    style= {this.state.estiloEsocial} 
                                                                    value={this.state.observacao}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                </CardBody>
                                            </Collapse>
                                        </Card>

                                        <Card>
                                            <CardHeader id="headingTwo">
                                                <Button block color="link" className="text-left m-0 p-0" disabled={this.state.isDisabledEsocial} onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]} aria-controls="collapseTwo">
                                                    <h5 className="m-0 p-0">
                                                        <i className="fa fa-users"></i> Réu
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseTwo">
                                                <CardBody>
                                                    <Row>                                                    
                                                        <Col xs="12" md="2">
                                                            <Label htmlFor="reuFlag">Principal</Label><br />
                                                            <AppSwitch 
                                                                className={'mx-1'}
                                                                variant={'pill'}
                                                                id="reuFlag"
                                                                name="reuFlag"
                                                                color={'primary'}
                                                                outline={'alt'} 
                                                                checked={this.state.reuFlag}
                                                                onChange={this.handleChange} 
                                                            />
                                                        </Col>

                                                        <Col xs="12" md="10">
                                                            <FormGroup>
                                                                <Label htmlFor="reu">Réu</Label>
                                                                <AsyncSelect
                                                                    // cacheOptions
                                                                    loadOptions={this.carregarOpcoesReu}
                                                                    defaultOptions
                                                                    id="reu"
                                                                    name="reu"
                                                                    placeholder={this.state.reuPlaceholder}
                                                                    isLoading={this.state.reuCarregando}
                                                                    isClearable
                                                                    required
                                                                    styles={this.state.reuEstilo}
                                                                    onChange={this.aoSelecionarReu}
                                                                    onInputChange={this.aoPesquisarReu}
                                                                />
                                                                <Input
                                                                    type="hidden"
                                                                    name="reuValidacao"
                                                                    id="reuValidacao"
                                                                    value={this.state.reuSelecionado ? this.state.reuSelecionado.value : ''}
                                                                    valid={this.state.reuSelecionado ? true : false}
                                                                    invalid={!this.state.reuSelecionado ? true : false}
                                                                    required
                                                                />
                                                                <FormFeedback className="help-block">Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>                                                  

                                                        {/* <Col xs="12" md="2">
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
                                                                        this.handleChange(event)
                                                                    }}
                                                                    valid={ this.state.validacao.terno === 'has-success' } 
                                                                    invalid={ this.state.validacao.terno === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
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
                                                                        this.handleAtividadeSelectChange(event)
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
                                                                        this.handleFuncaoSelectChange(event)
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
                                                                        this.handleChange(event)
                                                                    }}
                                                                    valid={ this.state.validacao.quantidade === 'has-success' } 
                                                                    invalid={ this.state.validacao.quantidade === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col> */}
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">
                                                            <Button 
                                                                type="button" 
                                                                color="primary" 
                                                                size="sm"
                                                                onClick={this.handleAdicionarAtividade}
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
                                                                        <th>Principal</th>
                                                                        <th>Nome</th>
                                                                        <th>Data de Início</th>
                                                                        <th>Excluir</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/* {this.state.listaAtividade.map((linha, idx) => (
                                                                        <tr key={idx}>
                                                                            <td>{linha.terno}</td>
                                                                            <td>{linha.atividade.label}</td>
                                                                            <td>{linha.funcao.label}</td>
                                                                            <td>
                                                                                <i 
                                                                                    className="fa fa-trash fa-lg btn-acao" 
                                                                                    id={idx} 
                                                                                    onClick={this.handleRemoverAtividade}
                                                                                ></i>
                                                                            </td>
                                                                        </tr>
                                                                    ))} */}
                                                                </tbody>
                                                            </Table>

                                                            {/* <Table responsive striped hover size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Terno</th>
                                                                        <th>Atividade</th>
                                                                        <th>Função</th>
                                                                        <th>Quantidade</th>
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
                                                                                className="fa fa-trash fa-lg btn-acao" 
                                                                                id={idx} 
                                                                                onClick={this.handleRemoverAtividade}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table> */}
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Collapse>
                                        </Card>

                                        <Card>
                                            <CardHeader id="headingThree">
                                                <Button block color="link" className="text-left m-0 p-0" disabled={this.state.isDisabledEsocial} onClick={() => this.toggleAccordion(2)} aria-expanded={this.state.accordion[2]} aria-controls="collapseThree">
                                                    <h5 className="m-0 p-0">
                                                        <i className="fa fa-users"></i> Autor
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseThree">
                                                <CardBody>
                                                    <Row>                                                    
                                                        <Col xs="12" md="2">
                                                            <Label htmlFor="autorFlag">Principal</Label><br />
                                                            <AppSwitch 
                                                                className={'mx-1'}
                                                                variant={'pill'}
                                                                id="autorFlag"
                                                                name="autorFlag"
                                                                color={'primary'}
                                                                outline={'alt'}
                                                                checked={this.state.autorFlag}
                                                                onChange={this.handleChange} 
                                                            />
                                                        </Col>

                                                        <Col xs="12" md="10">
                                                            <FormGroup>
                                                                <Label htmlFor="autor">Autor</Label>
                                                                <AsyncSelect
                                                                    // cacheOptions
                                                                    loadOptions={this.carregarOpcoesAutor}
                                                                    defaultOptions
                                                                    id="autor"
                                                                    name="autor"
                                                                    placeholder={this.state.autorPlaceholder}
                                                                    isLoading={this.state.autorCarregando}
                                                                    isClearable
                                                                    required
                                                                    styles={this.state.autorEstilo}
                                                                    onChange={this.aoSelecionarAutor}
                                                                    onInputChange={this.aoPesquisarAutor}
                                                                />
                                                                <Input
                                                                    type="hidden"
                                                                    name="autorValidacao"
                                                                    id="autorValidacao"
                                                                    value={this.state.autorSelecionado ? this.state.autorSelecionado.value : ''}
                                                                    valid={this.state.autorSelecionado ? true : false}
                                                                    invalid={!this.state.autorSelecionado ? true : false}
                                                                    required
                                                                />
                                                                <FormFeedback className="help-block">Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>                                                    

                                                        {/* <Col xs="12" md="2">
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
                                                                        this.handleChange(event)
                                                                    }}
                                                                    valid={ this.state.validacao.terno === 'has-success' } 
                                                                    invalid={ this.state.validacao.terno === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
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
                                                                        this.handleAtividadeSelectChange(event)
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
                                                                        this.handleFuncaoSelectChange(event)
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
                                                                        this.handleChange(event)
                                                                    }}
                                                                    valid={ this.state.validacao.quantidade === 'has-success' } 
                                                                    invalid={ this.state.validacao.quantidade === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col> */}
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">
                                                            <Button 
                                                                type="button" 
                                                                color="primary" 
                                                                size="sm"
                                                                onClick={this.handleAdicionarAtividade}
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
                                                                        <th>Principal</th>
                                                                        <th>Nome</th>
                                                                        <th>Data de Início</th>
                                                                        <th>Excluir</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {/* {this.state.listaAtividade.map((linha, idx) => (
                                                                        <tr key={idx}>
                                                                            <td>{linha.terno}</td>
                                                                            <td>{linha.atividade.label}</td>
                                                                            <td>{linha.funcao.label}</td>
                                                                            <td>
                                                                                <i 
                                                                                    className="fa fa-trash fa-lg btn-acao" 
                                                                                    id={idx} 
                                                                                    onClick={this.handleRemoverAtividade}
                                                                                ></i>
                                                                            </td>
                                                                        </tr>
                                                                    ))} */}
                                                                </tbody>
                                                            </Table>

                                                            {/* <Table responsive striped hover size="sm">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Terno</th>
                                                                        <th>Atividade</th>
                                                                        <th>Função</th>
                                                                        <th>Quantidade</th>
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
                                                                                className="fa fa-trash fa-lg btn-acao" 
                                                                                id={idx} 
                                                                                onClick={this.handleRemoverAtividade}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </Table> */}
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Collapse>
                                        </Card>
 
                                        <Card>
                                            <CardHeader id="headingFour">
                                                <Button block color="link" className="text-left m-0 p-0" disabled={this.state.isDisabledEsocial} onClick={() => this.toggleAccordion(3)} aria-expanded={this.state.accordion[3]} aria-controls="collapseFour">
                                                    <h5 className="m-0 p-0">
                                                        <i className="fa fa-gavel"></i> Decisões
                                                    </h5>
                                                </Button>
                                            </CardHeader>
                                            <Collapse isOpen={this.state.accordion[3]} data-parent="#accordion" id="collapseFour">
                                                <CardBody>

                                                    <Row>
                                                        <Col xs="12" md="2">
                                                            <Label htmlFor="decisaoFlag">Depósito Integral</Label><br />
                                                            <AppSwitch 
                                                                className={'mx-1'}
                                                                variant={'pill'}
                                                                id="decisaoFlag"
                                                                name="decisaoFlag"
                                                                color={'primary'}
                                                                outline={'alt'} 
                                                                checked={this.state.decisaoFlag}
                                                                onChange={this.handleChange} 
                                                            />
                                                        </Col>

                                                        <Col xs="12" md="7">
                                                            <FormGroup>
                                                                <Label htmlFor="indicativoDecisao">Indicativo de Decisão</Label>
                                                                <Select
                                                                    id="indicativoDecisao"
                                                                    name="indicativoDecisao"
                                                                    value={this.state.decisaoSelecionada}
                                                                    onChange={(event) => { 
                                                                         this.validaDecisaoSelect(event)
                                                                         this.aoSelecionarDecisao(event)
                                                                    }}
                                                                    options={this.state.decisaoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.decisaoCarregando}
                                                                    placeholder={this.state.decisaoPlaceholder}
                                                                    styles={this.state.decisaoEstilo}
                                                                />
                                                                <Input 
                                                                    valid={ this.state.validacao.decisaoSelect === 'has-success' } 
                                                                    invalid={ this.state.validacao.decisaoSelect === 'has-danger' } 
                                                                    hidden
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col xs="12" md="3">
                                                            <FormGroup>
                                                                <Label htmlFor="decisaoDataRecepcao">Data de Recepção</Label>
                                                                <Input 
                                                                    type="date"
                                                                    id="decisaoDataRecepcao" 
                                                                    name="decisaoDataRecepcao" 
                                                                    required 
                                                                    value={this.state.decisaoDataRecepcao}
                                                                    onChange={(event) => {
                                                                        this.handleChange(event)
                                                                        this.validaDecisaoDataRecepcao(event)
                                                                    }}
                                                                    valid={ this.state.validacao.decisaoDataRecepcao === 'has-success' } 
                                                                    invalid={ this.state.validacao.decisaoDataRecepcao === 'has-danger' } 
                                                                />
                                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs="12" md="12">
                                                            <FormGroup>
                                                                <Label htmlFor="decisaoDescricao">Descrição</Label>
                                                                <Input 
                                                                    type="text" 
                                                                    id="decisaoDescricao" 
                                                                    name="decisaoDescricao"
                                                                    required 
                                                                    value={this.state.decisaoDescricao}
                                                                    onChange={this.handleChange}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    {/* <Row>
                                                        <Col xs="12" md="4">
                                                            <FormGroup>
                                                                <Label htmlFor="movimentacao">Movimentação</Label>
                                                                <Select
                                                                    id="movimentacao"
                                                                    name="movimentacao"
                                                                    value={this.state.movimentacaoSelecionada}
                                                                    onChange={(event) => { 
                                                                        this.validaMovimentacao(event)
                                                                        this.handleMovimentacaoSelectChange(event)
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
                                                                        this.handleChange(event)
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
                                                                        this.handleChange(event)
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
                                                                        this.handleProdutoSelectChange(event)
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
                                                                        this.handleFainaSelectChange(event)
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
                                                                        this.handleClienteSelectChange(event)
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
                                                    </Row> */}

                                                    <Row>
                                                        <Col xs="12" className="botao-centro">
                                                            <Button 
                                                                type="button" 
                                                                color="primary" 
                                                                size="sm"
                                                                onClick={this.handleAdicionarProducao}
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
                                                                        <th>Depósito Integral</th>
                                                                        <th>Indicativo de Decisão</th>
                                                                        <th>Data de Recepção</th>
                                                                        <th>Descrição</th>
                                                                        <th>Excluir</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>                                                                    
                                                                {/* {this.state.decisaoLista.map((linha, idx) => (
                                                                    <tr key={idx}>                                                                        
                                                                        <td>{linha.movimentacao.label}</td>
                                                                        <td>{linha.producao}</td>
                                                                        <td>{linha.tonelagem}</td>
                                                                        <td>{linha.produto.label}</td>
                                                                        <td>{linha.faina.label}</td>
                                                                        <td>{linha.cliente.label}</td>
                                                                        <td>
                                                                            <i 
                                                                                className="fa fa-trash fa-lg btn-acao" 
                                                                                id={idx} 
                                                                                onClick={this.handleRemoverProducao}
                                                                            ></i>
                                                                        </td>
                                                                    </tr>
                                                                ))} */}
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
                                            ((this.props.tipo === "requisicao") && this.ehEdicao()) ? 
                                            "3" : 
                                            (
                                                (this.props.tipo === "requisicao") ? 
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
                                    
                                    {(this.props.tipo === "requisicao") &&
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
                                    <Col xs="12" md={(this.props.tipo === "requisicao") ? "3" : "4"} className="botao-centro">
                                        <Button type="button" color="primary" onClick={this.alternarModelExclusao}><i className="fa fa-trash"></i> Excluir</Button>
                                    </Col>
                                    }

                                    <Col xs="12" md={
                                        (
                                            ((this.props.tipo === "requisicao") && this.ehEdicao()) ? 
                                            "3" : 
                                            (
                                                (this.props.tipo === "requisicao") ? 
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

                <Modal 
                    isOpen={this.state.exibeModelResumo} 
                    toggle={this.alternarModelResumo}
                    className={'modal-requisicao modal-primary modal-lg ' + this.props.className}
                >
                    <ModalHeader 
                        toggle={this.alternarModelResumo}>
                            Requisição de Mão de Obra de Trabalhador Portuário Avulso
                    </ModalHeader>
                    <ModalBody>

                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="requisitante" className="label-requisicao">REQUISITANTE</Label>
                                    <p className="form-control-static">
                                        {this.props.nomeUsuario}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="4">
                                <FormGroup>
                                    <Label htmlFor="porto" className="label-requisicao">PORTO</Label>
                                    <p className="form-control-static">
                                        {(this.state.portoSelecionado !== null) ? this.state.portoSelecionado.label : ""}
                                    </p>
                                </FormGroup>
                            </Col>
                            <Col xs="4">
                                <FormGroup>
                                    <Label htmlFor="cais" className="label-requisicao">CAIS</Label>
                                    <p className="form-control-static">
                                        {(this.state.caisSelecionado !== null) ? this.state.caisSelecionado.label : ""}
                                    </p>
                                </FormGroup>
                            </Col>
                            <Col xs="4">
                                <FormGroup>
                                    <Label htmlFor="berco" className="label-requisicao">BERÇO</Label>
                                    <p className="form-control-static">
                                    {(this.state.bercoSelecionado !== null) ? this.state.bercoSelecionado.label : ""}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="6">
                                <FormGroup>
                                    <Label htmlFor="navio" className="label-requisicao">NAVIO</Label>
                                    <p className="form-control-static">
                                        {(this.state.navioSelecionado !== null) ? this.state.navioSelecionado.label : ""}
                                    </p>
                                </FormGroup>
                            </Col>
                            <Col xs="6">
                                <FormGroup>
                                    <Label htmlFor="lloyd" className="label-requisicao">LLOYD</Label>
                                    <p className="form-control-static">
                                        {(this.state.navioSelecionado !== null) ? this.state.navioSelecionado.lloyd : ""}
                                    </p>
                                </FormGroup>
                            </Col>                            
                        </Row>

                        <Row>
                            <Col xs="6">
                                <FormGroup>
                                    <Label htmlFor="data_operacao" className="label-requisicao">DATA DE OPERAÇÃO</Label>
                                    <p className="form-control-static">
                                        {converteDataParaBr(this.state.dataOperacao)}
                                    </p>
                                </FormGroup>
                            </Col>
                            <Col xs="6">
                                <FormGroup>
                                    <Label htmlFor="turno" className="label-requisicao">TURNO</Label>
                                    <p className="form-control-static">
                                        {(this.state.turnoSelecionado !== null) ? this.state.turnoSelecionado.label : ""}
                                    </p>
                                </FormGroup>
                            </Col>  
                        </Row>

                        <Row>                          
                            <Col xs="6">
                                <FormGroup>
                                    <Label htmlFor="quantidade_terno" className="label-requisicao">QTD TERNO</Label>
                                    <p className="form-control-static">
                                        {this.state.quantidadeTerno}
                                    </p>
                                </FormGroup>
                            </Col>
                            {(this.state.programacaoNavio.length > 0) &&
                            <Col xs="6">
                                <FormGroup>
                                    <Label htmlFor="programacao_navio" className="label-requisicao">PROGRAMAÇÃO DO NAVIO</Label>
                                    <p className="form-control-static">
                                        {this.state.programacaoNavio}
                                    </p>
                                </FormGroup>
                            </Col>
                            }
                        </Row>

                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="operacao" className="label-requisicao">OPERAÇÃO</Label>                                    
                                    <Table responsive bordered size="sm">
                                        <tbody>
                                        {this.state.listaProducao.map((linha, idx) => (
                                            <tr key={idx}>
                                                <th scope="row">
                                                    {idx+1}
                                                </th>
                                                <td>
                                                    {linha.movimentacao.descricaoAbreviada} ({linha.producao} UN./{linha.tonelagem} TON.) {linha.produto.nomeAbreviado} ({linha.faina.numero}) {linha.faina.label}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Col>
                        </Row>

                        {(this.state.listaConferente.length > 0) &&
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="operacao" className="label-requisicao">CONFERENTE</Label>
                                    <Table responsive bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Terno</th>                                                
                                                <th>Função</th>
                                                <th>Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.exibeListaFuncoes(this.state.listaConferente)}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Col>
                        </Row>
                        }

                        {(this.state.listaEstivador.length > 0) &&
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="operacao" className="label-requisicao">ESTIVADOR</Label>
                                    <Table responsive bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Terno</th>                                                
                                                <th>Função</th>
                                                <th>Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.exibeListaFuncoes(this.state.listaEstivador)}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Col>
                        </Row>
                        }

                        {(this.state.listaCapatazia.length > 0) &&
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="operacao" className="label-requisicao">CAPATAZIA</Label>
                                    <Table responsive bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Terno</th>                                                
                                                <th>Função</th>
                                                <th>Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.exibeListaFuncoes(this.state.listaCapatazia)}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Col>
                        </Row>
                        }

                        {(this.state.listaArrumador.length > 0) &&
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="operacao" className="label-requisicao">ARRUMADOR</Label>
                                    <Table responsive bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Terno</th>                                                
                                                <th>Função</th>
                                                <th>Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.exibeListaFuncoes(this.state.listaArrumador)}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Col>
                        </Row>
                        }

                        {(this.state.listaVigia.length > 0) &&
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="operacao" className="label-requisicao">VIGIA</Label>
                                    <Table responsive bordered size="sm">
                                        <thead>
                                            <tr>
                                                <th>Terno</th>                                                
                                                <th>Função</th>
                                                <th>Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.exibeListaFuncoes(this.state.listaVigia)}
                                        </tbody>
                                    </Table>
                                </FormGroup>
                            </Col>
                        </Row>
                        }

                        {(this.state.observacao !== "") && (this.state.observacao !== null) &&
                        <Row>
                            <Col xs="12">
                                <FormGroup>
                                    <Label htmlFor="observacao" className="label-requisicao">Observação</Label>
                                    <p className="form-control-static">
                                        {this.state.observacao}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.aoConfirmarResumo}>
                            <i className="fa fa-thumbs-up"></i> Confirmar
                        </Button>{' '}
                        <Button color="secondary" onClick={this.aoCancelarResumo}>
                            <i className="fa fa-thumbs-down"></i> Cancelar
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal 
                    isOpen={this.state.exibeModelModelo} 
                    toggle={this.alternarModelModelo}
                    className={'modal-primary ' + this.props.className}
                >
                    <ModalHeader toggle={this.alternarModelModelo}>{((this.props.tipo === "requisicao") ? "Salvar como" : (this.ehEdicao() ? "Editar" : "Novo"))} Modelo</ModalHeader>
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
                                    this.handleChange(event) 
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
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir {(this.props.tipo === "requisicao") ? "Requisição" : "Modelo"}</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir {(this.props.tipo === "requisicao") ? "a requisição" : "o modelo"}?
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

export default ProcessoForm;
