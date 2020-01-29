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


class LocalOperacaoForm extends Component {

    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);
            
        this.state = {     
            
            id: 0, 
            nome: "",
            nomeMsgErro: "Campo obrigatório",
            
            /**
             * VALIDAÇÃO
             */
            validacao: {

                nome: 'has-danger',
            }, 

            carregandoExibe: false,
            erroMensagem: '',
            erroExibe: false,
            sucessoExibe: false,

            exibeModelExclusao: false,       
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
            this.getLocalOperacao();
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

    handleChange = (event) => {

        this.setState({ [event.target.name]: event.target.value} );
    }

    alternarModelExclusao = () => {
        this.setState({
            exibeModelExclusao: !this.state.exibeModelExclusao,
        });
    }

     /**************
     * BOTÕES DE AÇÃO
     */

    aoSalvar = () => {

        if (this.state.validacao.nome === 'has-success') {

            // Confirma dados informados
            if( this.ehEdicao() ) {

                this.patchLocalOperacao();
            }
            else {
                this.postLocalOperacao();
            }
            
        }
        else {
            this.erroForm();
        }
    }

    aoExcluir = () => {

        this.alternarModelExclusao();

        this.deleteLocalOperacao();
    }

    aoVoltar = () => {
        const history = createHashHistory();

        history.push('/escalacao/local-operacao/lista');
    }

    erroForm() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de continuar.',
            erroExibe: true,
        });
    }

    /*****************
     * GET LOCAL OPERAÇÃO
     */
    getLocalOperacao = async () => {
        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/localOperacao/" + this.props.id,
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
                    validacao: validacao,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter o local de operação.',
                    erroExibe: true,
                });
            }                      
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar o local de operação.',
                erroExibe: true,
            });
        }
    };


    /*********************
     * POST, PATCH E DELETE
     */

    postLocalOperacao = async () => {
        try {

            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/localOperacao',
                {
                    nome: this.state.nome
                },
            );


            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O local de operação foi salvo!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar o local de operação.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do local de operação.",
                erroExibe: true,
            });
        }
    }
    
    patchLocalOperacao = async () => {

        try {            

            this.setState({ carregandoExibe: true });
           
            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/localOperacao/' + this.props.id,
                {
                    nome: this.state.nome
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O local de operação foi editado!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar o local de operação.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do local de operação.",
                erroExibe: true,
            });
        }
    }

    deleteLocalOperacao = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.delete(
                "/localOperacao/" + this.props.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O local de operação foi excluído!",
                    sucessoExibe: true 
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível excluir o local de operação.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a exclusão do local de operação.",
                erroExibe: true,
            });
        }
    }


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
                                                        this.handleChange(event)
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

                <Modal 
                    isOpen={this.state.exibeModelExclusao} 
                    toggle={this.alternarModelExclusao}
                    className={'modal-danger'}
                >
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir Local de Operação</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir o local de operação?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.aoExcluir}>Excluir</Button>{' '}
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

export default LocalOperacaoForm;
