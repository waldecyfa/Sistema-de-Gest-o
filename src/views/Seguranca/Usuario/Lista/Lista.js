import React, { Component } from 'react';
import Lista from '../../../../components/Lista/Lista';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaUsuarioActions } from '../../../../store/ducks/segurancaUsuario';
import {
    getApiAutenticado
} from '../../../../components/Oauth';
import debounce from 'lodash.debounce';

class UsuarioLista extends Component {
    
    constructor(props) {
        super(props);
    
        // Delay action 1 second
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000);

        this.state = {
            carregandoExibe: false,

            erroMensagem: '',
            erroExibe: false,

            lista: [],

            sortField: 'username',
            sortOrder: 'asc',
            busca: '',

            pageNumber: 1,
            pageSize: 20,
            pageTotalElements: 0,
            pageTotalPages: 0,
        };
    }

       
    /**********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {

        this.getListaUsuario();
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
            this.getListaUsuario();
        });
    }

    aoBuscar = (event) => {

        this.setState({ busca: event.target.value });

        this.onChangeDebounced(event);        
    };

    onChangeDebounced = () => {
        // Delayed logic goes here
        this.getListaUsuario();
    }

    /************
     * GET LISTA USUARIO
     */
    getListaUsuario = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.get(
                '/usuario/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': this.state.sortField + "," + this.state.sortOrder,
                        'search': this.state.busca,
                        'page': this.state.pageNumber - 1,
                        'size': this.state.pageSize
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.usuario.length; i++) {

                    let perfil = '';
                    for (let j = 0; j < response.data._embedded.usuario[i].usuarioPerfis.length; j++) {
                        if(response.data._embedded.usuario[i].usuarioPerfis[j].dtFinal === null) {
                            perfil = response.data._embedded.usuario[i].usuarioPerfis[j].perfil.nome.replace("ROLE_", "");
                        }
                    }

                    lista.push(
                        {
                            id: i,
                            username: response.data._embedded.usuario[i].username,
                            perfil: {
                                nome: perfil,
                            },
                            idPessoa: {
                                nmPessoa: (response.data._embedded.usuario[i].idPessoa === null) ? '' : response.data._embedded.usuario[i].idPessoa.nmPessoa,
                            },
                            edit: <i className="fa fa-pencil-square fa-2x btn-acao" id={response.data._embedded.usuario[i].username} onClick={this.redirecionaEdicao}></i>,
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
                    erroMensagem: 'Não foi possível obter a lista de usuários.',
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de usuários.',
                erroExibe: true,
            });
        }
    }


    /***********
     * ADICIONAR USUARIO
     */
    adicionar = () => {
        this.props.history.push('/seguranca/usuario/novo');
    }

    /*********
     * REDIRECIONA EDIÇÃO
     */
    redirecionaEdicao = (event) => {

        this.props.editarSegurancaUsuario(event.target.id);

        this.props.history.push('/seguranca/usuario/editar');
    }


    /************
     * RENDER
     */
    render() {

        const colunas = [
            {
                dataField: 'id',
                text: 'Id',
                sort: true,
                hidden: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'username',
                text: 'Usuário',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'perfil.nome',
                text: 'Perfil',
                sort: false,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'idPessoa.nmPessoa',
                text: 'Pessoa',
                sort: false,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'edit',
                text: 'Editar',
                headerAlign: 'center',
                align: 'center',
            }
        ];

        return (

            <Lista
                titulo="Listar Usuários"

                lista={ this.state.lista } 
                colunas={ colunas }
                remota={true}
                
                pageNumber={ this.state.pageNumber }
                pageSize={ this.state.pageSize }
                pageTotalElements={ this.state.pageTotalElements }
                pageTotalPages={ this.state.pageTotalPages }
                aoMudarTabela={ this.aoMudarTabela }

                sucessoExibe={false}

                busca={this.state.busca}
                aoBuscar={(event) => this.aoBuscar(event)}

                aoConfirmarErro={() => this.setState({erroExibe: false})}
                exibeErro={this.state.erroExibe}
                mensagemErro={this.state.erroMensagem}
                
                exibeCarregando={this.state.carregandoExibe}
                aoAdicionar={this.adicionar}
            />

        );
    }
}


/************
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaUsuarioActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaUsuario: state.segurancaUsuario,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UsuarioLista));
