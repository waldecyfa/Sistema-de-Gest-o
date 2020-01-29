import React, { Component } from 'react';
import Lista from '../../../../../components/Lista/Lista';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../../store/ducks/autenticacao';
import { Creators as requisicaoModeloActions } from '../../../../../store/ducks/requisicaoModelo';
import { Creators as navegacaoActions } from '../../../../../store/ducks/navegacao';
import {
    getApiAutenticado
} from '../../../../../components/Oauth';
import { 
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

class ModeloLista extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
            carregandoExibe: false,

            erroMensagem: '',
            erroExibe: false,

            sucessoMensagem: "",
            sucessoExibe: false,
            sucessoRedireciona: "",

            id: 0,

            lista: [],

            sortField: 'descricao',
            sortOrder: 'asc',

            exibeModelExclusao: false,       
        };
    }

       
    /**********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {

        this.props.editarRequisicaoModelo(0);
        this.getListaRequisicao();
    }

    /************
     * GET LISTA REQUISIÇÃO
     */
    getListaRequisicao = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.get(
                '/wsModeloRequisicao/search/getAtivos',
                {},
                {
                    params: {
                        'idOperadorPortuario': this.props.autenticacao.idOperadorPortuario,
                        'projection': 'complete',
                        'sort': this.state.sortField + "," + this.state.sortOrder,
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.wsModeloRequisicao.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.wsModeloRequisicao[i].id,
                            descricao: response.data._embedded.wsModeloRequisicao[i].descricao,                            
                            gerar: <i className="fa fa-clone fa-lg btn-acao" id={response.data._embedded.wsModeloRequisicao[i].id} onClick={this.redirecionaGeracao}></i>,
                            edit: <i className="fa fa-pencil-square fa-2x btn-acao" id={response.data._embedded.wsModeloRequisicao[i].id} onClick={this.redirecionaEdicao}></i>,
                            delete: <i className="fa fa-trash fa-lg btn-acao" id={response.data._embedded.wsModeloRequisicao[i].id} onClick={this.redirecionaExclusao}></i>,
                        },
                    )                    
                }

                this.setState({ 
                    lista: lista,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter a lista de modelos.',
                    erroExibe: true,
                });
            }
           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de modelos.',
                erroExibe: true,
            });
        }
    }

    /***********
     * ADICIONAR MODELO
     */
    adicionar = () => {
        this.props.setNavegacao(
            '/operador-portuario/requisicao/modelo/lista',
            'modelo'
        );

        this.props.history.push('/operador-portuario/requisicao/modelo/novo');
    }

    /*********
     * REDIRECIONA EDIÇÃO
     */
    redirecionaEdicao = (event) => {
        this.props.setNavegacao(
            '/operador-portuario/requisicao/modelo/lista',
            'modelo'
        );

        this.props.editarRequisicaoModelo(event.target.id);

        this.props.history.push('/operador-portuario/requisicao/modelo/editar');
    }

    /*********
     * REDIRECIONA GERAÇÃO DE REQUISIÇÃO
     */
    redirecionaGeracao = (event) => {
        this.props.setNavegacao(
            '/operador-portuario/requisicao/modelo/lista',
            'modelo'
        );

        this.props.editarRequisicaoModelo(event.target.id);

        this.props.history.push('/operador-portuario/requisicao/novo');
    }

    alternarModelExclusao = () => {
        this.setState({
            exibeModelExclusao: !this.state.exibeModelExclusao,
        });
    }

    redirecionaExclusao = (event) => {

        this.setState({
            id: event.target.id,
        }, () => {
            this.alternarModelExclusao();
        });
    }

    aoExcluir = () => {

        this.alternarModelExclusao();

        this.deleteWsModeloRequisicao();
    }

    deleteWsModeloRequisicao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.delete(
                "/wsModeloRequisicao/" + this.state.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O modelo foi excluído!",
                    sucessoExibe: true,
                    sucessoRedireciona: '/',
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

        const colunas = [
            {
                dataField: 'id',
                text: 'Id',
                hidden: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'descricao',
                text: 'Nome',
                sort: true,
                headerAlign: 'center',
                align: 'center',            
            }, {
                dataField: 'gerar',
                text: 'Gerar Requisição',
                headerAlign: 'center',
                align: 'center',
            }, {
                dataField: 'edit',
                text: 'Editar',
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
            <div>
                <Lista
                    titulo="Listar Modelos"

                    lista={ this.state.lista } 
                    colunas={ colunas }

                    sucessoRedireciona={this.state.sucessoRedireciona}
                    sucessoExibe={this.state.sucessoExibe}
                    sucessoMensagem={this.state.sucessoMensagem}

                    aoConfirmarErro={() => this.setState({erroExibe: false})}
                    exibeErro={this.state.erroExibe}
                    mensagemErro={this.state.erroMensagem}
                    
                    exibeCarregando={this.state.carregandoExibe}
                    aoAdicionar={this.adicionar}
                />

                <Modal 
                    isOpen={this.state.exibeModelExclusao} 
                    toggle={this.alternarModelExclusao}
                    className={'modal-primary '}
                >
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir Modelo</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir o modelo?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.aoExcluir}>Excluir</Button>{' '}
                        <Button color="secondary" onClick={this.alternarModelExclusao}>Cancelar</Button>
                    </ModalFooter>
                </Modal>
            </div>        
        );
    }
}


/************
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, requisicaoModeloActions, navegacaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    requisicaoModelo: state.requisicaoModelo,
    navegacao: state.navegacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ModeloLista));
