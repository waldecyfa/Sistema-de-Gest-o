import React, { Component } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    CardFooter,
    Col, 
    Row,
    Button,

    Form,
    FormGroup,
    Label,
    Input,

    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    
    FormFeedback,
} from 'reactstrap';
import Carregando from '../../Alerta/Carregando';
import Sucesso from '../../Alerta/Sucesso';
import Erro from '../../Alerta/Erro';
import { createHashHistory } from 'history';
import { isNull } from 'util';
import {
    getApiAutenticado
} from '../../Oauth';
import Select from 'react-select';
import { 
    getEstiloInvalido,
    getEstiloValido,
} from '../../../components/Select';
import TabelaRemota from '../../../components/Lista/TabelaRemota';
import Tabela from '../../../components/Lista/Tabela';
import debounce from 'lodash.debounce';
import AsyncSelect from 'react-select/lib/Async';

class FuncaoForm extends Component {

    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);

        // Delay action 1 second
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000);
            
        this.state = {     
            
            id: 0, 
            nome: "",
            nomeMsgErro: "Campo obrigatório",
            funcaoUrl: "",
            funcaoServicoUrl: "",
            menuFuncaoUrl: "",
            
            /**
             * VALIDAÇÃO
             */
            validacao: {
                nome: 'has-danger',
                idModelo: 'has-danger',
                idServico: 'has-danger',
                idMenu: 'has-danger',
            }, 

            carregandoExibe: false,
            erroMensagem: '',
            erroExibe: false,
            sucessoExibe: false,

            exibeModelExclusao: false,       

            idModelo: null, 
            idModeloOpcoes: [],
            idModeloCarregando: false,
            idModeloPlaceholder: "Selecione um modelo",
            idModeloEstilo: getEstiloInvalido(),

            idServico: null,
            idServicoOpcoes: [],            
            idServicoPlaceholder: "Selecione um serviço",
            idServicoEstilo: getEstiloInvalido(),

            idMenu: null, 
            idMenuOpcoes: [],
            idMenuCarregando: false,
            idMenuPlaceholder: "Digite e selecione um menu",
            idMenuEstilo: getEstiloInvalido(),
            idMenuMsgErro: "Campo obrigatório",

            listaServico: [],
            listaMenu: [],
            busca: '',
            sortField: 'idModelo.nome',
            sortOrder: 'asc',
            pageNumber: 1,
            pageSize: 20,
            pageTotalElements: 0,
            pageTotalPages: 0,
        };
    }

    ehEdicao() {
        if( (this.props.id !== "") && (this.props.id !== null) && (this.props.id > 0) ) {
            return true;
        }
        else {
            return false;
        }
    }

    /***********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {
        if(this.ehEdicao()) {
            this.getFuncao();            
        }
    }

    validaNome(event) {
        
        const { validacao } = this.state;
        let nomeMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.nome = 'has-danger';
            nomeMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value.length > 0) && (event.target.value.length < 3)) {
            validacao.nome = 'has-danger';
            nomeMsgErro = "Deve possuir entre 3 a 50 caracteres";
        }
        else {
            validacao.nome = 'has-success';
        }

        this.setState({ validacao, nomeMsgErro });
    }

    validaIdModelo(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.idModelo = 'has-danger';
        }
        else {
            validacao.idModelo = 'has-success';
        }

        this.setState({ validacao })
    }

    validaIdServico(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.idServico = 'has-danger';
        }
        else {
            validacao.idServico = 'has-success';
        }

        this.setState({ validacao })
    }

    validaIdMenu(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.idMenu = 'has-danger';
        }
        else {
            validacao.idMenu = 'has-success';
        }

        this.setState({ validacao })
    }

    aoMudar = (event) => {

        this.setState({ [event.target.name]: event.target.value} );
    }

    aoMudarIdModelo = (event) => {
        
        if( isNull(event)) {
            this.setState({ 
                idModelo: null,
                idModeloEstilo: getEstiloInvalido(),
                idServico: null,
                idServicoOpcoes: [],
                idServicoEstilo: getEstiloInvalido()
            });
        }
        else {
            this.setState({ 
                idModelo: event,
                idModeloEstilo: getEstiloValido()
            }, () => {
                this.getListaServico();
            }); 
        }
    }

    aoMudarIdServico = (event) => {
        
        if( isNull(event)) {
            this.setState({ 
                idServico: null,
                idServicoEstilo: getEstiloInvalido()
            });
        }
        else {
            this.setState({ 
                idServico: event,
                idServicoEstilo: getEstiloValido()
            }); 
        }
    }

    aoMudarIdMenu = (event) => {

        if( isNull(event)) {
            this.setState({ 
                idMenu: null,
                idMenuEstilo: getEstiloInvalido(),
            });
        }
        else {
            this.setState({ 
                idMenu: event,
                idMenuEstilo: getEstiloValido()
            }); 
        }
    }

    aoAdicionar = () => {

        if (
            (this.state.validacao.idModelo === 'has-success') &&
            (this.state.validacao.idServico === 'has-success')
        ) {
            const existeServico = this.state.listaServico.find(x => x.idServico.value === this.state.idServico.value);

            if( (existeServico === undefined) || (existeServico === 0) ) {

                this.postFuncaoServico();                
            }
            else {
                this.erroExisteServico();
            }
        }
        else {
            this.erroAdicionarServico();
        }
    }

    aoAdicionarMenu = () => {

        if (this.state.validacao.idMenu === 'has-success') {
            const existeMenu = this.state.listaMenu.find(x => x.idMenu.value === this.state.idMenu.value);

            if( (existeMenu === undefined) || (existeMenu === 0) ) {

                this.postMenuFuncao();                
            }
            else {
                this.erroExisteMenu();
            }
        }
        else {
            this.erroAdicionarMenu();
        }
    }


    adicionarTabela = () => {

        let novaListaServico = this.state.listaServico;

        novaListaServico.push({
            id: this.state.idServico.value,
            idModelo: this.state.idModelo,
            idServico: this.state.idServico,
            delete: this.getColunaExcluir(this.state.idServico.value, this.state.funcaoServicoUrl)
        });

        const novaListaServicoOrdenada = [].concat(novaListaServico)
            .sort( function(a, b) {
                if(a.idModelo.label + " " + a.idServico.label < b.idModelo.label + " " + b.idServico.label) { return -1; }
                if(a.idModelo.label + " " + a.idServico.label > b.idModelo.label + " " + b.idServico.label) { return 1; }
                return 0;
            })

        const { validacao } = this.state;
        validacao.idModelo = 'has-danger';
        validacao.idServico = 'has-danger';

        this.setState({
            listaServico: novaListaServicoOrdenada,

            idModelo: null,
            idModeloEstilo: getEstiloInvalido(),
            idServico: null,
            idServicoOpcoes: [],
            idServicoEstilo: getEstiloInvalido(),

            validacao,
        });           
    }

    adicionarTabelaMenu = () => {

        let novaListaMenu = this.state.listaMenu;
       
        novaListaMenu.push({
            id: this.state.idMenu.id,
            url: this.state.idMenu.link,
            idMenu: {
                value: this.state.idMenu.value,
                label: this.state.idMenu.label,
                url: this.state.idMenu.url,
                idMenuPai: this.state.idMenu.idMenuPai,
            },
            delete: this.getColunaExcluirMenu(this.state.idMenu.value, this.state.menuFuncaoUrl)
        });

        const novaListaMenuOrdenada = [].concat(novaListaMenu)
            .sort( function(a, b) {
                if(a.idMenu.label < b.idMenu.label) { return -1; }
                if(a.idMenu.label > b.idMenu.label) { return 1; }
                return 0;
            })

        const { validacao } = this.state;
        validacao.idMenu = 'has-danger';

        this.setState({
            listaMenu: novaListaMenuOrdenada,

            idMenu: null,
            idMenuOpcoes: [],
            idMenuEstilo: getEstiloInvalido(),

            validacao,
        });           
    }

    erroAdicionarServico() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de adicioná-los.',
            erroExibe: true,
        });
    }

    erroAdicionarMenu() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente o campo do formulário antes de adicioná-lo.',
            erroExibe: true,
        });
    }

    erroExisteServico() {

        this.setState({ 
            erroMensagem: 'Esse serviço já foi vínculado à função.',
            erroExibe: true,
        });
    }

    erroExisteMenu() {

        this.setState({ 
            erroMensagem: 'Esse menu já foi vínculado à função.',
            erroExibe: true,
        });
    }

    aoRemover = (event) => {

        const listaServico = [...this.state.listaServico];
        const novaLista = listaServico.filter(x => x.idServico.value !== parseInt(event.currentTarget.id) );

        const funcaoServicoUrl = event.target.getAttribute('url');

        this.setState({ 
            listaServico: novaLista,
            funcaoServicoUrl: funcaoServicoUrl,
        }, () => {
            if(funcaoServicoUrl !== null) {
                this.deleteFuncaoServico();
            }
        });
    }

    aoRemoverMenu = (event) => {

        const listaMenu = [...this.state.listaMenu];
        const novaLista = listaMenu.filter(x => x.idMenu.value !== parseInt(event.currentTarget.id) );

        const menuFuncaoUrl = event.target.getAttribute('url');

        this.setState({ 
            listaMenu: novaLista,
            menuFuncaoUrl: menuFuncaoUrl,
        }, () => {
            if(menuFuncaoUrl !== null) {
                this.deleteMenuFuncao();
            }
        });
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
            this.getListaFuncaoServico();
        });
    }

    aoBuscar = (event) => {

        this.setState({ busca: event.target.value });

        this.onChangeDebounced(event);        
    }

    onChangeDebounced = () => {
        // Delayed logic goes here
        this.getListaFuncaoServico();
    }

    alternarModelExclusao = () => {
        this.setState({
            exibeModelExclusao: !this.state.exibeModelExclusao,
        });
    }

    toggle = () => {
        this.setState({ collapse: !this.state.collapse });
    }

    getColunaExcluir = (id, url) => {

        return (
            <i 
                className="fa fa-trash fa-lg btn-acao" 
                id={id}
                url={url} 
                onClick={this.aoRemover}
            ></i>
        )
    }

    getColunaExcluirMenu = (id, url) => {

        return (
            <i 
                className="fa fa-trash fa-lg btn-acao" 
                id={id}
                url={url} 
                onClick={this.aoRemoverMenu}
            ></i>
        )
    }

    aoPesquisarIdMenu = (event) => {

        const inputValue = event.replace(/\W/g, '');

        return inputValue;
    }

    carregarOpcoesIdMenu = (inputValue, callback) => {
        
        setTimeout(() => {
            this.getListaMenu(inputValue);
        }, 1000);

        setTimeout(() => {                        
            callback(this.state.idMenuOpcoes);
        }, 2000);
    }

    /************
     * GET LISTA MENU
     */
    getListaMenu = async (pesquisa) => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/menu/search/getPageableAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': "nome,asc",
                        'search': pesquisa
                    }
                }
            );

            if(response.ok) {

                let lista = [];
                if(this.ehEdicao() && (pesquisa === "")) {
                    lista.push(this.state.idMenu);
                }
            
                for (let i = 0; i < response.data._embedded.menu.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.menu[i].id,
                            value: response.data._embedded.menu[i].id,
                            label: response.data._embedded.menu[i].nome,
                            idMenuPai: (response.data._embedded.menu[i].idMenuPai === null) ? null : response.data._embedded.menu[i].idMenuPai.nome,
                            url: response.data._embedded.menu[i].url,
                            link: response.data._embedded.menu[i]._links.self.href,
                        },
                    );                    
                }

                this.setState({ 
                    idMenuOpcoes: lista,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de menus.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de menus.',
                erroExibe: true,
            });
        }
    }

     /**************
     * BOTÕES DE AÇÃO
     */

    aoSalvar = () => {

        if (this.state.validacao.nome === 'has-success') {

            // Confirma dados informados
            if( this.ehEdicao() ) {

                this.patchFuncao();
            }
            else {
                this.postFuncao();
            }
            
        }
        else {
            this.erroForm();
        }
    }

    aoExcluir = () => {

        this.alternarModelExclusao();

        this.deleteFuncao();
    }

    aoVoltar = () => {
        const history = createHashHistory();

        history.push('/seguranca/funcao/lista');
    }

    erroForm() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de continuar.',
            erroExibe: true,
        });
    }

    /*****************
     * GET FUNCAO
     */
    getFuncao = async () => {
        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/funcao/" + this.props.id,
                {},
                {
                    params: {
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok) {

                const validacao = {
                    nome: 'has-success',
                }

                this.setState({ 
                    nome: response.data.nome,
                    funcaoUrl: response.data._links.self.href,
                    validacao: validacao,
                }, () => {
                    this.getListaModelo();
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a função.',
                    erroExibe: true,
                });
            }                      
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a função.',
                erroExibe: true,
            });
        }
    }

    /************
     * GET LISTA MODELO
     */
    getListaModelo = async () => {
        try {

            this.setState({ 
                idModeloCarregando: true 
            })

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/modelo/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': 'nome,asc'
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.modelo.length; i++) {
                    
                    lista.push(
                        {
                            value: response.data._embedded.modelo[i].id,
                            label: response.data._embedded.modelo[i].nome,
                            url: response.data._embedded.modelo[i]._links.self.href,
                        },
                    );
                }
                    
                this.setState({ 
                    idModeloOpcoes: lista,
                    idModeloCarregando: false
                }, () => {
                    this.getListaFuncaoServico();
                    this.getListaMenuFuncao();
                })
            }
            else {
                this.setState({ 
                    idModeloCarregando: false,
                    erroMensagem: 'Não foi possível obter a lista de modelos.',
                    idModeloPlaceholder: "Erro ao carregar...",
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de modelos.',
                idModeloPlaceholder: "Erro ao carregar...",
                erroExibe: true,
            });
        }
    }

    /************
     * GET LISTA SERVICO
     */
    getListaServico = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/servico/search/getListaAtivosByIdModelo',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'idModelo': this.state.idModelo.value,
                        'sort': 'metodo,asc,uri,asc'
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.servico.length; i++) {
                    
                    lista.push(
                        {
                            value: response.data._embedded.servico[i].id,
                            label: response.data._embedded.servico[i].metodo + " - " + response.data._embedded.servico[i].uri,
                            metodo: response.data._embedded.servico[i].metodo,
                            uri: response.data._embedded.servico[i].uri,
                            url: response.data._embedded.servico[i]._links.self.href,
                        },
                    );                    
                }

                this.setState({ 
                    idServicoOpcoes: lista,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de serviços.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de serviços.',
                erroExibe: true,
            });
        }
    }

    /************
     * GET LISTA FUNCAO SERVICO
     */
    getListaFuncaoServico = async () => {
        try {

            if( !this.state.carregandoExibe ) {
                this.setState({ carregandoExibe: true });
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/funcaoServico/search/getListaAtivosByIdFuncao',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'idFuncao': this.props.id,
                        'sort': this.state.sortField + "," + this.state.sortOrder,
                        'search': this.state.busca,
                        'page': this.state.pageNumber - 1,
                        'size': this.state.pageSize
                    }
                }
            );

            if(response.ok) {

                let lista = [];                
            
                for (let i = 0; i < response.data._embedded.funcaoServico.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.funcaoServico[i].idServico.id,
                            url: response.data._embedded.funcaoServico[i]._links.self.href,
                            idModelo: {
                                value: response.data._embedded.funcaoServico[i].idServico.idModelo.id,
                                label: response.data._embedded.funcaoServico[i].idServico.idModelo.nome,
                                url: response.data._embedded.funcaoServico[i].idServico.idModelo._links.self.href,
                            },
                            idServico: {
                                value: response.data._embedded.funcaoServico[i].idServico.id,
                                label: response.data._embedded.funcaoServico[i].idServico.metodo + " - " + response.data._embedded.funcaoServico[i].idServico.uri,
                                metodo: response.data._embedded.funcaoServico[i].idServico.metodo,
                                uri: response.data._embedded.funcaoServico[i].idServico.uri,
                            },
                            delete: this.getColunaExcluir(response.data._embedded.funcaoServico[i].idServico.id, response.data._embedded.funcaoServico[i]._links.self.href)
                        },
                    );
                }

                const novaListaServicoOrdenada = [].concat(lista)
                    .sort( function(a, b) {
                        if(a.idModelo.label + " " + a.idServico.label < b.idModelo.label + " " + b.idServico.label) { return -1; }
                        if(a.idModelo.label + " " + a.idServico.label > b.idModelo.label + " " + b.idServico.label) { return 1; }
                        return 0;
                    })

                this.setState({ 
                    listaServico: novaListaServicoOrdenada,
                    pageNumber: response.data.page.number + 1,
                    pageSize: response.data.page.size,
                    pageTotalElements: response.data.page.totalElements,
                    pageTotalPages: response.data.page.totalPages,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de serviços.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de serviços.',
                erroExibe: true,
            });
        }
    }

    /************
     * GET LISTA MENU FUNCAO
     */
    getListaMenuFuncao = async () => {
        try {

            if( !this.state.carregandoExibe ) {
                this.setState({ carregandoExibe: true });
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/menuFuncao/search/getListaAtivosByIdFuncao',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'idFuncao': this.props.id,
                    }
                }
            );

            if(response.ok) {

                let lista = [];                
            
                for (let i = 0; i < response.data._embedded.menuFuncao.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.menuFuncao[i].idMenu.id,
                            url: response.data._embedded.menuFuncao[i]._links.self.href,
                            idMenu: {
                                value: response.data._embedded.menuFuncao[i].idMenu.id,
                                label: response.data._embedded.menuFuncao[i].idMenu.nome,
                                url: response.data._embedded.menuFuncao[i].idMenu.url,
                                idMenuPai: (response.data._embedded.menuFuncao[i].idMenu.idMenuPai === null) ? null : response.data._embedded.menuFuncao[i].idMenu.idMenuPai.nome,
                            },
                            delete: this.getColunaExcluirMenu(response.data._embedded.menuFuncao[i].idMenu.id, response.data._embedded.menuFuncao[i]._links.self.href)
                        },
                    );
                }

                const novaListaMenuOrdenada = [].concat(lista)
                    .sort( function(a, b) {
                        if(a.idMenu.label < b.idMenu.label) { return -1; }
                        if(a.idMenu.label > b.idMenu.label) { return 1; }
                        return 0;
                    })

                this.setState({ 
                    listaMenu: novaListaMenuOrdenada,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de menus.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de menus.',
                erroExibe: true,
            });
        }
    }

    postFuncaoServico = async () => {
        try {

            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/funcaoServico',
                {
                    idFuncao: this.state.funcaoUrl,
                    idServico: this.state.idServico.url,
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    funcaoServicoUrl: response.data._links.self.href,
                    carregandoExibe: false,
                    // sucessoMensagem: "O serviço foi vinculado a função!",
                    // sucessoExibe: true 
                }, () => {
                    this.adicionarTabela();
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível vincular o serviço à função.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o vinculo do serviço à função.",
                erroExibe: true,
            });
        }
    }

    postMenuFuncao = async () => {
        try {

            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/menuFuncao',
                {
                    idFuncao: this.state.funcaoUrl,
                    idMenu: this.state.idMenu.link,
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    menuFuncaoUrl: response.data._links.self.href,
                    carregandoExibe: false,
                }, () => {
                    this.adicionarTabelaMenu();
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível vincular o menu à função.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o vinculo do menu à função.",
                erroExibe: true,
            });
        }
    }

    deleteFuncaoServico = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);            

            // start making calls
            const response = await api.delete(
                this.state.funcaoServicoUrl,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    // sucessoMensagem: "O serviço foi desvinculado da função!",
                    // sucessoExibe: true 
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível desvincular o serviço da função.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar o desvinculo do serviço com a função.",
                erroExibe: true,
            });
        }
    }

    deleteMenuFuncao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);            

            // start making calls
            const response = await api.delete(
                this.state.menuFuncaoUrl,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível desvincular o menu da função.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar o desvínculo do menu com a função.",
                erroExibe: true,
            });
        }
    }

    /*********************
     * POST, PATCH E DELETE
     */

    postFuncao = async () => {
        try {

            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/funcao',
                {
                    nome: this.state.nome
                },
            );


            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A função foi salva!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar a função.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio da função.",
                erroExibe: true,
            });
        }
    }
    
    patchFuncao = async () => {

        try {            

            this.setState({ carregandoExibe: true });
           
            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/funcao/' + this.props.id,
                {
                    nome: this.state.nome
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A função foi editada!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar a função.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio da função.",
                erroExibe: true,
            });
        }
    }

    deleteFuncao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.delete(
                "/funcao/" + this.props.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "A função foi excluída!",
                    sucessoExibe: true 
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível excluir a função.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a exclusão da função.",
                erroExibe: true,
            });
        }
    }


    /************
     * RENDER
     */
    render() {
               
        const colunas = [
            {
                dataField: 'id',
                text: 'Id',
                // sort: true,
                hidden: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'idModelo.label',
                text: 'Modelo',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'idServico.metodo',
                text: 'Método',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'idServico.uri',
                text: 'Uri',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'delete',
                text: 'Excluir',
                headerAlign: 'center',
                align: 'center',
            }
        ];

        const colunasMenu = [
            {
                dataField: 'id',
                text: 'Id',
                // sort: true,
                hidden: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'idMenu.label',
                text: 'Menu',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'idMenu.url',
                text: 'URL',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'idMenu.idMenuPai',
                text: 'Menu Pai',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'delete',
                text: 'Excluir',
                headerAlign: 'center',
                align: 'center',
            }
        ];

        return (

            <div className="animated fadeIn">

                <Row>
                    <Col xs="12" md="12">
                        <Card>
                            <CardHeader>
                                <i className={this.ehEdicao() ? "fa fa-pencil" : "fa fa-file"}></i> {this.props.titulo}
                            </CardHeader>

                            <CardBody>
                                <Form>                                
                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="nome">Nome</Label>
                                                <Input 
                                                    type="text" 
                                                    minLength="3"
                                                    maxLength="50"
                                                    id="nome" 
                                                    name="nome"
                                                    required 
                                                    autoFocus
                                                    value={this.state.nome}
                                                    onChange={(event) => { 
                                                        this.validaNome(event)
                                                        this.aoMudar(event)
                                                    }}
                                                    valid={ this.state.validacao.nome === 'has-success' } 
                                                    invalid={ this.state.validacao.nome === 'has-danger' } 
                                                />
                                                <FormFeedback>{this.state.nomeMsgErro}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>                                                            
                            </CardBody>

                            <CardFooter>
                                <Row>
                                    <Col xs="12" md={this.ehEdicao() ? "4" : "6"} className="botao-centro">
                                        <Button 
                                            type="button" 
                                            color="primary" 
                                            onClick={this.aoSalvar}
                                        >
                                            <i className="fa fa-floppy-o"></i> Salvar
                                        </Button>
                                    </Col>                                                                  

                                    {(this.ehEdicao()) &&
                                    <Col xs="12" md="4" className="botao-centro">
                                        <Button type="button" color="primary" onClick={this.alternarModelExclusao}><i className="fa fa-trash"></i> Excluir</Button>
                                    </Col>
                                    }

                                    <Col xs="12" md={this.ehEdicao() ? "4" : "6"} className="botao-centro">
                                        <Button type="button" color="primary" onClick={this.aoVoltar}><i className="fa fa-undo"></i> Voltar</Button>
                                    </Col>
                                </Row>
                            </CardFooter>
                        </Card>
                    </Col>                    
                </Row>    

                { this.ehEdicao() &&
                    <Row>
                        <Col xs="12" md="12">
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-cubes"></i> Serviços Vinculados
                                </CardHeader>
                                <CardBody>
                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="idModelo">Modelo</Label>
                                                <Select
                                                    id="idModelo"
                                                    name="idModelo"
                                                    value={this.state.idModelo}
                                                    onChange={(event) => { 
                                                        this.validaIdModelo(event)
                                                        this.aoMudarIdModelo(event)
                                                    }}
                                                    options={this.state.idModeloOpcoes}
                                                    required
                                                    isClearable
                                                    isLoading={this.state.idModeloCarregando}
                                                    placeholder={this.state.idModeloPlaceholder}
                                                    styles={this.state.idModeloEstilo}
                                                />
                                                <Input 
                                                    valid={ this.state.validacao.idModelo === 'has-success' } 
                                                    invalid={ this.state.validacao.idModelo === 'has-danger' } 
                                                    hidden
                                                />
                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="idServico">Serviço</Label>
                                                <Select
                                                    id="idServico"
                                                    name="idServico"
                                                    value={this.state.idServico}
                                                    onChange={(event) => { 
                                                        this.validaIdServico(event)
                                                        this.aoMudarIdServico(event)
                                                    }}
                                                    options={this.state.idServicoOpcoes}
                                                    required
                                                    isClearable
                                                    isLoading={this.state.idServicoCarregando}
                                                    placeholder={this.state.idServicoPlaceholder}
                                                    styles={this.state.idServicoEstilo}
                                                />
                                                <Input 
                                                    valid={ this.state.validacao.idServico === 'has-success' } 
                                                    invalid={ this.state.validacao.idServico === 'has-danger' } 
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
                                                onClick={this.aoAdicionar}
                                            >
                                                <i className="fa fa-plus-square"></i> Adicionar
                                            </Button>
                                        </Col>
                                    </Row>

                                    <hr/>

                                    <Row>
                                        <Col xs="12" className="botao-centro">
                                            <TabelaRemota 
                                                lista={ this.state.listaServico } 
                                                colunas={ colunas }
                                                className={"table-sm"}

                                                loading={this.state.carregandoExibe}

                                                busca={this.state.busca}
                                                aoBuscar={(event) => this.aoBuscar(event)}

                                                pageNumber={ this.state.pageNumber }
                                                pageSize={ this.state.pageSize }
                                                pageTotalElements={ this.state.pageTotalElements }
                                                pageTotalPages={ this.state.pageTotalPages }
                                                aoMudarTabela={ this.aoMudarTabela }
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }

                { this.ehEdicao() &&
                    <Row>
                        <Col xs="12" md="12">
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-bars"></i> Menus Vinculados
                                </CardHeader>
                                <CardBody>
                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="idMenu">Menu</Label>
                                                <AsyncSelect
                                                    loadOptions={this.carregarOpcoesIdMenu}
                                                    value={this.state.idMenu}
                                                    id="idMenu"
                                                    name="idMenu"
                                                    placeholder={this.state.idMenuPlaceholder}
                                                    isLoading={this.state.idMenuCarregando}
                                                    isClearable
                                                    styles={this.state.idMenuEstilo}
                                                    onChange={(event) => {
                                                        this.aoMudarIdMenu(event)
                                                        this.validaIdMenu(event)
                                                    }}
                                                    onInputChange={this.aoPesquisarIdMenu}
                                                />
                                                <Input
                                                    type="hidden"
                                                    name="idMenuValidacao"
                                                    id="idMenuValidacao"
                                                    value={this.state.idMenu ? this.state.idMenu.value : ''}
                                                    valid={this.state.idMenu ? true : false}
                                                    invalid={!this.state.idMenu ? true : false}
                                                    required
                                                />                                            
                                                <FormFeedback>{this.state.idMenuMsgErro}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs="12" className="botao-centro">
                                            <Button 
                                                type="button" 
                                                color="primary" 
                                                size="sm"
                                                onClick={this.aoAdicionarMenu}
                                            >
                                                <i className="fa fa-plus-square"></i> Adicionar
                                            </Button>
                                        </Col>
                                    </Row>

                                    <hr/>

                                    <Row>
                                        <Col xs="12" className="botao-centro">
                                            <Tabela 
                                                lista={ this.state.listaMenu } 
                                                colunas={ colunasMenu }
                                                className={"table-sm"}
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }                       

                <Modal 
                    isOpen={this.state.exibeModelExclusao} 
                    toggle={this.alternarModelExclusao}
                    className={'modal-primary ' + this.props.className}
                >
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir Função</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir a função?
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

export default FuncaoForm;
