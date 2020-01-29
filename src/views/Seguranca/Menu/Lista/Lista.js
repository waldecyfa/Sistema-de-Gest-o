import React, { Component } from 'react';
import Lista from '../../../../components/Lista/Lista';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaMenuActions } from '../../../../store/ducks/segurancaMenu';
import {
    getApiAutenticado
} from '../../../../components/Oauth';
import debounce from 'lodash.debounce';

class MenuLista extends Component {
    
    constructor(props) {
        super(props);

        // Delay action 1 second
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000);
    
        this.state = {
            carregandoExibe: false,

            erroMensagem: '',
            erroExibe: false,

            lista: [],

            sortField: 'posicao',
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

        this.getListaMenu();
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
            this.getListaMenu();
        });
    }

    aoBuscar = (event) => {

        this.setState({ busca: event.target.value });

        this.onChangeDebounced(event);        
    };

    onChangeDebounced = () => {
        // Delayed logic goes here
        this.getListaMenu();
    }

    /************
     * GET LISTA MENU
     */
    getListaMenu = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.get(
                '/menu/search/getPageableAtivos',
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
            
                for (let i = 0; i < response.data._embedded.menu.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.menu[i].id,
                            idMenuPai: (response.data._embedded.menu[i].idMenuPai === null) ? null : response.data._embedded.menu[i].idMenuPai.nome,
                            nome: response.data._embedded.menu[i].nome,
                            url: response.data._embedded.menu[i].url,
                            icone: <i className={"fa " + response.data._embedded.menu[i].icone}></i>,
                            posicao: response.data._embedded.menu[i].posicao,
                            edit: <i className="fa fa-pencil-square fa-2x btn-acao" id={response.data._embedded.menu[i].id} onClick={this.redirecionaEdicao}></i>,
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


    /***********
     * ADICIONAR MENU
     */
    adicionar = () => {
        this.props.history.push('/seguranca/menu/novo');
    }

    /*********
     * REDIRECIONA EDIÇÃO
     */
    redirecionaEdicao = (event) => {

        this.props.editarSegurancaMenu(event.target.id);

        this.props.history.push('/seguranca/menu/editar');
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
                // hidden: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'idMenuPai',
                text: 'Menu Pai',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'nome',
                text: 'Nome',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'url',
                text: 'URL',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'icone',
                text: 'Ícone',
                sort: false,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'posicao',
                text: 'Posição',
                sort: true,
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
                titulo="Listar Menu"

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

        );
    }
}


/************
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaMenuActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaMenu: state.segurancaMenu,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuLista));
