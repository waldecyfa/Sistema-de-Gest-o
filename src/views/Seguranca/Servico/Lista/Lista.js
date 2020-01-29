import React, { Component } from 'react';
import Lista from '../../../../components/Lista/Lista';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaServicoActions } from '../../../../store/ducks/segurancaServico';
import {
    getApiAutenticado
} from '../../../../components/Oauth';
import debounce from 'lodash.debounce';

class ServicoLista extends Component {
    
    constructor(props) {
        super(props);
    
        // Delay action 1 second
        this.onChangeDebounced = debounce(this.onChangeDebounced, 1000);

        this.state = {
            carregandoExibe: false,

            erroMensagem: '',
            erroExibe: false,

            lista: [],

            sortField: 'idModelo.nome',
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

        this.getListaServico();
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
            this.getListaServico();
        });
    }

    aoBuscar = (event) => {

        this.setState({ busca: event.target.value });

        this.onChangeDebounced(event);        
    };

    onChangeDebounced = () => {
        // Delayed logic goes here
        this.getListaServico();
    }

    /************
     * GET LISTA SERVICO
     */
    getListaServico = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.get(
                '/servico/search/getPageableAtivos',
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
            
                for (let i = 0; i < response.data._embedded.servico.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.servico[i].id,
                            idModelo: {
                                nome: response.data._embedded.servico[i].idModelo.nome,
                            },
                            metodo: response.data._embedded.servico[i].metodo,
                            uri: response.data._embedded.servico[i].uri,                            
                            edit: <i className="fa fa-pencil-square fa-2x btn-acao" id={response.data._embedded.servico[i].id} onClick={this.redirecionaEdicao}></i>,
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


    /***********
     * ADICIONAR SERVICO
     */
    adicionar = () => {
        this.props.history.push('/seguranca/servico/novo');
    }

    /*********
     * REDIRECIONA EDIÇÃO
     */
    redirecionaEdicao = (event) => {

        this.props.editarSegurancaServico(event.target.id);

        this.props.history.push('/seguranca/servico/editar');
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
                dataField: 'idModelo.nome',
                text: 'Modelo',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'metodo',
                text: 'Método',
                sort: true,
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'uri',
                text: 'Uri',
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
                titulo="Listar Serviços"

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
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaServicoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaServico: state.segurancaServico,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ServicoLista));
