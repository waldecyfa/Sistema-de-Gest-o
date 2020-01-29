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
    FormText,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import Carregando from '../../Alerta/Carregando';
import Sucesso from '../../Alerta/Sucesso';
import Erro from '../../Alerta/Erro';
import { createHashHistory } from 'history';
import { isNull } from 'util';
import {
    getApiAutenticado
} from '../../Oauth';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { 
    getEstiloInvalido,
    getEstiloValido,
} from '../../../components/Select';
import Tabela from '../../../components/Lista/Tabela';


class UsuarioForm extends Component {

    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);
            
        this.state = {     
            
            id: 0, 
            username: "",            
            usernameMsgErro: "Campo obrigatório",

            perfil: null, 
            perfilOpcoes: [],
            perfilCarregando: false,
            perfilPlaceholder: "Selecione um perfil",
            perfilEstilo: getEstiloInvalido(),

            usuarioPerfilUrl: "",

            idPessoa: null, 
            idPessoaOpcoes: [],
            idPessoaCarregando: false,
            idPessoaPlaceholder: "Selecione uma pessoa",
            idPessoaEstilo: getEstiloInvalido(),
            
            /**
             * VALIDAÇÃO
             */
            validacao: {

                username: 'has-danger',
                perfil: 'has-danger',
                idPessoa: 'has-danger',

                idFuncao: 'has-danger',
            }, 

            idFuncao: null, 
            idFuncaoOpcoes: [],
            idFuncaoCarregando: false,
            idFuncaoPlaceholder: "Selecione uma função",
            idFuncaoEstilo: getEstiloInvalido(),

            novaFuncao: null,
            acessoCompleto: false,            

            listaFuncao: [],

            carregandoExibe: false,
            erroMensagem: '',
            erroExibe: false,
            sucessoExibe: false,

            exibeModelExclusao: false,       
        };
    }

    ehEdicao() {

        if( (this.props.id !== "") && (this.props.id !== null) && (this.props.id.length > 0) ) {
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
            this.getUsuario();
        }
        else {
            this.getListaPerfil();
        }
    }

    validaUsername(event) {
        
        const { validacao } = this.state;
        let usernameMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.username = 'has-danger';
            usernameMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value.length < 3 ) || (event.target.value.length > 50)) {
            validacao.username = 'has-danger';
            usernameMsgErro = "Deve possuir entre 3 a 50 caracteres";
        }
        else if (!/^[a-zA-Z0-9].+@[a-zA-Z0-9].+\.[A-Za-z]+$/.test(event.target.value)) {
            validacao.username = 'has-danger';
            usernameMsgErro = "Formato inválido";
        }
        else {
            validacao.username = 'has-success';
        }

        this.setState({ validacao, usernameMsgErro });
    }

    aoMudar = (event) => {

        this.setState({ [event.target.name]: event.target.value} );
    }

    validaPerfil(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.perfil = 'has-danger';
        }
        else {
            validacao.perfil = 'has-success';
        }

        this.setState({ validacao })
    }

    aoMudarPerfil = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('perfilEstilo');
            this.setState({ 
                perfil: null,
            });
        }
        else {
            this.setSelectValido('perfilEstilo');
            this.setState({ 
                perfil: event,
            }); 
        }
    }

    aoSelecionarIdPessoa = (event) => {        

        if( isNull(event)) {
            this.setSelectInvalido('idPessoaEstilo');
            this.setState({ 
                idPessoa: null
            });
        }
        else {
            this.setSelectValido('idPessoaEstilo');
            this.setState({ 
                idPessoa: event
            });
        }
    }

    aoPesquisarIdPessoa = (event) => {

        const inputValue = event.replace(/\W/g, '');
        // this.setState({ reuPesquisa: (inputValue === null ? '' : inputValue) });

        return inputValue;
    };

    carregarOpcoesIdPessoa = (inputValue, callback) => {
        
        setTimeout(() => {
            this.getListaPessoa(inputValue);
        }, 1000);

        setTimeout(() => {                        
            callback(this.state.idPessoaOpcoes);            
        }, 2000);
    };
    
    validaIdFuncao(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.idFuncao = 'has-danger';
        }
        else {
            validacao.idFuncao = 'has-success';
        }

        this.setState({ validacao })
    }

    aoMudarIdFuncao = (event) => {
        
        if( isNull(event)) {
            this.setState({ 
                idFuncao: null,
                idFuncaoEstilo: getEstiloInvalido(),
            });
        }
        else {
            this.setState({ 
                idFuncao: event,
                idFuncaoEstilo: getEstiloValido()
            }); 
        }
    }

    aoMudarSwitch = () => {

        this.setState({
            acessoCompleto: !this.state.acessoCompleto
        });
    }

    setSelectInvalido(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloInvalido() });
    }

    setSelectValido(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloValido() });
    }

    alternarModelExclusao = () => {
        this.setState({
            exibeModelExclusao: !this.state.exibeModelExclusao,
        });
    }

    aoAdicionar = () => {

        if ( this.state.validacao.idFuncao === 'has-success') {
            const existeFuncao = this.state.listaFuncao.find(x => x.idFuncao.value === this.state.idFuncao.value);

            if( (existeFuncao === undefined) || (existeFuncao === 0) ) {

                this.postUsuarioPerfilFuncao();
            }
            else {
                this.erroExisteFuncao();
            }
        }
        else {
            this.erroAdicionarFuncao();
        }
    }

    adicionarTabela = () => {
                
        let novaListaFuncao = this.state.listaFuncao;

        novaListaFuncao.push({
            id: this.state.idFuncao.value,
            idFuncao: this.state.idFuncao,
            acessoCompleto: this.state.acessoCompleto ? <i className="fa fa-check" aria-hidden="true"></i> : <i className="fa fa-times" aria-hidden="true"></i>,
            delete: this.getColunaExcluir(this.state.idFuncao.value, this.state.usuarioPerfilFuncaoUrl)
        });

        const novaListaFuncaoOrdenada = [].concat(novaListaFuncao)
            .sort( function(a, b) {
                if(a.idFuncao.label < b.idFuncao.label) { return -1; }
                if(a.idFuncao.label > b.idFuncao.label) { return 1; }
                return 0;
            })

        const { validacao } = this.state;
        validacao.idFuncao = 'has-danger';

        this.setState({
            listaFuncao: novaListaFuncaoOrdenada,

            idFuncao: null,
            idFuncaoEstilo: getEstiloInvalido(),
            acessoCompleto: false,

            validacao,
        });
    }

    erroAdicionarFuncao() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de adicioná-los.',
            erroExibe: true,
        });
    }

    erroExisteFuncao() {

        this.setState({ 
            erroMensagem: 'Essa função já foi vínculada ao usuário.',
            erroExibe: true,
        });
    }

    aoRemover = (event) => {

        const listaFuncao = [...this.state.listaFuncao];
        const novaLista = listaFuncao.filter(x => x.idFuncao.value !== parseInt(event.currentTarget.id) );

        const usuarioPerfilFuncaoUrl = event.target.getAttribute('url');

        this.setState({ 
            listaFuncao: novaLista,
            usuarioPerfilFuncaoUrl: usuarioPerfilFuncaoUrl,
        }, () => {
            if(usuarioPerfilFuncaoUrl !== null) {
                this.deleteUsuarioPerfilFuncao();
            }
        });
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

    /************
     * GET LISTA FUNCAO
     */
    getListaFuncao = async () => {
        try {

            if( !this.state.carregandoExibe ) {
                this.setState({ carregandoExibe: true })
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/funcao/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': "nome,asc"
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.funcao.length; i++) {
                    
                    lista.push(
                        {
                            url: response.data._embedded.funcao[i]._links.self.href,
                            value: response.data._embedded.funcao[i].id,                            
                            label: response.data._embedded.funcao[i].nome,
                        },
                    );
                }

                this.setState({ 
                    idFuncaoOpcoes: lista,
                }, () => {
                    this.getListaUsuarioPerfilFuncao();
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de funções.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de funções.',
                erroExibe: true,
            });
        }
    }

    /************
     * GET LISTA USUARIO PERFIL FUNÇÃO
     */
    getListaUsuarioPerfilFuncao = async () => {
        try {

            if( !this.state.carregandoExibe ) {
                this.setState({ carregandoExibe: true });
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/usuarioPerfilFuncao/search/getListaAtivosByUsernameAndPerfil',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'username': this.state.username,
                        'perfil': this.state.perfil.nome,
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.usuarioPerfilFuncao.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.usuarioPerfilFuncao[i].idFuncao.id,
                            url: response.data._embedded.usuarioPerfilFuncao[i]._links.self.href,
                            idFuncao: {
                                value: response.data._embedded.usuarioPerfilFuncao[i].idFuncao.id,
                                label: response.data._embedded.usuarioPerfilFuncao[i].idFuncao.nome,
                                url: response.data._embedded.usuarioPerfilFuncao[i].idFuncao._links.self.href,
                            },             
                            acessoCompleto: (response.data._embedded.usuarioPerfilFuncao[i].acessoCompleto === "S") ? <i className="fa fa-check" aria-hidden="true"></i> : <i className="fa fa-times" aria-hidden="true"></i>,
                            delete: this.getColunaExcluir(response.data._embedded.usuarioPerfilFuncao[i].idFuncao.id, response.data._embedded.usuarioPerfilFuncao[i]._links.self.href)
                        },
                    );
                }

                const novaListaFuncaoOrdenada = [].concat(lista)
                    .sort( function(a, b) {
                        if(a.idFuncao.label < b.idFuncao.label) { return -1; }
                        if(a.idFuncao.label > b.idFuncao.label) { return 1; }
                        return 0;
                    })

                this.setState({ 
                    listaFuncao: novaListaFuncaoOrdenada,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de funções.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de funções.',
                erroExibe: true,
            });
        }
    }

    postUsuarioPerfilFuncao = async () => {
        try {
            this.setState({ carregandoExibe: true });

           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/usuarioPerfilFuncao',
                {
                    idUsuarioPerfil: this.state.usuarioPerfilUrl,
                    idFuncao: this.state.idFuncao.url,
                    acessoCompleto: this.state.acessoCompleto ? 'S' : 'N',
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    usuarioPerfilFuncaoUrl: response.data._links.self.href,
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
                    erroMensagem: "Não foi possível vincular a função ao usuário.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o vinculo a função ao usuário.",
                erroExibe: true,
            });
        }
    }

    deleteUsuarioPerfilFuncao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);            

            // start making calls
            const response = await api.delete(
                this.state.usuarioPerfilFuncaoUrl,
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
                    erroMensagem: "Não foi possível desvincular a função do usuário.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar o desvínculo da função com o usuário.",
                erroExibe: true,
            });
        }
    }

     /**************
     * BOTÕES DE AÇÃO
     */

    aoSalvar = () => {

        if (this.state.validacao.username === 'has-success') {

            // Confirma dados informados
            if( this.ehEdicao() ) {

                this.patchUsuario();
            }
            else {
                this.postUsuario();
            }            
        }
        else {
            this.erroForm();
        }
    }

    aoExcluir = () => {

        this.alternarModelExclusao();

        this.deleteUsuario();
    }

    aoVoltar = () => {
        const history = createHashHistory();

        history.push('/seguranca/usuario/lista');
    }

    erroForm() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de continuar.',
            erroExibe: true,
        });
    }

    /*****************
     * GET SEGURANÇA USUARIO
     */
    getUsuario = async () => {
        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/usuario/" + this.props.id + '/',
                {},
                {
                    params: {
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok) {

                const validacao = {
                    username: 'has-success',
                    idPessoa: 'has-success',
                    perfil: 'has-success',
                }

                let value = '';
                let nome = '';
                let label = '';
                let url = '';
                for (let j = 0; j < response.data.usuarioPerfis.length; j++) {
                    if(response.data.usuarioPerfis[j].dtFinal === null) {
                        value = response.data.usuarioPerfis[j].perfil._links.self.href;
                        nome = response.data.usuarioPerfis[j].perfil.nome;
                        label = response.data.usuarioPerfis[j].perfil.nome.replace("ROLE_", "").replace("_", " ");
                        url = response.data.usuarioPerfis[j]._links.self.href;
                    }
                }

                const idPessoa = {
                    value: response.data.idPessoa._links.self.href,
                    id: response.data.idPessoa.id,
                    label: response.data.idPessoa.nmPessoa,
                }

                let idPessoaOpcoes = [];
                idPessoaOpcoes.push(idPessoa);

                this.setState({ 
                    username: response.data.username,
                    idPessoa: idPessoa,  
                    idPessoaOpcoes: idPessoaOpcoes,  
                    perfil: {
                        value: value,
                        nome: nome,
                        label: label,
                    },
                    usuarioPerfilUrl: url,
                    validacao: validacao,
                    idPessoaEstilo: getEstiloValido(),
                    perfilEstilo: getEstiloValido()
                    // carregandoExibe: false
                }, () => {
                    this.getListaPerfil();
                });
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter o usuário.',
                    erroExibe: true,
                });
            }                      
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar o usuário.',
                erroExibe: true,
            });
        }
    };

    /************
     * GET LISTA PERFIL
     */
    getListaPerfil = async () => {
        try {

            if(!this.state.carregandoExibe) {
                this.setState({ carregandoExibe: true });
            }

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/perfil/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': "nome,asc"
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.perfil.length; i++) {
                    
                    lista.push(
                        {
                            value: response.data._embedded.perfil[i]._links.self.href,
                            nome: response.data._embedded.perfil[i].nome,
                            label: response.data._embedded.perfil[i].nome.replace("ROLE_", "").replace("_", " "),
                        },
                    );
                    
                }

                if(this.ehEdicao()) {
                    this.setState({ 
                        perfilOpcoes: lista,
                    }, () => {
                        // this.getListaPessoa();
                        this.getListaFuncao();
                    })    
                }
                else {
                    this.setState({ 
                        perfilOpcoes: lista,
                        carregandoExibe: false
                    })
                }

                
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de perfis.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de perfis.',
                erroExibe: true,
            });
        }
    }

    /************
     * GET LISTA PESSOA
     */
    getListaPessoa = async (pesquisa) => {
        try {
            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/vPessoa/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': 'nmPessoa,asc',
                        'search': pesquisa
                    }
                }
            );

            if(response.ok) {

                let lista = [];
                if(this.ehEdicao() && (pesquisa === "")) {
                    lista.push(this.state.idPessoa);
                }

                for (let i = 0; i < response.data._embedded.vPessoa.length; i++) {

                    lista.push(
                        {
                            value: response.data._embedded.vPessoa[i]._links.self.href,
                            id: response.data._embedded.vPessoa[i].id,
                            label: response.data._embedded.vPessoa[i].nmPessoa,
                        },
                    );                    
                }

                this.setState({ 
                    idPessoaOpcoes: lista,
                    carregandoExibe: false
                });
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de pessoas.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de pessoas.',
                erroExibe: true,
            });
        }
    }

    /*********************
     * POST, PATCH E DELETE
     */

    postUsuario = async () => {
        try {

            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/usuarioDto',
                {
                    username: this.state.username.toLowerCase(),
                    perfil: this.state.perfil.nome,
                    idPessoa: this.state.idPessoa.id,
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O usuário foi salvo!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar o usuário.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do usuário.",
                erroExibe: true,
            });
        }
    }
    
    patchUsuario = async () => {

        try {            

            this.setState({ carregandoExibe: true });
           
            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/usuarioDto',
                {
                    username: this.state.username,
                    perfil: this.state.perfil.nome,
                    idPessoa: this.state.idPessoa.id,
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O usuário foi editado!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar o usuário.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do usuário.",
                erroExibe: true,
            });
        }
    }

    deleteUsuario = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(
                '/usuarioDto/delete',
                {
                    username: this.props.id,
                }
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O usuário foi excluído!",
                    sucessoExibe: true 
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível excluir o usuário.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a exclusão do usuário.",
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
                dataField: 'idFuncao.label',
                text: 'Função',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'acessoCompleto',
                text: 'Acesso Completo',
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
                                                <Label htmlFor="username">E-mail</Label>
                                                <Input 
                                                    type="text" 
                                                    minLength="3"
                                                    maxLength="50"
                                                    id="username" 
                                                    name="username"
                                                    autoFocus
                                                    required={this.ehEdicao() ? false : true}
                                                    disabled={this.ehEdicao() ? true : false}
                                                    value={this.state.username}
                                                    onChange={(event) => { 
                                                        this.validaUsername(event)
                                                        this.aoMudar(event)
                                                    }}
                                                    valid={ this.state.validacao.username === 'has-success' } 
                                                    invalid={ this.state.validacao.username === 'has-danger' } 
                                                />                                                
                                                <FormFeedback>{this.state.usernameMsgErro}</FormFeedback>
                                                <FormText className="help-block">Esse será o login do usuário</FormText>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="perfil">Perfil</Label>
                                                <Select
                                                    id="perfil"
                                                    name="perfil"
                                                    value={this.state.perfil}
                                                    onChange={(event) => { 
                                                        this.validaPerfil(event)
                                                        this.aoMudarPerfil(event)
                                                    }}
                                                    options={this.state.perfilOpcoes}
                                                    required
                                                    isClearable
                                                    isLoading={this.state.perfilCarregando}
                                                    placeholder={this.state.perfilPlaceholder}
                                                    styles={this.state.perfilEstilo}
                                                />
                                                <Input 
                                                    valid={ this.state.validacao.perfil === 'has-success' } 
                                                    invalid={ this.state.validacao.perfil === 'has-danger' } 
                                                    hidden
                                                />
                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="idPessoa">Pessoa</Label>
                                                <AsyncSelect
                                                    loadOptions={this.carregarOpcoesIdPessoa}
                                                    value={this.state.idPessoa}
                                                    id="idPessoa"
                                                    name="idPessoa"
                                                    placeholder={this.state.idPessoaPlaceholder}
                                                    isLoading={this.state.idPessoaCarregando}
                                                    isClearable
                                                    required
                                                    styles={this.state.idPessoaEstilo}
                                                    onChange={this.aoSelecionarIdPessoa}
                                                    onInputChange={this.aoPesquisarIdPessoa}
                                                />
                                                <Input
                                                    type="hidden"
                                                    name="idPessoaValidacao"
                                                    id="idPessoaValidacao"
                                                    value={this.state.idPessoa ? this.state.idPessoa.value : ''}
                                                    valid={this.state.idPessoa ? true : false}
                                                    invalid={!this.state.idPessoa ? true : false}
                                                    required
                                                />                                            
                                                <FormFeedback>Campo obrigatório</FormFeedback>
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
                                    <i className="fa fa-id-card"></i> Funções Vinculadas
                                </CardHeader>
                                <CardBody>
                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="idFuncao">Função</Label>
                                                <Select
                                                    id="idFuncao"
                                                    name="idFuncao"
                                                    value={this.state.idFuncao}
                                                    onChange={(event) => { 
                                                        this.validaIdFuncao(event)
                                                        this.aoMudarIdFuncao(event)
                                                    }}
                                                    options={this.state.idFuncaoOpcoes}
                                                    required
                                                    isClearable
                                                    isLoading={this.state.idFuncaoCarregando}
                                                    placeholder={this.state.idFuncaoPlaceholder}
                                                    styles={this.state.idFuncaoEstilo}
                                                />
                                                <Input 
                                                    valid={ this.state.validacao.idFuncao === 'has-success' } 
                                                    invalid={ this.state.validacao.idFuncao === 'has-danger' } 
                                                    hidden
                                                />
                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="acessoCompleto">Acesso Completo</Label>
                                                <div>
                                                    <AppSwitch 
                                                        className={'mx-1'} 
                                                        variant={'3d'} 
                                                        outline={'alt'} 
                                                        color={'primary'} 
                                                        label 
                                                        id="acessoCompleto"
                                                        name="acessoCompleto"
                                                        onChange={this.aoMudarSwitch}
                                                        checked={this.state.acessoCompleto}
                                                    />
                                                </div>
                                                <FormText className="help-block">Terá acesso completo a função?</FormText>
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

                                    <br/>

                                    <Row>
                                        <Col xs="12" className="botao-centro">
                                            <Tabela 
                                                lista={this.state.listaFuncao} 
                                                colunas={ colunas }
                                                className={"table-sm"}

                                                loading={this.state.carregandoExibe}
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
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir Usuário</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir o usuário?
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

export default UsuarioForm;
