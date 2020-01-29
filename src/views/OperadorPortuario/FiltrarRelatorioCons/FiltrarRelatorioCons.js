import React, { Component } from 'react';
import {
	Alert,
	Button,
	ButtonToolbar,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Col,
	Form,
	FormGroup,
	FormFeedback,
	Input,
	Label,
	Row,	

} from 'reactstrap';
import Select from 'react-select';
import { isNull } from 'util';
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../store/ducks/autenticacao';
import {create} from 'apisauce';
import {
    getBaseUrl,
} from '../../../components/Oauth';
import gifNavio from '../../../assets/img/brand/carregando.gif';


class FiltrarRelatorioCons extends Component {

	constructor(props) {
		super(props);

			this.handleChange = this.handleChange.bind(this);
			this.onDismiss = this.onDismiss.bind(this);
			this.onDismisssConsolidacao = this.onDismisssConsolidacao.bind(this);
			this.onDismisssPeriodo = this.onDismisssPeriodo.bind(this);
			this.onDismisssData = this.onDismisssData.bind(this);
			this.handleSubmit = this.handleSubmit.bind(this);

			this.state = {			
								
				//VALIDATE:

				validate: {
					periodoState: false,
					dataState: false,
					consolidarState: false,	
					relatorioState: false,
					classConsolidaRelatorioState: false,
				},
				check: {
					relatorioCliente:false,
					relatorioAtividade:false,
					relatorioNavio:false,
					totalizadorEstaPaga:false,
					exibeViagem:false,
				},				

				relatorioFolha:true,
				relatorioEstatistica:false,
				periodoPagamento: true,
				periodoOperacao: false,
				relatorioTipo:'',

				consolidarRequisitante: true,
				consolidarRequisitNavio: false, 
				consolidarRequisitClient: false, 
				consolidarRequisitNavioClient: false,
				consolidar: '',	
				validaConsolidar: false,

				classConsolidaRelatorio: 'oculta-filtro',

				dataInicial: '',
				dataFinal: '',
				validaDataFinal: false,
				
				exibirTotais: '',
				totaisRelatorio: false,
				requisitante: '',
				quebrarPagiona: '',
				visible: false,
				validaExibirTotais: false,
				
				alertaPeriodo: false,
				alertaData: false,
				alertaConsolidacao:false,
								
				
				validaRequisitante: false,
				validaCliente: false,
				validaNavio: false,

				validaquebrarPagiona: false,
				
				//  PRODUÇÕES
				 
				cliente: '',
				clienteSelecionado: null,
				clienteOpcoes: [],
				clienteCarregando: false,
				clientePlaceholder: "Selecione um cliente",
				clienteEstilo: "",

				listaProducao: [],

				producao: '',
				produtoSelecionado: null,
				produtoOpcoes: [],
				produtoCarregando: false,
				produtoPlaceholder: "Selecione um produto",
				produtoEstilo: "",

				movimentacaoSelecionada: null,
				movimentacaoOpcoes: [],
				movimentacaoCarregando: false,
				movimentacaoPlaceholder: "Selecione uma movimentação",
				movimentacaoEstilo: "",

				//  DADOS DA REQUISIÇÃO
				 
				navio: '',
				navioSelecionado: null,
				navioOpcoes: [],
				navioCarregando: false,
				navioPlaceholder: "Selecione um navio",
				navioEstilo: "",

				dataOperacao: '',
							
			};		

		console.log("states",this.state)
		}

		
	//  COMPONENT DID MOUNT	
		
	componentDidMount() {			
		
		this.setState({ 
			
			carregandoExibe: true

		}, () => {
			this.getListaNavio();
			this.getListaProduto();
            this.getListaMovimentacao();
			this.getListaCliente();
		});
	}		
	
