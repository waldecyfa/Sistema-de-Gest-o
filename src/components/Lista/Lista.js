import React, { Component } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Col, 
    Row,
} from 'reactstrap';
import Tabela from './Tabela';
import TabelaRemota from './TabelaRemota';
import Rodape from './Rodape';
import Carregando from '../Alerta/Carregando';
import Sucesso from '../Alerta/Sucesso';
import Erro from '../Alerta/Erro';
import { createHashHistory } from 'history';

class Lista extends Component {
    
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
                                <i className="fa fa-list"></i> {this.props.titulo}
                            </CardHeader>

                            <CardBody>
                                
                                {(this.props.remota) ? (
                                    <TabelaRemota 
                                        lista={ this.props.lista } 
                                        colunas={ this.props.colunas } 

                                        pageNumber={ this.props.pageNumber }
                                        pageSize={ this.props.pageSize }
                                        pageTotalElements={ this.props.pageTotalElements }
                                        pageTotalPages={ this.props.pageTotalPages }
                                        aoMudarTabela={ this.props.aoMudarTabela }

                                        busca={this.props.busca}
                                        aoBuscar={this.props.aoBuscar}
                                    />
                                ) : (
                                    <Tabela
                                        lista={ this.props.lista } 
                                        colunas={ this.props.colunas } 
                                    />                                
                                )}
                            </CardBody>

                            <Rodape aoAdicionar={this.props.aoAdicionar} />

                        </Card>
                    </Col>                    
                </Row>

                <Sucesso 
                    aoConfirmar={() =>
                        this.setState({sucessoExibe: false}, () => {
                            const history = createHashHistory();
                            history.push(this.props.sucessoRedireciona);
                        })
                    }
                    exibe={this.props.sucessoExibe}
                    mensagem={this.props.sucessoMensagem}
                />

                <Erro 
                    aoConfirmar={this.props.aoConfirmarErro}
                    exibe={this.props.exibeErro}
                    mensagem={this.props.mensagemErro}
                />

                <Carregando
                    exibe={this.props.exibeCarregando}
                />
            </div>

        );
    }
}

export default Lista;
