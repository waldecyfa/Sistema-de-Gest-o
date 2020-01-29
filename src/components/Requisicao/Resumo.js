import React, { Component } from 'react';
import { 
    Col, 
    Row,
    Button,
    FormGroup,
    Label,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import { 
    converteDataParaBr,
} from '../Util';


class RequisicaoResumo extends Component {
     

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

    /************
     * RENDER
     */
    render() {
        
        return (
            <Modal 
                isOpen={this.props.exibeModelResumo} 
                toggle={this.props.alternarModelResumo}
                className={'modal-requisicao modal-primary modal-lg ' + this.props.className}
            >
                <ModalHeader 
                    toggle={this.props.alternarModelResumo}>
                        Requisição de Mão de Obra de Trabalhador Portuário Avulso
                </ModalHeader>
                <ModalBody>

                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="requisitante" className="label-requisicao">Requisitante</Label>
                                <p className="form-control-static">
                                    {this.props.nomeOperadorPortuario}
                                </p>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="4">
                            <FormGroup>
                                <Label htmlFor="porto" className="label-requisicao">Porto</Label>
                                <p className="form-control-static">
                                    {(this.props.portoSelecionado !== null) ? this.props.portoSelecionado.label : ""}
                                </p>
                            </FormGroup>
                        </Col>
                        <Col xs="4">
                            <FormGroup>
                                <Label htmlFor="cais" className="label-requisicao">Cais</Label>
                                <p className="form-control-static">
                                    {(this.props.caisSelecionado !== null) ? this.props.caisSelecionado.label : ""}
                                </p>
                            </FormGroup>
                        </Col>
                        <Col xs="4">
                            <FormGroup>
                                <Label htmlFor="berco" className="label-requisicao">Berço</Label>
                                <p className="form-control-static">
                                {(this.props.bercoSelecionado !== null) ? this.props.bercoSelecionado.label : ""}
                                </p>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="6">
                            <FormGroup>
                                <Label htmlFor="navio" className="label-requisicao">Navio</Label>
                                <p className="form-control-static">
                                    {(this.props.navioSelecionado !== null) ? this.props.navioSelecionado.label : ""}
                                </p>
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label htmlFor="lloyd" className="label-requisicao">Lloyd</Label>
                                <p className="form-control-static">
                                    {(this.props.navioSelecionado !== null) ? this.props.navioSelecionado.lloyd : ""}
                                </p>
                            </FormGroup>
                        </Col>                            
                    </Row>

                    <Row>
                        <Col xs="6">
                            <FormGroup>
                                <Label htmlFor="data_operacao" className="label-requisicao">Data de Operação</Label>
                                <p className="form-control-static">
                                    {converteDataParaBr(this.props.dataOperacao)}
                                </p>
                            </FormGroup>
                        </Col>
                        <Col xs="6">
                            <FormGroup>
                                <Label htmlFor="turno" className="label-requisicao">Turno</Label>
                                <p className="form-control-static">
                                    {(this.props.turnoSelecionado !== null) ? this.props.turnoSelecionado.label : ""}
                                </p>
                            </FormGroup>
                        </Col>  
                    </Row>

                    <Row>                          
                        <Col xs="6">
                            <FormGroup>
                                <Label htmlFor="quantidade_terno" className="label-requisicao">Qtd Terno</Label>
                                <p className="form-control-static">
                                    {this.props.quantidadeTerno}
                                </p>
                            </FormGroup>
                        </Col>
                        {(this.props.programacaoNavio.length > 0) &&
                        <Col xs="6">
                            <FormGroup>
                                <Label htmlFor="programacao_navio" className="label-requisicao">Programação do Navio</Label>
                                <p className="form-control-static">
                                    {this.props.programacaoNavio}
                                </p>
                            </FormGroup>
                        </Col>
                        }
                    </Row>
                    
                    {(this.props.listaProducao.length > 0) &&
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="operacao" className="label-requisicao">OPERAÇÃO</Label>                                    
                                <Table responsive bordered size="sm">
                                    <tbody>
                                    {this.props.listaProducao.map((linha, idx) => (
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
                    }

                    {(this.props.listaConferente.length > 0) &&
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
                                        {this.exibeListaFuncoes(this.props.listaConferente)}
                                    </tbody>
                                </Table>
                            </FormGroup>
                        </Col>
                    </Row>
                    }

                    {(this.props.listaEstivador.length > 0) &&
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
                                        {this.exibeListaFuncoes(this.props.listaEstivador)}
                                    </tbody>
                                </Table>
                            </FormGroup>
                        </Col>
                    </Row>
                    }

                    {(this.props.listaCapatazia.length > 0) &&
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
                                        {this.exibeListaFuncoes(this.props.listaCapatazia)}
                                    </tbody>
                                </Table>
                            </FormGroup>
                        </Col>
                    </Row>
                    }

                    {(this.props.listaArrumador.length > 0) &&
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
                                        {this.exibeListaFuncoes(this.props.listaArrumador)}
                                    </tbody>
                                </Table>
                            </FormGroup>
                        </Col>
                    </Row>
                    }

                    {(this.props.listaVigia.length > 0) &&
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
                                        {this.exibeListaFuncoes(this.props.listaVigia)}
                                    </tbody>
                                </Table>
                            </FormGroup>
                        </Col>
                    </Row>
                    }

                    {(this.props.observacao !== "") && (this.props.observacao !== null) &&
                    <Row>
                        <Col xs="12">
                            <FormGroup>
                                <Label htmlFor="observacao" className="label-requisicao">Observação</Label>
                                <p className="form-control-static">
                                    {this.props.observacao}
                                </p>
                            </FormGroup>
                        </Col>
                    </Row>
                    }
                </ModalBody>
                <ModalFooter>
                    {(this.props.aoConfirmarResumo !== undefined) &&
                        <Button color="primary" onClick={this.props.aoConfirmarResumo}>
                            <i className="fa fa-thumbs-up"></i> Confirmar
                        </Button>
                    }
                    {' '}
                    {(this.props.aoCancelarResumo !== undefined) &&
                        <Button color="secondary" onClick={this.props.aoCancelarResumo}>
                            <i className="fa fa-thumbs-down"></i> Cancelar
                        </Button>
                    }
                    {' '}
                    {(this.props.aoVoltarResumo !== undefined) &&
                        <Button color="primary" onClick={this.props.aoVoltarResumo}>
                            <i className="fa fa-undo"></i> Voltar
                        </Button>
                    }
                </ModalFooter>
            </Modal>
        );
    }
}

export default RequisicaoResumo;
