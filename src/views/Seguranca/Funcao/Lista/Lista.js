import React, { Component } from 'react';
import Lista from '../../../../components/Lista/Lista';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaFuncaoActions } from '../../../../store/ducks/segurancaFuncao';
import {
    getApiAutenticado
} from '../../../../components/Oauth';

class FuncaoLista extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
            carregandoExibe: false,

            erroMensagem: '',
            erroExibe: false,

            lista: [],

            sortField: 'nome',
            sortOrder: 'asc'
        };
    }

       
    /**********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {

        this.getListaFuncao();
    }

    /************
     * GET LISTA FUNCAO
     */
    getListaFuncao = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.get(
                '/funcao/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': this.state.sortField + "," + this.state.sortOrder
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.funcao.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.funcao[i].id,
                            nome: response.data._embedded.funcao[i].nome,
                            edit: <i className="fa fa-pencil-square fa-2x btn-acao" id={response.data._embedded.funcao[i].id} onClick={this.redirecionaEdicao}></i>,
                        },
                    );
                    
                }

                this.setState({ 
                    lista: lista,
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


    /***********
     * ADICIONAR MODELO
     */
    adicionar = () => {
        this.props.history.push('/seguranca/funcao/novo');
    }

    /*********
     * REDIRECIONA EDIÇÃO
     */
    redirecionaEdicao = (event) => {

        this.props.editarSegurancaFuncao(event.target.id);

        this.props.history.push('/seguranca/funcao/editar');
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
                dataField: 'nome',
                text: 'Nome',
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
                titulo="Listar Funções"

                lista={ this.state.lista } 
                colunas={ colunas }      

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
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaFuncaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaFuncao: state.segurancaFuncao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FuncaoLista));
