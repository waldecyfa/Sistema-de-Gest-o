import React, { Component } from 'react';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Col,
	Form,
	FormGroup,
	FormFeedback,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Row,
	Label,
} from 'reactstrap';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import Carregando from '../../../../components/Alerta/Carregando';
import Sucesso from '../../../../components/Alerta/Sucesso';
import Erro from '../../../../components/Alerta/Erro';
import {
    getApiAutenticado
} from '../../../../components/Oauth';

class AlterarSenha extends Component {

	constructor(props) {
		super(props);

		this.state = {

			novaSenha: '',
			novaSenhaErro: "Campo obrigatório",
			novaSenhaConfirmacao: '',
			novaSenhaConfirmacaoErro: "Campo obrigatório",

			validacao: {
				novaSenha: 'has-danger',
				novaSenhaConfirmacao: 'has-danger',
			}, 
			
			carregandoExibe: false,
            erroTitulo: '',
            erroMensagem: '',
            erroExibe: false,
			sucessoExibe: false,
			sucessoMensagem: 'A senha foi alterada!'
		};
	}

	handleChange(event) {
        this.setState({ [event.target.name]: event.target.value} );
    }

	validacaoNovaSenha(event) {        

		const { validacao } = this.state;
		
		if (event.target.value === '') {
			validacao.novaSenha = 'has-danger';
			
			this.setState({ 
				validacao,
				novaSenhaErro: "Campo obrigatório"
			})
		}
		else if (event.target.value.length < 6) {
			validacao.novaSenha = 'has-danger';
			
			this.setState({ 
				validacao,
				novaSenhaErro: "Deve ter mais que 5 caracteres"
			})
		}
		else if (event.target.value !== this.state.novaSenhaConfirmacao) {
			validacao.novaSenha = 'has-danger';
			
			this.setState({ 
				validacao,
				novaSenhaErro: "Deve ser igual a senha abaixo"
			})
		}
        else {
			validacao.novaSenha = 'has-success' 
			validacao.novaSenhaConfirmacao = 'has-success'
			this.setState({ validacao })
        }
        
	}
	
	validacaoNovaSenhaConfirmacao(event) {   

		const { validacao } = this.state;

        if (event.target.value === '') {
			validacao.novaSenhaConfirmacao = 'has-danger';
			
			this.setState({ 
				validacao,
				novaSenhaConfirmacaoErro: "Campo obrigatório"
			})
		}
		else if (event.target.value.length < 6) {
			validacao.novaSenhaConfirmacao = 'has-danger';
			
			this.setState({ 
				validacao,
				novaSenhaConfirmacaoErro: "Deve ter mais que 5 caracteres"
			})
		}
		else if (event.target.value !== this.state.novaSenha) {
			validacao.novaSenhaConfirmacao = 'has-danger';
			
			this.setState({ 
				validacao,
				novaSenhaConfirmacaoErro: "Deve ser igual a senha acima"
			})
		}
        else {
			validacao.novaSenha = 'has-success' 
			validacao.novaSenhaConfirmacao = 'has-success' 
			this.setState({ validacao })     
        }
    }

	handleSubmit = (event) => {        
        event.preventDefault();

        if (
            (this.state.validacao.novaSenha === 'has-success') &&
            (this.state.validacao.novaSenhaConfirmacao === 'has-success')
        ) {

			this.patchUsuario();

		}  
		else {

			this.erroSalvar();
		}
	}

	erroSalvar() {

        this.setState({ 
            erroTitulo: 'Erro de Validação',
            erroMensagem: 'Preencha corretamente os campos do formulário antes de salvá-lo.',
            erroExibe: true,
        });
	}
	
    voltarInicio = () => {
        this.props.history.push('/inicio');
    }
	
	/**************************
     * PATCH USUARIO
     */
    patchUsuario = async () => {
        try {

            this.setState({ carregandoExibe: true });

            // define the api
           const api = getApiAutenticado(this.props.autenticacao.accessToken);

		   // start making calls
		   const response = await api.patch(                
                '/usuario/'+ this.props.autenticacao.username +'/',
                {
                    senha: this.state.novaSenha,
                }
            );

            if(response.ok) {
            
                this.setState({ 
                    carregandoExibe: false,
                    sucessoExibe: true 
                });
            }
            else {
                
                this.setState({ 
                    carregandoExibe: false,
                    erroTitulo: 'Erro',
                    erroMensagem: "Não foi possível alterar a senha.",
                    erroExibe: true,
                });
            }
            
        } catch (err) {

            this.setState({ 
                carregandoExibe: false,
                erroTitulo: 'Erro',
                erroMensagem: "Falha ao alterar a senha.",
                erroExibe: true,
            });
        }
    };

	render() {
		return (
			<div className="animated fadeIn">
				
				<Row>
					<Col xs="12" sm="4">
					</Col>
					<Col xs="12" sm="4">
						<Card>
							<CardHeader>
								<i className="fa fa-key"></i> Alterar Senha
							</CardHeader>
							<CardBody>
								<Form>

									<FormGroup>
										<Label htmlFor="novaSenha">Nova Senha</Label>
										<InputGroup className="mb-4">
											<InputGroupAddon addonType="prepend">
												<InputGroupText>
													<i className="fa fa-lock fa-lg"></i>
												</InputGroupText>
											</InputGroupAddon>
											<Input  
												type="password" 
												name="novaSenha"
												id="novaSenha"
												placeholder="Digite a nova senha"
												value={this.state.novaSenha} 
												valid={ this.state.validacao.novaSenha === 'has-success' } 
												invalid={ this.state.validacao.novaSenha === 'has-danger' }
												onChange={ (event) => { 
													this.validacaoNovaSenha(event) 
													this.handleChange(event) 
												}}
												autoFocus
											/>
											<FormFeedback>{this.state.novaSenhaErro}</FormFeedback>
										</InputGroup>
									</FormGroup>

									<FormGroup>
										<Label htmlFor="novaSenhaConfirmacao">Confirmação da Nova Senha</Label>
										<InputGroup className="mb-4">	
											<InputGroupAddon addonType="prepend">
												<InputGroupText>
													<i className="fa fa-lock fa-lg"></i>
												</InputGroupText>
											</InputGroupAddon>
											<Input  
												type="password" 
												name="novaSenhaConfirmacao"
												id="novaSenhaConfirmacao"
												placeholder="Repita a nova senha"
												value={this.state.novaSenhaConfirmacao} 
												valid={ this.state.validacao.novaSenhaConfirmacao === 'has-success' } 
												invalid={ this.state.validacao.novaSenhaConfirmacao === 'has-danger' }
												onChange={ (event) => { 
													this.validacaoNovaSenhaConfirmacao(event) 
													this.handleChange(event) 
												}}
											/>
											<FormFeedback>{this.state.novaSenhaConfirmacaoErro}</FormFeedback>
										</InputGroup>
									</FormGroup>
								</Form>
							</CardBody>

							<CardFooter>
								<Row>
									<Col xs="12" md="12" className="botao-centro">
										<Button 
											type="button" 
                                            color="primary" 
                                            onClick={this.handleSubmit}
										>
											<i className="fa fa-floppy-o"></i> Salvar
										</Button>
									</Col>
								</Row>
							</CardFooter>
						</Card>
					</Col>
					<Col xs="12" sm="4">
					</Col>
				</Row>

				<Sucesso 
                    aoConfirmar={() =>
                        this.setState({sucessoExibe: false}, () => {
                            this.voltarInicio()    
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

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(AlterarSenha));
