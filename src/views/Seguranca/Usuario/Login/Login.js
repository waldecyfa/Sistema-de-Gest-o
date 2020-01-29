import React, { Component } from 'react';
import {    
    Button,
    Card,
    CardBody,
    CardGroup,
    Col,
    Container,
    Form,          
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
} from 'reactstrap';
import {create} from 'apisauce';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as rootActions } from '../../../../store/ducks/root';
import logo from '../../../../assets/img/brand/logomarca.jpg';
import gifNavio from '../../../../assets/img/brand/carregando.gif';
import SweetAlert from 'react-bootstrap-sweetalert';
import {
    getBaseUrl,
    getClientId,
    getClientSecret,
    getGrantType
} from '../../../../components/Oauth';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {  

            validacao: {
                usuarioState: 'has-danger',
                senhaState: 'has-danger',
            },                          

            usuario: '',
            senha: '',
            senhaErro: 'Campo obrigatório',

            carregandoExibe: false,

            erroTitulo: '',
            erroMensagem: '',
            erroExibe: false,
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value} );
    }

    validacaoUsuario(event) {
        const { validacao } = this.state
        if (/^[a-zA-Z0-9].+@[a-zA-Z0-9].+\.[A-Za-z]+$/.test(event.target.value)) {
            validacao.usuarioState = 'has-success'
        } else {
            validacao.usuarioState = 'has-danger'
        }
        this.setState({ validacao })
    }

    validacaoSenha(event) {        

		const { validacao } = this.state;
		
		if (event.target.value === '') {
			validacao.senhaState = 'has-danger';
			
			this.setState({ 
				validacao,
				senhaErro: "Campo obrigatório"
			})
		}
		else if (event.target.value.length < 6) {
			validacao.senhaState = 'has-danger';
			
			this.setState({ 
				validacao,
				senhaErro: "Deve ter mais que 5 caracteres"
			})
		}
        else {
			validacao.senhaState = 'has-success' 
			this.setState({ validacao })
        }
        
	}

    handleSubmit = (event) => {        
        event.preventDefault();

        if (
            (this.state.validacao.usuarioState === 'has-success') &&
            (this.state.validacao.senhaState === 'has-success')
        ) {
            this.getToken();    
        } else {
            this.erroLogin();
        }      
    }

    erroLogin() {

        this.setState({ 
            erroTitulo: 'Erro',
            erroMensagem: 'Preencha corretamente os campos de autenticação.',
            erroExibe: true,
        });
	}


    
    /*************
     * GET TOKEN
     */
    getToken = async () => {
        try {

            this.setState({ carregandoExibe: true });

            // define the api
            const api = create({
                baseURL: getBaseUrl(),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // start making calls
            const response = await api.post(
                '/oauth/token',
                {},
                {
                    auth: {
                        username: getClientId(),
                        password: getClientSecret()
                    },
                    params: {
                        grant_type: getGrantType(),
                        username: this.state.usuario,
                        password: this.state.senha
                    },
                }
            );

            if(response.ok) {
                
                this.props.setToken(
                    response.data.access_token,
                    response.data.token_type,
                    response.data.refresh_token,
                    response.data.scope,
                );

                // this.setState({ carregandoExibe: false });

                this.getUsuario();
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroTitulo: 'Erro',
                    erroMensagem: 'Não foi possível autenticar o usuário a partir dos dados informados.',
                    erroExibe: true,
                });
            }
           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroTitulo: 'Erro',
                erroMensagem: 'Falha ao tentar autenticar o usuário.',
                erroExibe: true,
            });
        }
    };

    /*************
     * GET USUÁRIO
     */
    getUsuario = async () => {
        try {

            // this.setState({ carregandoExibe: true })

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
                '/usuario/search/findByUsername',
                {},
                {
                    params: {
                        'username': this.state.usuario,
                        'projection': 'completa'
                    }
                }
            );

            if(response.ok) {

                this.props.setUsuarioLogado(
                    response.data.username,
                    response.data.usuarioPerfis[0].perfil.nome,                    
                    response.data.idPessoa,
                );

                switch (response.data.usuarioPerfis[0].perfil.nome) {
                    case "ROLE_ADMIN":
                        this.setState({ 
                            carregandoExibe: false
                        }, () => { this.props.history.push('/') })                        
                        break;

                    case "ROLE_OPERADOR_PORTUARIO":
                        this.getOperadorPortuario();
                        break;
                
                    default:

                        this.setState({ 
                            carregandoExibe: false,
                            erroTitulo: 'Erro',
                            erroMensagem: 'Não foi possível identificar o perfil do usuário.',
                            erroExibe: true,
                        });

                        this.props.setLogout();

                        break;
                }
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroTitulo: 'Erro',
                    erroMensagem: 'Não foi possível obter os dados do usuário.',
                    erroExibe: true,
                });

                this.props.setLogout();
            }
           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroTitulo: 'Erro',
                erroMensagem: 'Falha ao buscar os dados do usuário.',
                erroExibe: true,
            });

            this.props.setLogout();
        }
    };

    
    /*************
     * GET OPERADOR PORTUÁRIO
     */
    getOperadorPortuario = async () => {
        try {

            // this.setState({ carregandoExibe: true })

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
                '/operadorPortuario/search/getPorIdPessoa',
                {},
                {
                    params: {
                        'idPessoa': this.props.autenticacao.idPessoa.id
                    }
                }
            );

            if(response.ok) {

                this.props.setPessoaLogada(
                    response.data.idPessoaJuridica.id,
                    response.data.idPessoaJuridica.nome,
                    response.data.idPessoaJuridica.razaoSocial,
                    response.data.id,
                );

                this.setState({ 
                    carregandoExibe: false
                })

                this.props.history.push('/');
            }
            else {
                this.setState({ 
                    carregandoExibe: false,
                    erroTitulo: 'Erro',
                    erroMensagem: 'Não foi possível obter os dados do operador portuário.',
                    erroExibe: true,
                });

                this.props.setLogout();
            }
           
        } catch (err) {
            this.setState({ 
                carregandoExibe: false,
                erroTitulo: 'Erro',
                erroMensagem: 'Falha ao buscar dados do operador portuário.',
                erroExibe: true,
            });

            this.props.setLogout();
        }
    };

    /*************
     * RENDER
     */
    render() {

        return (      
            <div className="app flex-row align-items-center">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="4">
                            <CardGroup>
                                <Card className="p-4">

                                    <img src={logo} alt="OGMO-ES" className="figure-img img-fluid rounded" />

                                    <CardBody>

                                        <Form onSubmit={ (event) => this.handleSubmit(event)}>

                                            <h4>Acesse sua conta</h4>

                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-user fa-lg"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input  
                                                    type="text" 
                                                    name="usuario" 
                                                    placeholder="Usuário"                                 
                                                    value={this.state.usuario}                                 
                                                    autoComplete="usuario" 
                                                    autoFocus
                                                    valid={ this.state.validacao.usuarioState === 'has-success' } 
                                                    invalid={ this.state.validacao.usuarioState === 'has-danger' } 
                                                    onChange={ (event) => { 
                                                        this.validacaoUsuario(event) 
                                                        this.handleChange(event) 
                                                    }}
                                                />
                                                <FormFeedback>Campo obrigatório</FormFeedback>
                                            </InputGroup>

                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="fa fa-lock fa-lg"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input  
                                                    type="password" 
                                                    name="senha"
                                                    placeholder="Senha"
                                                    value={this.state.senha} 
                                                    valid={ this.state.validacao.senhaState === 'has-success' } 
                                                    invalid={ this.state.validacao.senhaState === 'has-danger' }
                                                    onChange={ (event) => { 
                                                        this.validacaoSenha(event) 
                                                        this.handleChange(event) 
                                                    }}
                                                />
                                                <FormFeedback>{this.state.senhaErro}</FormFeedback>
                                            </InputGroup>

                                            <Row>                         
                                                <Col xs="6">
                                                    <Button   
                                                        type="submit" 
                                                        value="Submit" 
                                                        color="primary" 
                                                        className="px-4"                                    
                                                    >
                                                        <i className="fa fa-sign-in"></i> Entrar
                                                    </Button>
                                                </Col>                                         
                                            </Row>   

                                        </Form>

                                    </CardBody>
                                </Card>
                            </CardGroup>              
                        </Col>

                        <SweetAlert
                            show={this.state.carregandoExibe}
                            title="Aguarde"
                            onConfirm={() => this.setState({carregandoExibe: false})}
                            showConfirm={false}
                            custom
                            customIcon={gifNavio}
                        >
                            Navegando...
                        </SweetAlert>

                        <SweetAlert 
                            error
                            confirmBtnText="Ok"
                            confirmBtnBsStyle="primary"
                            title={this.state.erroTitulo}
                            onConfirm={() => this.setState({erroExibe: false})}
                            show={this.state.erroExibe}
                        >
                            {this.state.erroMensagem}
                        </SweetAlert>
                    </Row>         
                </Container>          
            </div>
        );
    }
}

/************
 * REDUX
 */
const mapDispatchToProps = dispatch => 
    bindActionCreators( Object.assign({}, autenticacaoActions, rootActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    root: state.root
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Login));