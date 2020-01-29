import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Lista from '../../../../components/Lista/Lista';
import {create} from 'apisauce';
import { 
    converteDataHoraSemTimezoneParaBr,
    converteSomenteDataParaBr,
    converteRequisicaoStatus
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

class RequisicaoPendente extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
            carregandoExibe: false,

            erroTitulo: '',
            erroMensagem: '',
            erroExibe: false,

            lista: [],
        };
    }

       
    /**********
     * COMPONENT DID MOUNT
     */
    componentDidMount() {

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
                '/wsControleRequisicao/search/getListaPendentesPorIdOperadorPortuario',
                {},
                {
                    params: {
                        'idOperadorPortuario': this.props.autenticacao.idOperadorPortuario,
                        'projection': 'lista',
                        'sort': 'dtRequisicao,desc',
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
                            edit: (response.data._embedded.wsControleRequisicao[i].status === 'G') ? '-' : <i className="fa fa-pencil-square fa-2x btn-acao" id={response.data._embedded.wsControleRequisicao[i].id} onClick={this.redirecionaEdicao}></i>
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
            '/operador-portuario/requisicao/pendente',
            'requisicao'
        );

        this.props.history.push('/operador-portuario/requisicao/novo');
    }

    /*********
     * REDIRECIONA EDIÇÃO
     */
    redirecionaEdicao = (event) => {

        this.props.editarRequisicao(event.target.id);
        this.props.setNavegacao(
            '/operador-portuario/requisicao/pendente',
            'requisicao'
        );

        this.props.history.push('/operador-portuario/requisicao/editar');
    }

    aoMudarTabela = (type, { page, sizePerPage }) => {

        this.getListaRequisicao(page, sizePerPage);
    }

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
                sort: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'status',
                text: 'Status',
                sort: true,
                headerAlign: 'center',
                align: 'center'
            }, {
                dataField: 'edit',
                text: 'Editar',
                headerAlign: 'center',
                align: 'center',
                // formatter: formataEdicao
            }
        ];

        return (

            <div>
                <Lista
                    titulo="Requisições Pendentes"

                    lista={ this.state.lista } 
                    colunas={ colunas } 
                    remota={true}

                    aoMudarTabela={ this.aoMudarTabela }

                    sucessoExibe={false}

                    aoConfirmarErro={() => this.setState({erroExibe: false})}
                    exibeErro={this.state.erroExibe}
                    mensagemErro={this.state.erroMensagem}
                    
                    exibeCarregando={this.state.carregandoExibe}
                    aoAdicionar={this.adicionar}
                />
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
)(RequisicaoPendente));