	// LISTA CLIENTE
	getListaCliente = async () => {
		try {

			this.setState({ 
				clienteCarregando: true
			});

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
				'/cliente/search/getAtivos',
				{},
			);

			console.log('Ok - cliente: ', response.ok);
			console.log('Data - cliente: ', response.data);
				
			if(response.ok && (response.data._embedded.cliente.length > 0) ) {
			
				let opcoes = [];

				for (let i = 0; i < response.data._embedded.cliente.length; i++) {

					opcoes.push( 
						{ 
							id: response.data._embedded.cliente[i].id,
							cnpj: response.data._embedded.cliente[i].idPessoaJuridica.cnpj,
							razaoSocial: response.data._embedded.cliente[i].idPessoaJuridica.razaoSocial,
							label: response.data._embedded.cliente[i].idPessoaJuridica.nome,
							value: response.data._embedded.cliente[i]._links.self.href 
						}
					);
				}

				const opcoesOrdenada = [].concat(opcoes)
				.sort( function(a, b) {
					if(a.label < b.label) { return -1; }
					if(a.label > b.label) { return 1; }
					return 0;
				})

				// console.log('clienteOpcoes: ', opcoes);

				this.setState({ 
					clienteOpcoes: [...opcoesOrdenada],
					clienteCarregando: false,
				}, () => {
					
					this.verificaCarregando();
				});
			}
			else {

				this.setState({ 
					clienteCarregando: false,
					clientePlaceholder: "Erro ao carregar...",
					clienteOpcoes: [],
				}, () => {

					this.verificaCarregando();
				});
			}
		
		} catch (err) {

			this.setState({ 
				clienteCarregando: false,
				clientePlaceholder: "Erro ao carregar...",
				clienteOpcoes: [],
			}, () => {

				this.verificaCarregando();
			});
		}
	};

	//  LISTA NAVIO
	getListaNavio = async () => {
		try {

			this.setState({ 
				navioCarregando: true
			});

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
				'/navio/search/getAtivos',
				{},
				{
					params: {
						'projection': 'completa'
					}
				}
			);

			console.log('Ok - navio: ', response.ok);
			console.log('Data - navio: ', response.data);
				
			if(response.ok && (response.data._embedded.navio.length > 0) ) {
			
				let opcoes = [];

				for (let i = 0; i < response.data._embedded.navio.length; i++) {

					opcoes.push( 
						{ 
							label: response.data._embedded.navio[i].nome, 
							id: response.data._embedded.navio[i].id,
							lloyd: response.data._embedded.navio[i].lloyd,
							idTipoNavio: response.data._embedded.navio[i].idTipoNavio.id,
							value: response.data._embedded.navio[i]._links.self.href 
						}
					);
				}

				this.setState({ 
					navioOpcoes: [...opcoes],
					navioCarregando: false,
				}, () => {
					
					this.verificaCarregando();
				});
			}
			else {

				this.setState({ 
					navioCarregando: false,
					navioPlaceholder: "Erro ao carregar...",
					navioOpcoes: [],
				}, () => {

					this.verificaCarregando();
				});
			}
		
		} catch (err) {

			this.setState({ 
				navioCarregando: false,
				navioPlaceholder: "Erro ao carregar...",
				navioOpcoes: [],
			}, () => {

				this.verificaCarregando();
			});
		}
	};	

	//  LISTA PRODUTO     
    getListaProduto = async () => {
        try {

            this.setState({ 
                produtoCarregando: true
            });

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
                '/produtoFolha',
                {},
            );

            console.log('Ok - produto: ', response.ok);
            console.log('Data - produto: ', response.data);
                
            if(response.ok && (response.data._embedded.produtoFolha.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.produtoFolha.length; i++) {

                    opcoes.push( 
                        { 
							label: response.data._embedded.produtoFolha[i].nome + " - " + response.data._embedded.produtoFolha[i].descricao, 
							nome: response.data._embedded.produtoFolha[i].nome,
							descricao: response.data._embedded.produtoFolha[i].descricao,
                            id: response.data._embedded.produtoFolha[i].id,
                            value: response.data._embedded.produtoFolha[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    produtoOpcoes: [...opcoes],
                    produtoCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    produtoCarregando: false,
                    produtoPlaceholder: "Erro ao carregar...",
                    produtoOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                produtoCarregando: false,
                produtoPlaceholder: "Erro ao carregar...",
                produtoOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

	// LISTA MOVIMENTAÇÃO     
    getListaMovimentacao = async () => {
        try {

            this.setState({ 
                movimentacaoCarregando: true
            });

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
                '/movimentacao',
                {},
            );

            console.log('Ok - movimentacao: ', response.ok);
            console.log('Data - movimentacao: ', response.data);
                
            if(response.ok && (response.data._embedded.movimentacao.length > 0) ) {
            
                let opcoes = [];

                for (let i = 0; i < response.data._embedded.movimentacao.length; i++) {

                    opcoes.push( 
                        { 
                            label: response.data._embedded.movimentacao[i].descricao, 
                            descricaoAbreviada: response.data._embedded.movimentacao[i].descricaoAbreviada,
                            id: response.data._embedded.movimentacao[i].id,
                            value: response.data._embedded.movimentacao[i]._links.self.href 
                        }
                    );
                }

                this.setState({ 
                    movimentacaoOpcoes: [...opcoes],
                    movimentacaoCarregando: false,
                }, () => {
                    
                    this.verificaCarregando();
                });
            }
            else {

                this.setState({ 
                    movimentacaoCarregando: false,
                    movimentacaoPlaceholder: "Erro ao carregar...",
                    movimentacaoOpcoes: [],
                }, () => {

                    this.verificaCarregando();
                });
            }
           
        } catch (err) {

            this.setState({ 
                movimentacaoCarregando: false,
                movimentacaoPlaceholder: "Erro ao carregar...",
                movimentacaoOpcoes: [],
            }, () => {

                this.verificaCarregando();
            });
        }
    };

	
	onDismiss() {
		this.setState({ visible: false });
	}

	onDismisssPeriodo() {
		this.setState({ alertaPeriodo: false });
	}

	onDismisssData() {
		this.setState({ alertaData: false });
	}
	
	onDismisssConsolidacao(){
		this.setState({ alertaConsolidacao: false});
	}

	defineCarregando(navio,produto, movimentacao,cliente, ) {
		return {
			navio: navio,
			cliente: cliente,
			produto: produto,
			movimentacao: movimentacao
		};

	}
	
	verificaCarregando() {

		const listaCarregando = this.defineCarregando(
			this.state.navioCarregando,
			this.state.produtoCarregando,
            this.state.movimentacaoCarregando,
			this.state.clienteCarregando,
		);

		console.log('listaCarregando', listaCarregando)

		const existeCarregando = Object.keys(listaCarregando).some(x => listaCarregando[x]);

		console.log('existeCarregando', existeCarregando)

		if(!existeCarregando) {
			this.setState({ carregandoExibe: false });
		}
	
	}

	verificaDataInicial(data) {
		if (
			(data !== '') &&
			(data > "2005-01-01")
		) {
			return true
		}
		else {
			return false
		}
	}

	verificaDataFinal(dataInicial, dataFinal) {

		if( (dataFinal !== '') &&
			(dataInicial < dataFinal)
		){
			return true	
		} 
		else {
			return false
		}
	}

	verificaDiferencaData(dataInicial, dataFinal) {
		var _dataInicial = new Date(this.converteDataJs(dataInicial));
		var _dataFinal = new Date(this.converteDataJs(dataFinal));
		var diferencaHoras = Math.abs(_dataFinal.getTime() - _dataInicial.getTime());
		var diferencaDias = Math.ceil(diferencaHoras / (1000 * 3600 * 24)); 
		console.log('diferencaDias',diferencaDias);
		if(diferencaDias < 31){
			return true	
		}
		else {
			return false
		}
	}

	converteDataJs(data){
		const arrayData = data.split('-')
		const dataBr = arrayData[1] +'/'+ arrayData[2] +'/'+ arrayData[0]
		console.log(dataBr);

		return dataBr
	}

	validateDateInicial(event) {
		const { validate } = this.state

		if (
			this.verificaDataInicial(event.target.value) &&
			this.verificaDataFinal(event.target.value, this.state.dataFinal) &&
			this.verificaDiferencaData(event.target.value, this.state.dataFinal)
		) {		
			validate.dataState = true	

			this.setState({ 
				validate,
				alertaData: false
			},() => {
				console.log("states",this.state)
			})
		} 
		else {
			validate.dataState = false

			this.setState({ 
				validate,
				alertaData: true
			},() => {
				console.log("states",this.state)
			})
		}
		
	}
	
	validateDateFinal(event) {
		const { validate } = this.state

		if (
			this.verificaDataInicial(this.state.dataInicial) &&
			this.verificaDataFinal(this.state.dataInicial, event.target.value) &&
			this.verificaDiferencaData(this.state.dataInicial, event.target.value)
		) {		
			validate.dataState = true	

			this.setState({ 
				validate,
				alertaData: false
			},() => {
				console.log("states",this.state)
			})
		} 
		else {
			validate.dataState = false
			
			this.setState({ 
				validate,
				alertaData: true
			},() => {
				console.log("states",this.state)
			})
		}
	}

	onChangePeriodoPagamento() {

		const { validate } = this.state
		validate.periodoState = true

		this.setState({
			periodoPagamento: true,
			periodoOperacao: false,
			alertaPeriodo: false,
			validate
		},() => {
			console.log("states",this.state)
		})
	}

	onChangePeriodoOperacao() {

		const { validate } = this.state
		validate.periodoState = true

		this.setState({
			periodoPagamento: false,
			periodoOperacao: true,
			alertaPeriodo: false,
			validate
		},() => {
			console.log("states",this.state)
		})
		
	}

	onChangeTipoDeRelatorioFolha(){

		const { validate } = this.state
		validate.relatorioState = true

		this.setState({
			relatorioFolha:true,
			relatorioEstatistica:false,
			classConsolidaRelatorio: 'oculta-filtro',
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("states",this.state)
		})

	}

	onChangeTipoDeRelatorioEstatistica(){

		const { validate } = this.state
		validate.relatorioState = true

		this.setState({
			relatorioFolha:false,
			relatorioEstatistica:true,
			classConsolidaRelatorio: '',
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("states",this.state)
		})

	}

	onChangeConsolidarRequisitante() {
		const {validate} = this.state
		validate.consolidarState = true

		this.setState({
			consolidarRequisitante: true,
			consolidarRequisitNavio: false, 
			consolidarRequisitClient: false, 
			consolidarRequisitNavioClient: false,
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}

	onChangeConsolidarRequisitNavio() {
		const {validate} = this.state
		validate.consolidarState = true

		this.setState({
			consolidarRequisitante: false,
			consolidarRequisitNavio: true, 
			consolidarRequisitClient: false, 
			consolidarRequisitNavioClient: false,
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}

	onChangeConsolidarRequisitClient() {
		const {validate} = this.state
		validate.consolidarState = true

		this.setState({
			consolidarRequisitante: false,
			consolidarRequisitNavio: false, 
			consolidarRequisitClient: true, 
			consolidarRequisitNavioClient: false,
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}

	onChangeConsolidarRequisitNavioClient() {
		const {validate} = this.state
		validate.consolidarState = true

		this.setState({
			consolidarRequisitante: false,
			consolidarRequisitNavio: false, 
			consolidarRequisitClient: false, 
			consolidarRequisitNavioClient: true,
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}
	
	onChangeTotaisPorRelatorio(event){

		const {check} = this.state
		check[event.target.name] = event.target.checked

		this.setState({ 
			relatorioCliente : false,
			relatorioAtivida : false,
			relatorioNavio : false,
			check
		},() => {
			console.log("states",this.state)
		})
		
	}	

	// MENSAGEM DE ALERTA
	handleSubmit = (event) => {
		event.preventDefault();
		console.log("states",this.state.validate)

		if (this.state.validate.periodoState && this.state.validate.dataInicialState && this.state.validate.dataFinalState && this.state.validate.consolidarState && this.state.validate.classConsolidaRelatorioState) {
			// this.props.history.push('/operador-portuario/relatorioConsolidacao');
		}

		if (!this.state.validate.periodoState) {
			this.setState({ alertaPeriodo: true });
		}

		if (!this.state.validate.dataState) {
			this.setState({ alertaData: true });
		}

		if(!this.state.relatorioFolha){	
			if(!this.state.validate.consolidarState){							
			this.setState({ alertaConsolidacao: true})
			}
			this.setState({ alertaConsolidacao: true});
			
		}
		//alert('Login: ' + this.state.login);
		//alert('Password: ' + this.state.password);
			
	}
	
	handleChange(event) {
		console.log("evento",event.target.name)
		console.log("evento",event.target.value)
		this.setState({ [event.target.name]: event.target.value
	},() => {
		console.log("states",this.state)
	})

	}

	handleClienteSelectChange = (event) => {
        
        console.log('handleClienteSelectChange:', event);
        
        if( isNull(event)) {            
            this.setState({ clienteSelecionado: null });
        }
        else {
            this.setState({ clienteSelecionado: event });
        }
    }

	handleNavioSelectChange = (event) => {
		
		console.log('handleNavioSelectChange:', event);
		
		if( isNull(event)) {			
			this.setState({ 
				navioSelecionado: null,
			});
		}
		else {			
			this.setState({ navioSelecionado: event });
		}
	}

	handleProdutoSelectChange = (event) => {
        
        console.log('handleProdutoSelectChange:', event);
        
        if( isNull(event)) {
            this.setState({ produtoSelecionado: null });
        }
        else {
            this.setState({ produtoSelecionado: event });
        }
	}
	
	handleMovimentacaoSelectChange = (event) => {
        
        console.log('handleMovimentacaoSelectChange:', event);
        
        if( isNull(event)) {
           this.setState({ movimentacaoSelecionada: null });
        }
        else {
           this.setState({ movimentacaoSelecionada: event });
        }
    }

	render() {

		return (

			<div className="animated fadeIn">

				 <Form onSubmit={(event) => this.handleSubmit(event)}> 

					<Row>

						<Col xs="12" md="12">

							<Card>

								<CardHeader>
									<strong>Consolidação de Pagamentos</strong>
								</CardHeader>

									<CardBody>
									{/* <Form onSubmit={ (event) => this.handleSubmit(event)}>*/}
                                    <div id="accordion">
										<Row>
											<Col xs="12" md="8">
												<FormGroup row>
													<Col xs="12" md="12">
														<strong>Tipo de Relatorio:</strong>
													</Col>
													<Col md="4">
														<FormGroup check className ="radio">
															<Input 
																type="radio" 
																name="relatorioTipo"
																id="relatorioFolha"
																value={this.state.relatorioFolha}
																onChange={(event) => {
																	this.onChangeTipoDeRelatorioFolha()
																}}	
																defaultChecked															
															/>
															
															<Label check className="form-check-label">Folha de Pagamento</Label>
														</FormGroup>														
														<FormGroup check className ="radio">
															<Input 
																type="radio"
																name="relatorioTipo"
																id="relatorioEstatistica" 
																value={this.state.relatorioEstatistica}
																onChange={(event) => {
																	this.onChangeTipoDeRelatorioEstatistica()
																}}																	
																/>
															<Label check className="form-check-label">Estatística</Label>
														</FormGroup>
													</Col>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col xs="12" md="6">
												<FormGroup row>
													<Col md="12">
														<strong>Período do Relatório:*</strong>
													</Col>
													<Col md="8">
														<FormGroup check className="radio">
															<Input
																type="radio" 
																name="periodo"
																id="periodoPagamento"
																value={this.state.periodoPagamento} 
																valid={this.state.validate.periodoState === 'has-success'}
																invalid={this.state.validate.periodoState === 'has-danger'}
																onChange={(event) => {																
																	this.onChangePeriodoPagamento()
																}}
																defaultChecked
															/>
															<Label check className="form-check-label" htmlFor="periodo-1">Data de Pagamento</Label>
														</FormGroup>
														<FormGroup check className="radio">
															<Input
																type="radio"
																name="periodo"
																id="periodoOperacao"
																value={this.state.periodoOperacao}
																valid={this.state.validate.periodoState === 'has-success'}
																invalid={this.state.validate.periodoState === 'has-danger'}
																onChange={(event) => {
																	this.onChangePeriodoOperacao()
																}}
															/>
															<Label check className="form-check-label" htmlFor="periodo-2">Data de Operação</Label>
														</FormGroup>
														<FormFeedback valid>Senha no formato aceitável!</FormFeedback>
														<FormFeedback>É melhor um passaro na mão do que dois voando!</FormFeedback>
														<Alert color="danger"
															isOpen={this.state.alertaPeriodo}
															toggle={this.onDismisssPeriodo}
															fade={false}>Escolha uma das opções acima.
														</Alert>
														
													</Col>
												</FormGroup>
												
											</Col>
											<Col xs="12" md="6">
												<FormGroup row>
													<Col md="12">
														<strong>Intervalo do Relatório:*</strong>
													</Col>
													<Col md="3">
														<Label htmlFor="date-input">Data Inicial:</Label>
													</Col>
														<Col xs="12" md="6" sm="12">
															<Input type="date" 
																id="dataInicial" 
																name="dataInicial" 
																placeholder="date"
																value={this.state.dataInicial}
																onChange={(event) => {
																	this.validateDateInicial(event)
																	this.handleChange(event)
																}}
															/>
														</Col>
												</FormGroup>
												<FormGroup row>
													<Col md="3">
														<Label htmlFor="data-final">Data Final:</Label>
													</Col>
														<Col xs="12" md="6" sm="12">
															<Input
																type="date"
																id="dataFinal"
																name="dataFinal"														
																value={this.state.dataFinal}
																onChange={(event) => {
																	this.validateDateFinal(event)
																	this.handleChange(event)
																}}
															/>
														</Col>
												</FormGroup>
												<Alert color="danger"
													isOpen={this.state.alertaData}
													toggle={this.onDismisssData}
													fade={false}>Escolha uma Data Inicial e uma Data Final válida.
												</Alert>
											</Col>
										</Row>
										<Row></Row>
										<Row>											
											<Col xs="12" md="6">
												<strong>Exibir Totais no Relatório Por:</strong>
												<Row>
													<Col xs="12" md="3">
														<FormGroup row>
															<Col xs="12" md="2">
																<FormGroup check inline>
																	<Input 
																		className="form-check-input" 
																		type="checkbox" 
																		id="relatorioAtividade" 
																		name="relatorioAtividade" 
																		value={this.state.relatorioAtividade}
																		onClick={((e) => this.onChangeTotaisPorRelatorio(e))}
																		/>
																	<Label className="form-check-label" check htmlFor="inline-checkbox1">Atividade</Label>
																</FormGroup>
															</Col>
														</FormGroup>
													</Col>
													<Col xs="12" md="3">
														<FormGroup row>
															<Col xs="12" md="2">
																<FormGroup check inline>
																	<Input 
																		className="form-check-input" 
																		type="checkbox" 
																		id="relatorioCliente" 
																		name="relatorioCliente" 
																		value={this.state.relatorioCliente}
																		onClick={((e) => this.onChangeTotaisPorRelatorio(e))}
																		/>
																	<Label className="form-check-label" check htmlFor="inline-checkbox1">Cliente</Label>
																</FormGroup>
															</Col>
														</FormGroup>
													</Col>
													<Col xs="12" md="3">
														<FormGroup row>
															<Col xs="12" md="2">
																<FormGroup check inline>
																	<Input 
																		className="form-check-input" 
																		type="checkbox" 
																		id="relatorioNavio" 
																		name="relatorioNavio" 
																		value={this.state.relatorioNavio}
																		valid={this.state.relatorioPorNavioState === 'has-success'}
																		invalid={this.state.relatorioPorNavioState === 'has-danger'}
																		onClick={((e) => this.onChangeTotaisPorRelatorio(e))}
																		/>
																	<Label className="form-check-label" check htmlFor="inline-checkbox1">Navio</Label>
																</FormGroup>
															</Col>
														</FormGroup>
													</Col>	
												</Row>
											</Col>
											<Col xs="12" md="6" className={this.state.classConsolidaRelatorio}>
												<Row>
													<Col xs="12" md="12">
														<strong>Consolidar Relatório Por:* <small><i> (Estatística)</i></small></strong>
													</Col>
													<Col xs="12" md="5">
														<FormGroup row>
															<Col xs="12" md="4">
																<FormGroup check className="radio">
																	<Input className="form-check-input" 
																	type="radio" 
																	name="consolidar" 
																	id="consolidarRequisitante" 
																	value={this.state.consolidarRequisitante}
																	valid={this.state.validate.consolidarState === 'has-success'}
																	invalid={this.state.validate.consolidarState === 'has-danger'}
																	onChange={(event) => {
																		this.onChangeConsolidarRequisitante()
																	}} 
																	defaultChecked
																	/>
																	<Label check className="form-check-label" htmlFor="consolidar1">Requisitante</Label>
																</FormGroup>
																<FormGroup check className="radio">
																	<Input className="form-check-input" 
																	type="radio" 
																	name="consolidar" 
																	id="consolidarRequisitNavio" 
																	value={this.state.consolidarRequisitNavio}
																	valid={this.state.validate.consolidarState === 'has-success'}
																	invalid={this.state.validate.consolidarState === 'has-danger'}
																	onChange={(event) => {
																		this.onChangeConsolidarRequisitNavio()
																	}} 
																	/>
																	<Label check className="form-check-label" htmlFor="consolidar2">Requisitante/Navio</Label>
																</FormGroup>
															</Col>
														</FormGroup>
													</Col>
													<Col xs="12" md="4">
														<FormGroup row>
															<Col xs="12" md="4">
																<FormGroup check className="radio">
																	<Input className="form-check-input" 
																	type="radio" 
																	name="consolidar" 
																	id="consolidarRequisitClient" 
																	value={this.state.consolidarRequisitClient}
																	valid={this.state.validate.consolidarState === 'has-success'}
																	invalid={this.state.validate.consolidarState === 'has-danger'}
																	onChange={(event) => {
																		this.onChangeConsolidarRequisitClient()
																	}} 																
																	/>
																	<Label check className="form-check-label" htmlFor="consolidar3">Requisitante/Cliente</Label>
																</FormGroup>
																<FormGroup check className="radio">
																	<Input className="form-check-input" 
																	type="radio" 
																	name="consolidar" 
																	id="consolidarRequisitNavioClient" 
																	value={this.state.consolidarRequisitNavioClient}
																	valid={this.state.validate.consolidarState === 'has-success'}
																	invalid={this.state.validate.consolidarState === 'has-danger'}
																	onChange={(event) => {
																		this.onChangeConsolidarRequisitNavioClient()
																	}}  																
																	/>
																	<Label check className="form-check-label" htmlFor="consolidar4">Requisitante/Navio/Cliente</Label>
																</FormGroup>
															</Col>
														</FormGroup>
													</Col>
												</Row>												
												<Alert color="danger"
															isOpen={this.state.alertaConsolidacao}
															toggle={this.onDismisssConsolidacao}
															fade={false}>Escolha uma das opções acima.
												</Alert>
											</Col>
										</Row>
										<Row>											
											<Col xs="12" md="4">
												<Row>
													<Col xs="12" md="12">
														<FormGroup>
															<Label htmlFor="cliente"><strong>Cliente:</strong></Label>
																<Select
																	id="cliente"
																	name="cliente"
																	value={this.state.clienteSelecionado}
																	onChange={(event) => { 
																		this.handleClienteSelectChange(event)
																	}}
																	options={this.state.clienteOpcoes}
																	required
																	isClearable
																	isLoading={this.state.clienteCarregando}
																	placeholder={this.state.clientePlaceholder}
																/>
														</FormGroup>
													</Col>
												</Row>
											</Col>										
											<Col xs="12" md="4">												
												<Row>
													<Col xs="12" md="12">
														<FormGroup>
															<Label htmlFor="navio"><strong>Navio:</strong></Label>
																<Select
																	id="navio"
																	name="navio"
																	value={this.state.navioSelecionado}
																	onChange={(event) => { 
																		this.handleNavioSelectChange(event)
																	}}
																	options={this.state.navioOpcoes}
																	required
																	isClearable
																	isLoading={this.state.navioCarregando}
																	placeholder={this.state.navioPlaceholder}
																/>    
														</FormGroup>
													</Col>
												</Row>
											</Col>
												 <Col xs="12" md="4">												
												<Row>
													<Col xs="12" md="12">												
														<FormGroup>
															<Label htmlFor="atividade"><strong>Viagem:</strong></Label>
																<Input
																	type="text"
																	id="viagem"
																	name="viagem"
																	value={this.state.handleChange}
																	onChange={(event) => { 
																	 this.handleChange(event)
																	}}																	
																/>
														</FormGroup>
													</Col>																									
												</Row>
											</Col> 
										</Row>
										<Row className={this.state.classConsolidaRelatorio}>
										<Col xs="12" md="4">												
												<Row>
													<Col xs="12" md="12">												
														<FormGroup>
														<Label htmlFor="produto"><strong>Produto: <small><i> (Estatística)</i></small></strong></Label>
                                                                <Select
                                                                    id="produto"
                                                                    name="produto"
                                                                    value={this.state.produtoSelecionado}
                                                                    onChange={(event) => { 
                                                                         this.handleProdutoSelectChange(event)
                                                                     }}
                                                                    options={this.state.produtoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.produtoCarregando}
                                                                    placeholder={this.state.produtoPlaceholder}
                                                                />
														</FormGroup>
													</Col>																									
												</Row>
											</Col> 
											<Col xs="12" md="4">												
												<Row>
													<Col xs="12" md="12">												
														<FormGroup>
														<Label htmlFor="movimentacao"><strong>Movimentação:</strong> <small><i> (Estatística)</i></small></Label>
														<Select
                                                                    id="movimentacao"
                                                                    name="movimentacao"
                                                                    value={this.state.movimentacaoSelecionada}
                                                                    onChange={(event) => { 
                                                                         this.handleMovimentacaoSelectChange(event)
                                                                     }}
                                                                    options={this.state.movimentacaoOpcoes}
                                                                    required
                                                                    isClearable
                                                                    isLoading={this.state.movimentacaoCarregando}
                                                                    placeholder={this.state.movimentacaoPlaceholder}
                                                                />
														</FormGroup>
													</Col>																									
												</Row>
											</Col> 								
											
										</Row>
										<Row>
											<Col xs="12" md="12">												
												<FormGroup row>
													<Col xs="12" md="12">
														<FormGroup check inline>
															<Input 
																className="form-check-input" 
																type="checkbox" 
																id="totalizadorEstaPaga" 
																name="totalizadorEstaPaga" 
																value={this.state.totalizadorEstaPaga}
																	onClick={((e) => this.onChangeTotaisPorRelatorio(e))}
															/>
															<Label className="form-check-label" check htmlFor="inline-checkbox1"></Label>
															<small><strong>Imprimir totalizador na estatística de pagamento.</strong></small>
														</FormGroup>
													</Col>
												</FormGroup>
												<FormGroup row>
													<Col xs="12" md="12">
														<FormGroup check inline>
															<Input 
																className="form-check-input" 
																type="checkbox" 
																id="exibeViagem" 
																name="exibeViagem" 
																value={this.state.exibeViagem}
																	onClick={((e) => this.onChangeTotaisPorRelatorio(e))}
															/>
															<Label className="form-check-label" check htmlFor="inline-checkbox1"></Label>
															<small><strong>Mostrar a viagem juntamente com a requisição na estatistica de pagamento.</strong></small>
														</FormGroup>
													</Col>
												</FormGroup>
											</Col>
										</Row>
										</div>
									{/* </Form> */}
									
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

								</CardBody>
									<CardFooter>
										<Row>
											<Col md="6">
												<ButtonToolbar className="">
													<Row>
														<Col md="5">
															<Button type="submit" color="primary"><i className="fa fa-bar-chart"></i><a href="#"></a> Gerar Relatório</Button>
														</Col>
														<Col md="2"></Col>
														<Col md="5">
															<Button type="reset" color="primary"><i className="fa fa-file-excel-o"></i> Gerar CSV</Button>
														</Col>
													</Row>
												</ButtonToolbar>
											</Col>
											<Col md="6">
												<ButtonToolbar className="card-header-actions">
													<Button type="reset" color="danger"><i className="fa fa-mail-reply"></i> Voltar</Button>
												</ButtonToolbar>
											</Col>
										</Row>
									</CardFooter>
							</Card>
						</Col>
					</Row>
				</Form> 
			</div>
		);
	}
}

	
// export default FiltrarRelatorioCons;


/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( autenticacaoActions, dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(FiltrarRelatorioCons));
