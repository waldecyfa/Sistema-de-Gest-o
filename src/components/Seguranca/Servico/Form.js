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
import Select from 'react-select';
import Carregando from '../../Alerta/Carregando';
import Sucesso from '../../Alerta/Sucesso';
import Erro from '../../Alerta/Erro';
import { createHashHistory } from 'history';
import { isNull } from 'util';
import {
    getApiAutenticado,
} from '../../Oauth';
import { 
    getEstiloInvalido,
    getEstiloValido,
} from '../../../components/Select';


class ServicoForm extends Component {

    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);
            
        this.state = {     
            
            id: 0,
            idModelo: null, 
            idModeloOpcoes: [],
            idModeloCarregando: false,
            idModeloPlaceholder: "Selecione um modelo",
            idModeloEstilo: getEstiloInvalido(),

            metodo: null,
            metodoOpcoes: [
                {
                    'label': 'GET',
                    'value': 'GET',
                }, {
                    'label': 'POST',
                    'value': 'POST',
                }, {
                    'label': 'PATCH',
                    'value': 'PATCH',
                }, {
                    'label': 'PUT',
                    'value': 'PUT',
                }, {
                    'label': 'DELETE',
                    'value': 'DELETE',
                }
            ],            
            metodoPlaceholder: "Selecione um método",
            metodoEstilo: getEstiloInvalido(),

            uri: "",
            uriMsgErro: "Campo obrigatório",
            
            /**
             * VALIDAÇÃO
             */
            validacao: {
                idModelo: 'has-danger',
                metodo: 'has-danger',
                uri: 'has-danger',
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

        this.getListaModelo();        
    }

    validaIdModelo(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.idModelo = 'has-danger';
        }
        else {
            validacao.idModelo = 'has-success';
        }

        this.setState({ validacao })
    }

    validaMetodo(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.metodo = 'has-danger';
        }
        else {
            validacao.metodo = 'has-success';
        }

        this.setState({ validacao })
    }

    validaUri(event) {
        
        const { validacao } = this.state;
        let uriMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.uri = 'has-danger';
            uriMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value.length < 3) || (event.target.value.length > 255)) {
            validacao.uri = 'has-danger';
            uriMsgErro = "Deve possuir entre 3 a 255 caracteres";
        }
        else {
            validacao.uri = 'has-success';
        }

        this.setState({ validacao, uriMsgErro });
    }

    handleChangeIdModelo = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('idModeloEstilo');
            this.setState({ 
                idModelo: null,
            });
        }
        else {
            this.setSelectValido('idModeloEstilo');
            this.setState({ 
                idModelo: event,
            }); 
        }
    }

    handleChangeMetodo = (event) => {
        
        if( isNull(event)) {
            this.setSelectInvalido('metodoEstilo');
            this.setState({ 
                metodo: null,
            });
        }
        else {
            this.setSelectValido('metodoEstilo');
            this.setState({ 
                metodo: event,
            }); 
        }
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

        if( (this.state.validacao.idModelo === 'has-success') && (this.state.validacao.metodo === 'has-success') && (this.state.validacao.uri === 'has-success') ) {

            // Confirma dados informados
            if( this.ehEdicao() ) {

                this.patchServico();
            }
            else {
                this.postServico();
            }            
        }
        else {
            this.erroForm();
        }
    }

    aoExcluir = () => {

        this.alternarModelExclusao();

        this.deleteServico();
    }

    aoVoltar = () => {
        const history = createHashHistory();

        history.push('/seguranca/servico/lista');
    }

    erroForm() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de continuar.',
            erroExibe: true,
        });
    }

    setSelectInvalido(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloInvalido() });
    }

    setSelectValido(estiloCampo) {

        this.setState({ [estiloCampo]: getEstiloValido() });
    }

    /************
     * GET LISTA MODELO
     */
    getListaModelo = async () => {
        try {

            this.setState({ 
                carregandoExibe: true,
                idModeloCarregando: true 
            })

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/modelo/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': 'nome,asc'
                    }
                }
            );

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.modelo.length; i++) {
                    
                    lista.push(
                        {
                            value: response.data._embedded.modelo[i].id,
                            label: response.data._embedded.modelo[i].nome,
                            url: response.data._embedded.modelo[i]._links.self.href,
                        },
                    );
                }

                if(this.ehEdicao()) {
                    
                    this.setState({ 
                        idModeloOpcoes: lista,
                        idModeloCarregando: false
                    }, () => {
                        this.getServico();    
                    })
                }
                else {
                    this.setState({ 
                        idModeloOpcoes: lista,
                        idModeloCarregando: false,
                        carregandoExibe: false
                    })
                }
            }
            else {
                this.setState({ 
                    idModeloCarregando: false,
                    erroMensagem: 'Não foi possível obter a lista de modelos.',
                    idModeloPlaceholder: "Erro ao carregar...",
                    erroExibe: true,
                });
            }           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar a listagem de modelos.',
                idModeloPlaceholder: "Erro ao carregar...",
                erroExibe: true,
            });
        }
    }

    /*****************
     * GET SEGURANÇA SERVICO
     */
    getServico = async () => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/servico/" + this.props.id,
                {},
                {
                    params: {
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok) {

                const validacao = {
                    idModelo: 'has-success',
                    metodo: 'has-success',
                    uri: 'has-success',
                }

                this.setState({ 
                    idModelo: {
                        label: response.data.idModelo.nome,
                        value: response.data.idModelo.id,
                        url: response.data.idModelo._links.self.href,
                    },
                    metodo: {
                        label: response.data.metodo,
                        value: response.data.metodo,
                    },
                    uri: response.data.uri,
                    idModeloEstilo: getEstiloValido(),
                    metodoEstilo: getEstiloValido(),
                    validacao: validacao,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter o serviço.',
                    erroExibe: true,
                });
            }                      
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar o serviço.',
                erroExibe: true,
            });
        }
    };


    /*********************
     * POST, PATCH E DELETE
     */

    postServico = async () => {
        try {

            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/servico',
                {
                    idModelo: this.state.idModelo.url,
                    metodo: this.state.metodo.value,                    
                    uri: this.state.uri
                },
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O serviço foi salvo!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar o serviço.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do serviço.",
                erroExibe: true,
            });
        }
    }
    
    patchServico = async () => {

        try {            

            this.setState({ carregandoExibe: true });
           
            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/servico/' + this.props.id,
                {
                    idModelo: this.state.idModelo.url,
                    metodo: this.state.metodo.value,
                    uri: this.state.uri
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O serviço foi editado!",
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar o serviço.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do serviço.",
                erroExibe: true,
            });
        }
    }

    deleteServico = async () => {

        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.delete(
                "/servico/" + this.props.id,
                {},
            );

            if(response.ok) {                

                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O serviço foi excluído!",
                    sucessoExibe: true 
                });
            }
            else {

                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível excluir o serviço.",
                    erroExibe: true,
                });
            }
           
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a exclusão do serviço.",
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
                                                <Label htmlFor="idModelo">Modelo</Label>
                                                <Select
                                                    id="idModelo"
                                                    name="idModelo"
                                                    value={this.state.idModelo}
                                                    onChange={(event) => { 
                                                        this.validaIdModelo(event)
                                                        this.handleChangeIdModelo(event)
                                                    }}
                                                    options={this.state.idModeloOpcoes}
                                                    required
                                                    isClearable
                                                    autoFocus
                                                    isLoading={this.state.idModeloCarregando}
                                                    placeholder={this.state.idModeloPlaceholder}
                                                    styles={this.state.idModeloEstilo}
                                                />
                                                <Input 
                                                    valid={ this.state.validacao.idModelo === 'has-success' } 
                                                    invalid={ this.state.validacao.idModelo === 'has-danger' } 
                                                    hidden
                                                />
                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="metodo">Método</Label>
                                                <Select
                                                    id="metodo"
                                                    name="metodo"
                                                    value={this.state.metodo}
                                                    onChange={(event) => { 
                                                        this.validaMetodo(event)
                                                        this.handleChangeMetodo(event)
                                                    }}
                                                    options={this.state.metodoOpcoes}
                                                    required
                                                    isClearable
                                                    isLoading={this.state.metodoCarregando}
                                                    placeholder={this.state.metodoPlaceholder}
                                                    styles={this.state.metodoEstilo}
                                                />
                                                <Input 
                                                    valid={ this.state.validacao.metodo === 'has-success' } 
                                                    invalid={ this.state.validacao.metodo === 'has-danger' } 
                                                    hidden
                                                />
                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="uri">URI</Label>
                                                <Input 
                                                    type="text" 
                                                    minLength="3"
                                                    maxLength="255"
                                                    id="uri" 
                                                    name="uri"
                                                    required 
                                                    value={this.state.uri}
                                                    onChange={(event) => { 
                                                        this.validaUri(event)
                                                        this.handleChange(event)
                                                    }}
                                                    valid={ this.state.validacao.uri === 'has-success' } 
                                                    invalid={ this.state.validacao.uri === 'has-danger' } 
                                                />
                                                <FormFeedback>{this.state.uriMsgErro}</FormFeedback>
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
                    className={'modal-primary ' + this.props.className}
                >
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir Serviço</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir o serviço?
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

export default ServicoForm;
