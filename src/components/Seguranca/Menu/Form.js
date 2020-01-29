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
    
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    FormFeedback,
} from 'reactstrap';

import Carregando from '../../Alerta/Carregando';
import Sucesso from '../../Alerta/Sucesso';
import Erro from '../../Alerta/Erro';
import { createHashHistory } from 'history';
import { isNull } from 'util';
import { 
    getEstiloInvalido,
    getEstiloValido,
} from '../../../components/Select';
import AsyncSelect from 'react-select/lib/Async';
import {
    getApiAutenticado
} from '../../Oauth';


class MenuForm extends Component {

    /**********
     * CONSTRUTOR
     */
    constructor(props) {
        super(props);
            
        this.state = {     
            
            id: 0, 
            nome: "",
            idMenuPai: null, 
            idMenuPaiOpcoes: [],
            idMenuPaiCarregando: false,
            idMenuPaiPlaceholder: "Digite e selecione o menu pai",
            idMenuPaiEstilo: getEstiloValido(),
            url: "",
            icone: "",
            posicao: "",

            nomeMsgErro: "Campo obrigatório",
            idMenuPaiMsgErro: "Campo obrigatório",
            urlMsgErro: "Campo obrigatório",
            iconeMsgErro: "Campo obrigatório",
            posicaoMsgErro: "Campo obrigatório",
            
            /**
             * VALIDAÇÃO
             */
            validacao: {

                nome: "has-danger",
                idMenuPai: "has-success",
                url: "has-danger",
                icone: "has-danger",
                posicao: "has-danger",
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
            this.getMenu();
        }        
    }


    /***********
     * HANDLES
     */
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value} );
    }

    aoSelecionarIdMenuPai = (event) => {
        
        if( isNull(event)) {
            this.setState({ 
                IdMenuPaiEstilo: getEstiloInvalido(),
                idMenuPai: null,
            });
        }
        else {
            this.setState({ 
                IdMenuPaiEstilo: getEstiloValido(),
                idMenuPai: event,
            }); 
        }
    }

    /************
     * VALIDAÇÕES
     */
    validaNome(event) {
        
        const { validacao } = this.state;
        let nomeMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.nome = 'has-danger';
            nomeMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value.length >= 3) && (event.target.value.length <= 100)) {            
            validacao.nome = 'has-success';
        }
        else {
            validacao.nome = 'has-danger';
            nomeMsgErro = "Deve possuir entre 3 a 100 caracteres";
        }

        this.setState({ validacao, nomeMsgErro });
    }

    validaIdMenuPai(event) {
        
        const { validacao } = this.state

        if( isNull(event)) {
            validacao.idMenuPai = 'has-danger';
        }
        else {
            validacao.idMenuPai = 'has-success';
        }

        this.setState({ validacao })
    }

    validaUrl(event) {
        
        const { validacao } = this.state;
        let urlMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.url = 'has-danger';
            urlMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value.length >= 3) && (event.target.value.length <= 255)) {            
            validacao.url = 'has-success';
        }
        else {
            validacao.url = 'has-danger';
            urlMsgErro = "Deve possuir entre 3 a 255 caracteres";
        }

        this.setState({ validacao, urlMsgErro });
    }

    validaIcone(event) {
        
        const { validacao } = this.state;
        let iconeMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.icone = 'has-danger';
            iconeMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value.length >= 3) && (event.target.value.length <= 100)) {            
            validacao.icone = 'has-success';
        }
        else {
            validacao.icone = 'has-danger';
            iconeMsgErro = "Deve possuir entre 3 a 100 caracteres";
        }

        this.setState({ validacao, iconeMsgErro });
    }

    validaPosicao(event) {
        
        const { validacao } = this.state;
        let posicaoMsgErro = "";

        if( isNull(event.target.value) || (event.target.value.length === 0)) {
            validacao.posicao = 'has-danger';
            posicaoMsgErro = "Campo obrigatório";
        }
        else if( (event.target.value > 0) && (event.target.value < 1000)) {            
            validacao.posicao = 'has-success';
        }
        else {
            validacao.posicao = 'has-danger';
            posicaoMsgErro = "Formato inválido";
        }

        this.setState({ validacao, posicaoMsgErro });
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

        if (
            (this.state.validacao.nome === 'has-success') 
            && (this.state.validacao.idMenuPai === 'has-success') 
            && (this.state.validacao.url === 'has-success') 
            && (this.state.validacao.icone === 'has-success') 
            && (this.state.validacao.posicao === 'has-success') 
        ) {
            // Confirma dados informados
            if( this.ehEdicao() ) {

                this.patchMenu();
            }
            else {
                this.postMenu();
            }
        }
        else {
            this.erroForm();
        }
    }

    aoExcluir = () => {

        this.alternarModelExclusao();

        this.deleteMenu();
    }

    aoVoltar = () => {
        const history = createHashHistory();

        history.push('/seguranca/menu/lista');
    }

    erroForm() {

        this.setState({ 
            erroMensagem: 'Preencha corretamente os campos do formulário antes de continuar.',
            erroExibe: true,
        });
    }


    aoPesquisarIdMenuPai = (event) => {

        const inputValue = event.replace(/\W/g, '');

        return inputValue;
    }

    carregarOpcoesIdMenuPai = (inputValue, callback) => {
        
        setTimeout(() => {
            this.getListaMenu(inputValue);
        }, 1000);

        setTimeout(() => {                        
            callback(this.state.idMenuPaiOpcoes);
        }, 2000);
    }

    /************
     * GET LISTA MENU
     */
    getListaMenu = async (pesquisa) => {
        try {

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                '/menu/search/getPageableAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': "nome,asc",
                        'search': pesquisa
                    }
                }
            );

            if(response.ok) {

                let lista = [];
                if(this.ehEdicao() && (pesquisa === "")) {
                    lista.push(this.state.idMenuPai);
                }
            
                for (let i = 0; i < response.data._embedded.menu.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.menu[i].id,
                            value: response.data._embedded.menu[i].id,
                            label: response.data._embedded.menu[i].nome,
                            link: response.data._embedded.menu[i]._links.self.href,
                        },
                    );                    
                }

                this.setState({ 
                    idMenuPaiOpcoes: lista,
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

    /*****************
     * GET SEGURANÇA MENU
     */
    getMenu = async () => {
        try {
            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.get(
                "/menu/" + this.props.id,
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
                    idMenuPai: "has-success",
                    url: "has-success",
                    icone: "has-success",
                    posicao: "has-success",
                }

                this.setState({ 
                    nome: response.data.nome,
                    idMenuPai: {
                        value: response.data.idMenuPai.id,
                        label: response.data.idMenuPai.nome,
                        link: response.data.idMenuPai._links.self.href,
                    },
                    url: response.data.url,
                    icone: response.data.icone,
                    posicao: response.data.posicao,

                    validacao: validacao,
                    carregandoExibe: false
                })
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: 'Não foi possível obter o menu.',
                    erroExibe: true,
                });
            }                      
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: 'Falha ao buscar o menu.',
                erroExibe: true,
            });
        }
    };


    /*********************
     * POST, PATCH E DELETE
     */

    postMenu = async () => {
        try {
            this.setState({ carregandoExibe: true });
            
           // define the api
           const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.post(                
                '/menu',
                {
                    nome: this.state.nome,
                    idMenuPai: (this.state.idMenuPai === null) ? null : this.state.idMenuPai.link,
                    url: this.state.url,
                    icone: this.state.icone,
                    posicao: this.state.posicao,
                },
            );

            if(response.ok) {
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O menu foi salvo!",
                    sucessoExibe: true 
                });
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível salvar o menu.",
                    erroExibe: true,
                });
            }
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do menu.",
                erroExibe: true,
            });
        }
    }
    
    patchMenu = async () => {
        try {            
            this.setState({ carregandoExibe: true });
           
            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.patch(                
                '/menu/' + this.props.id,
                {
                    nome: this.state.nome,
                    idMenuPai: (this.state.idMenuPai === null) ? null : this.state.idMenuPai.link,
                    url: this.state.url,
                    icone: this.state.icone,
                    posicao: this.state.posicao,
                }
            );

            if(response.ok) {
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O menu foi editado!",
                    sucessoExibe: true 
                });
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível editar o menu.",
                    erroExibe: true,
                });
            }
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao realizar o envio do menu.",
                erroExibe: true,
            });
        }
    }

    deleteMenu = async () => {
        try {
            this.setState({ carregandoExibe: true });

            // define the api
            const api = getApiAutenticado(this.props.accessToken);

            // start making calls
            const response = await api.delete(
                "/menu/" + this.props.id,
                {},
            );

            if(response.ok) {                
                this.setState({ 
                    carregandoExibe: false,
                    sucessoMensagem: "O menu foi excluído!",
                    sucessoExibe: true 
                });
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroMensagem: "Não foi possível excluir o menu.",
                    erroExibe: true,
                });
            }
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroMensagem: "Falha ao solicitar a exclusão do menu.",
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

                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="idMenuPai">Menu Pai</Label>
                                                <AsyncSelect
                                                    loadOptions={this.carregarOpcoesIdMenuPai}
                                                    value={this.state.idMenuPai}
                                                    id="idMenuPai"
                                                    name="idMenuPai"
                                                    placeholder={this.state.idMenuPaiPlaceholder}
                                                    isLoading={this.state.idMenuPaiCarregando}
                                                    isClearable
                                                    styles={this.state.idMenuPaiEstilo}
                                                    onChange={this.aoSelecionarIdMenuPai}
                                                    onInputChange={this.aoPesquisarIdMenuPai}
                                                />
                                                <Input
                                                    type="hidden"
                                                    name="idMenuPaiValidacao"
                                                    id="idMenuPaiValidacao"
                                                    value={this.state.idMenuPai ? this.state.idMenuPai.value : ''}
                                                    valid={this.state.idMenuPai ? true : false}
                                                    invalid={!this.state.idMenuPai ? true : false}
                                                    required
                                                />                                            
                                                <FormFeedback>{this.state.idMenuPaiMsgErro}</FormFeedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>                                                                           
                                        <Col xs="12" md="6">
                                            <FormGroup>
                                                <Label htmlFor="url">URL</Label>
                                                <Input 
                                                    type="text" 
                                                    minLength="3"
                                                    maxLength="255"
                                                    id="url" 
                                                    name="url"
                                                    required 
                                                    value={this.state.url}
                                                    onChange={(event) => { 
                                                        this.validaUrl(event)
                                                        this.handleChange(event)
                                                    }}
                                                    valid={ this.state.validacao.url === 'has-success' } 
                                                    invalid={ this.state.validacao.url === 'has-danger' } 
                                                />
                                                <FormFeedback>{this.state.urlMsgErro}</FormFeedback>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" md="3">
                                            <FormGroup>
                                                <Label htmlFor="icone">Ícone</Label>
                                                <InputGroup className="mb-4">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className={this.state.icone === "" ? "" : "fa " + this.state.icone + " fa-lg"}></i>
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input 
                                                        type="text" 
                                                        minLength="3"
                                                        maxLength="100"
                                                        id="icone" 
                                                        name="icone"
                                                        required 
                                                        value={this.state.icone}
                                                        onChange={(event) => { 
                                                            this.validaIcone(event)
                                                            this.handleChange(event)
                                                        }}
                                                        valid={ this.state.validacao.icone === 'has-success' } 
                                                        invalid={ this.state.validacao.icone === 'has-danger' } 
                                                    />
                                                    <FormFeedback>{this.state.iconeMsgErro}</FormFeedback>
                                                </InputGroup>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" md="3">
                                            <FormGroup>
                                                <Label htmlFor="posicao">Posição</Label>
                                                <Input 
                                                    type="number" 
                                                    min="1"
                                                    max="1000"
                                                    id="posicao" 
                                                    name="posicao"
                                                    required 
                                                    value={this.state.posicao}
                                                    onChange={(event) => { 
                                                        this.validaPosicao(event)
                                                        this.handleChange(event)
                                                    }}
                                                    valid={ this.state.validacao.posicao === 'has-success' } 
                                                    invalid={ this.state.validacao.posicao === 'has-danger' } 
                                                />
                                                <FormFeedback>{this.state.posicaoMsgErro}</FormFeedback>
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
                    <ModalHeader toggle={this.alternarModelExclusao}>Excluir Menu</ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir o menu?
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

export default MenuForm;
