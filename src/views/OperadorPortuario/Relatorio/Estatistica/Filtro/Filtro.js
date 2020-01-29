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
import { Creators as autenticacaoActions } from '../../../../../store/ducks/autenticacao';
import {create} from 'apisauce';
import {
    getBaseUrl,
} from '../../../../../components/Oauth';
import gifNavio from '../../../../../assets/img/brand/carregando.gif';
import {converteDataParaBr, getDataHoraAtualBd, converteDataHoraParaBd} from '../../../../../components/Util';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


class Filtro extends Component {

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
					periodoState: true,
					dataState: false,
					consolidarState: true,	
					relatorioState: false,
                    classConsolidaRelatorioState: false,
                    periodoSelecionado:'Período de Pagamento',
                    consolidarPor:'Requisitante',
				},
				check: {
					relatorioCliente:false,
					relatorioAtividade:false,
					relatorioNavio:false,
					totalizadorEstaPaga:false,
					exibeViagem:false,
				},				

				//relatorioFolha:true,
				relatorioEstatistica:true,
				periodoRelatorio:'P',
				periodoPagamento: true,
				periodoOperacao: false,
				relatorioTipo:'',

				consolidarRequisitante: true,
				consolidarRequisitNavio: false, 
				consolidarRequisitClient: false, 
				consolidarRequisitNavioClient: false,
				consolidarRelatorio:'requisitante',
				consolidar: '',	
				validaConsolidar: false,

				//classConsolidaRelatorio: 'oculta-filtro',

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
			
                retornoRelatorio:[],
                retornoOperadorFuncoes:[],
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
        
        getRelatorio = async () => {
            try {

                this.setState({ 
                    carregandoExibe: true
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
                    '/relatorio/estatisticaPagamento',
                    {},
                    {
                        params: {						
                            'idOperadorPortuario' : this.props.autenticacao.idOperadorPortuario	,
                            'dtInicial': converteDataParaBr(this.state.dataInicial),
                            'dtFinal' : converteDataParaBr(this.state.dataFinal),
                            'tipoData' : this.state.periodoRelatorio,
                            'consolidar' : this.state.consolidarRelatorio,
                            'clienteSelecionado' : this.state.clienteSelecionado,
                            'navioSelecionado' : this.state.navioSelecionado,
                            'produtoSelecionado' : this.state.produtoSelecionado,
                            'movimentacaoSelecionada' : this.state.movimentacaoSelecionada,

                            //'campo': this.state.campo === "" ? null : this.state.campo,
                        }
                    }
                );

                console.log('Ok - Relatorio: ', response.ok);
                console.log('Data - Relatorio: ', response.data);
                    
                if(response.ok && (response.data.length > 0) ) {
                
                // 	let opcoes = [];

                // 	for (let i = 0; i < response.data._embedded.navio.length; i++) {

                // 		opcoes.push( 
                // 			{ 
                // 				label: response.data._embedded.navio[i].nome, 
                // 				id: response.data._embedded.navio[i].id,
                // 				lloyd: response.data._embedded.navio[i].lloyd,
                // 				idTipoNavio: response.data._embedded.navio[i].idTipoNavio.id,
                // 				value: response.data._embedded.navio[i]._links.self.href 
                // 			}
                // 		);
                // 	}
                    this.setState({ 
                        retornoRelatorio: response.data,
                        carregandoExibe: false
                    }, () => {
                        this.gerarPdf();
                    });
                }
                // else {

                // 	this.setState({ 
                // 		navioCarregando: false,
                // 		navioPlaceholder: "Erro ao carregar...",
                // 		navioOpcoes: [],
                // 	}, () => {

                // 		this.verificaCarregando();
                // 	});
                // }
            
            } catch (err) {

                this.setState({ 
                    navioCarregando: false,
                    navioPlaceholder: "Erro ao carregar...",
                    navioOpcoes: [],
                });
            }
        };	

        
	    gerarPdf() {    
        
        var periodoDoRelatorio = this.state.validate.periodoSelecionado + ': ' +  converteDataParaBr(this.state.dataInicial) + ' à ' + converteDataParaBr(this.state.dataFinal);
        var consolidadoPor = 'Total por: ' + this.state.validate.consolidarPor;   
        
       
		var dataAtual = Date();
		dataAtual = new Date (dataAtual).toLocaleString();
        console.log('RetornoRelatorio:' , this.state.retornoRelatorio)
        

        
			
		//var i = 0;
        var body = [];
        
        if (this.state.retornoRelatorio.length > 0){
            for (let i = 0; i < this.state.retornoRelatorio.length; i++) {                 
                if (i==0){
                    var linhaVazia = [
                        {   text:'',
                            border:[false,false,false,true],
                            colSpan: 36,
                            border:[0,2,0,0],
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                        
                        ];
                    body.push( linhaVazia );
                     };
            var subCabecalhoRequisitante = [
                {
                    text: 'Requisitante:',
                    style: 'reqNavStyle',
                    bold:'true',                                    
                    border:[false,false,false,false], 
                    margin:[-5,0,0,-3],                                    
                    colSpan: 5,
                },{},{},{},{},

                { 
                    text: this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idOperadorPortuario + ' - ' + this.state.retornoRelatorio[i].estatisticaCabecalhoDto.descricaoOperadorPortuario, 
                    style: 'reqNavStyle',
                    border:[false,false,false,false],
                    margin:[-5,0,0,-3], 
                    colSpan: 31,
                    
                },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                
            ];        
            body.push(subCabecalhoRequisitante);
            

            if ((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio !== null ) || (this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente !== null )) {                
            var	subCabecalhoRequisitante = 
                            [
                                {
                                    text: 'Navio/Cliente:',
                                    style: 'reqNavStyle',
                                    bold:'true',  
                                    border:[false,false,false,false],
                                    margin:[-5,0,0,5],
                                    colSpan: 5,
                                },{},{},{},{},
                                { 
                                    text: (
                                        ((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio !== null ) ? this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio + ' - ' +  this.state.retornoRelatorio[i].estatisticaCabecalhoDto.navio : '')
                                        + (((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio !== null ) && (this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente !== null )) ? ' / ' : '')
                                        + ((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente !== null ) ? this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente + ' - ' +  this.state.retornoRelatorio[i].estatisticaCabecalhoDto.descricaoCliente : '')
                                    ),							
                                    style: 'reqNavStyle',
                                    border:[false,false,false,false],
                                    margin:[-5,0,0,5],
                                    colSpan: 31,
                                },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                            ];
            }else{
                var	subCabecalhoRequisitante = 
                        [
                            {
                                text: ' ',
                                border:[false,false,false,false],
                                colSpan: 5,
                            },{},{},{},{},
                            { 
                                text: ' ',
                                border:[false,false,false,false],
                                colSpan: 31,
                            },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                        ];
            };                          
            body.push(subCabecalhoRequisitante);  
        
                            
            //ATIVIDADE
            if (this.state.retornoRelatorio[i].estatisticaAtividadesDto.length > 0){
                for (let index = 0; index < this.state.retornoRelatorio[i].estatisticaAtividadesDto.length; index++) {
                                    
                    // LINHA 1
                    var linha1 = [
                        {
                            text: 'Atividade:',
                            style: 'atividadeStyle',
                            bolt:'true',
                            border:[false,false,false,false], 
                            colSpan: 4,                            
                        },{},{},{},
                        { 
                            text: this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].idAtividade + ' - ' + this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].nomeAtividade, 
                            style: 'atividadeStyle',
                            border:[false,false,false,false], 
                            colSpan: 11,
                        },{},{},{},{},{},{},{},{},{},{},
                        {
                            text: 'Requisições: ' + JSON.stringify(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].numeroRequisicoes).replace("[", "").replace("]", ""),
                            style: 'atividadeStyle2',
                            bolt:'true',
                            border:[false,false,false,false], 
                            colSpan: 21,                            
                            fontSize:6,                            
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                    ];
                    body.push( linha1 );

                    // LINHA 2
                    var linha2 =  [
                        {
                            text:'Trabalhadores',
                            style:'trabRequiStyle',
                            colSpan: 18,
                            border:[true,true,true,true],
                            alignment: 'center', 
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                        {
                            text:'Requisitante',
                            style:'trabRequiStyle',
                            colSpan: 18,
                            border:[true,true,true,true], 
                            alignment: 'center',
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                    ];
                    body.push( linha2 );

                    // LINHA 3
                    var linha3 = [
                        {
                            text:'Minutos',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Valores',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Valores',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Encargos',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        
                    ];
                    body.push( linha3 );

                    // LINHA 4
                    var linha4 = [                                    
                        {
                            text:'TRABALHADOS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraParaTrabalhados(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresQuantidadeMinutosTrabalhados),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{}, 
                        {
                            text:'TOTAL BRUTO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresBruto), 
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'13° SALÁRIO:',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantes13Salario), 
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesInss),                       
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha4 );

                    // LINHA 5
                    var linha5 = [
                        {
                            text:'PARADOS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraParaTrabalhados(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresQuantidadeMinutosParados),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},     
                        {
                            text:'DESCONTOS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FÉRIAS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesFerias),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS 13°',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesInss13),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha5 );

                    // LINHA 6
                    var linha6 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraRealNegativo(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresInss),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FS SINDICATO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesFundoSocialSindicato),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS FÉRIAS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesInssFerias),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha6 );

                    // LINHA 7
                    var linha7 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'IRRF',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraRealNegativo(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresIrrf),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'P.P.C',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesPlanoPrevidenciaComplementar),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FGTS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesFgts),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha7 );

                    // LINHA 8
                    var linha8 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'DAS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraRealNegativo(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresDas),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'F.G.R.B',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesFundoGarantidorRemuneracaoBasica),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'COMPL FGTS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesFgtsComplementar),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha8 );

                    // LINHA 9
                    var linha9 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FS OGMO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesFundoSocialOgmo),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha9 );

                    // LINHA 10
                    var linha10 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'LANC BANCARIO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesLancamentoBancario),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha10 );

                    // LINHA 11
                    var linha11 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'TX ADM OGMO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesTaxaOgmo),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( linha11 );
                   
                    //linhaVazia
                    var linhaVazia = [
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text: ' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,true,false],
                        },{},{},{},
                        ];
                    body.push( linhaVazia );
                    var linhaVazia = [
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text: ' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,true,false],
                        },{},{},{},
                        ];
                    body.push( linhaVazia );
                    var linhaVazia = [
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text: ' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,true,false],
                        },{},{},{},
                        ];
                    body.push( linhaVazia );

                    // LINHA 12
                    var linha12 = [
                        {
                            text:'',
                            style:'corpoStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                            //alignment: 'center', 
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Líquido',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,true,false,true],
                            alignment: 'left', 
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].trabalhadoresLiquido),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,true,true,true],
                            alignment: 'right', 
                        },{},{},{},
                        {
                            text:'Total',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,true,false,true],
                            alignment: 'left',  
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesTotalValores),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,true,true,true],
                            alignment: 'right',  
                        },{},{},{},
                        {
                            text:'Total',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,true,false,true],
                            alignment: 'left', 
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].requisitantesTotalEncargos),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,true,true,true],
                            alignment: 'right', 
                        },{},{},{},
                        
                    ];
                    body.push( linha12 );

                    // LINHA 13
                    var linha13 = [
                        {
                            text:'TONELAGEM (kg):',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,false,false,true],
                            alignment: 'left', 
                        },{},{},{},{},
                        {
                            text: this.mascaraParaKg(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].producaoTonelagem),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,false,false,true],
                            alignment: 'left', 
                        },{},{},{},
                        {
                            text: this.mascaraParaUni(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].producaoUnidade),
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[false,false,false,true],
                            alignment: 'right', 
                        },{},{},{},{},
                        {
                            text:'Unid.',
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,false,false,true],
                            alignment: 'left', 
                        },{},{},{},
                        {
                            text:'Total Geral',
                            style:'corpoStyle',
                            colSpan: 9,
                            border:[false,false,false,true],
                            alignment: 'right', 
                        },{},{},{},{},{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaAtividadesDto[index].totalGeral),
                            style:'corpoStyle',
                            colSpan: 9,
                            border:[false,false,true,true],
                            alignment: 'right', 
                        },{},{},{},{},{},{},{},{},
                        
                    ];
                    body.push( linha13 );                  

                };
            };

                        if ((i == 0)||(i >= 1)||(i > 2)||(i > 3)){  
                                var subCabecalhoRequisitante = [
                                    {
                                        text: 'Requisitante:',
                                        style: 'reqNavStyle',
                                        bold:'true',                                    
                                        border:[false,false,false,false], 
                                        margin:[-5,0,0,-3],                                    
                                        colSpan: 5,
                                    },{},{},{},{},

                                    { 
                                        text: this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idOperadorPortuario + ' - ' + this.state.retornoRelatorio[i].estatisticaCabecalhoDto.descricaoOperadorPortuario, 
                                        style: 'reqNavStyle',
                                        border:[false,false,false,false],
                                        margin:[-5,0,0,-3], 
                                        colSpan: 31,
                                        
                                    },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                                    
                                ];        
                                body.push(subCabecalhoRequisitante);                

                                if ((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio !== null ) || (this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente !== null )) {                
                                    var	subCabecalhoRequisitante = 
                                                    [
                                                        {
                                                            text: 'Navio/Cliente:',
                                                            style: 'reqNavStyle',
                                                            bold:'true',  
                                                            border:[false,false,false,false],
                                                            margin:[-5,0,0,5],
                                                            colSpan: 5,
                                                        },{},{},{},{},
                                                        { 
                                                            text: (
                                                                ((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio !== null ) ? this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio + ' - ' +  this.state.retornoRelatorio[i].estatisticaCabecalhoDto.navio : '')
                                                                + (((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idNavio !== null ) && (this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente !== null )) ? ' / ' : '')
                                                                + ((this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente !== null ) ? this.state.retornoRelatorio[i].estatisticaCabecalhoDto.idCliente + ' - ' +  this.state.retornoRelatorio[i].estatisticaCabecalhoDto.descricaoCliente : '')
                                                            ),							
                                                            style: 'reqNavStyle',
                                                            border:[false,false,false,false],
                                                            margin:[-5,0,0,5],
                                                            colSpan: 31,
                                                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                                                    ];
                                    }else{
                                    var	subCabecalhoRequisitante = 
                                                [
                                                    {
                                                        text: ' ',
                                                        border:[false,false,false,false],
                                                        colSpan: 5,
                                                    },{},{},{},{},
                                                    { 
                                                        text: ' ',
                                                        border:[false,false,false,false],
                                                        colSpan: 31,
                                                    },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                                                ];
                                    };                          
                                    body.push(subCabecalhoRequisitante);  
                            }

                    // Monta o Totalizador
                    // totalizador 1                    
                   
                    var totalizador1 = [
                                            
                        { 
                            text: 'TOTALIZADOR',                             
                            style: 'atividadeStyle',
                            border:[false,false,false,false],
                            bold:true,
                            alignment: 'center' ,
                            fillColor:'#d3d3d3',
                            colSpan: 36,
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},  


                    ];
                    body.push( totalizador1 );

                    // totalizador 2
                    var totalizador2 =  [
                        {
                            text:'Trabalhadores',
                            style:'trabRequiStyle',
                            colSpan: 18,
                            border: 2 [true,true,true,true],
                            alignment: 'center', 
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                        {
                            text:'Requisitante',
                            style:'trabRequiStyle',
                            colSpan: 18,
                            border:[true,true,true,true], 
                            alignment: 'center',
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                    ];
                    body.push( totalizador2 );

                    // totalizador 3
                    var totalizador3 = [
                        {
                            text:'Minutos',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Valores',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Valores',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Encargos',
                            style:'trabRequiStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                        },{},{},{},{},{},{},{},{},                        
                    ];
                    body.push( totalizador3 );

                    // totalizador 4
                    var totalizador4 = [                                            
                        {
                            text:'TRABALHADOS',
                            colSpan:5,
                            alignment:'left',
                            border: [true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraParaTrabalhados(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresQuantidadeMinutosTrabalhados),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},  
                        {
                            text:'TOTAL BRUTO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresBruto),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'13° SALÁRIO:',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantes13Salario),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesInss),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador4 );

                    // totalizador 5
                    var totalizador5 = [
                        {
                            text:'PARADOS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraParaTrabalhados(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresQuantidadeMinutosParados),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'DESCONTOS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FÉRIAS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesFerias),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS 13°',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesInss13),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador5 );

                    // totalizador 6
                    var totalizador6 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraRealNegativo(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresInss),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FS SINDICATO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesFundoSocialSindicato),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'INSS FÉRIAS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesInssFerias),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador6 );

                    // totalizador 7
                    var totalizador7 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'IRRF',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraRealNegativo(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresIrrf),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'P.P.C',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesPlanoPrevidenciaComplementar),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FGTS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesFgts),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador7 );

                    // totalizador 8
                    var totalizador8 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'DAS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraRealNegativo(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresDas),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'F.G.R.B',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesFundoGarantidorRemuneracaoBasica),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'COMPL FGTS',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesFgts),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador8 );

                    // totalizador 9
                    var totalizador9 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'FS OGMO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesFundoSocialOgmo),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador9 );

                    // totalizador 10
                    var totalizador10 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'LANC BANCARIO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesLancamentoBancario),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador10 );

                    // totalizador 11
                    var totalizador11 = [
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'TX ADM OGMO',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesTaxaOgmo),
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},
                        {
                            text:'',
                            colSpan:5,
                            alignment:'left',
                            border:[true,false,false,false],
                            style:'corpoStyle',
                        },{},{},{},{},
                        {
                            text:'',
                            colSpan:4,
                            alignment:'right',
                            border:[false,false,true,false],
                            style:'corpoStyle',
                        },{},{},{},
                    ];
                    body.push( totalizador11 );
                    
                    //linhaVazia
                    var linhaVazia = [
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text: ' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,true,false],
                        },{},{},{},
                        ];
                    body.push( linhaVazia );
                    var linhaVazia = [
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text: ' ',
                            colSpan:4,
                            border:[false,false,false,false],
                        },{},{},{},
                        {
                            text:' ',
                            colSpan:5,
                            border:[true,false,false,false],
                        },{},{},{},{},
                        {
                            text:' ',
                            colSpan:4,
                            border:[false,false,true,false],
                        },{},{},{},
                        ];
                    body.push( linhaVazia );

                    // totalizador 12
                    var totalizador12 =  [
                        {
                            text:'',
                            style:'corpoStyle',
                            colSpan: 9,
                            border:[true,true,true,true],
                            //alignment: 'center', 
                        },{},{},{},{},{},{},{},{},
                        {
                            text:'Líquido',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,true,false,true],
                            alignment: 'left', 
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.trabalhadoresLiquido),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,true,true,true],
                            alignment: 'right', 
                        },{},{},{},
                        {
                            text:'Total',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,true,false,true],
                            alignment: 'left',  
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesTotalValores),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,true,true,true],
                            alignment: 'right',  
                        },{},{},{},
                        {
                            text:'Total',
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[true,true,false,true],
                            alignment: 'left', 
                        },{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.requisitantesTotalEncargos),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,true,true,true],
                            alignment: 'right', 
                        },{},{},{},
                    ];
                    body.push( totalizador12 );

                    // totalizador 13
                    var totalizador13 = [
                        {
                            text:'TONELAGEM (kg):',
                            style:'corpoStyle',
                            colSpan: 5,                            
                            border:[true,false,false,true],
                            alignment: 'left', 
                        },{},{},{},{},
                        {
                            text: this.mascaraParaKg(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.producaoTonelagem),
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,false,false,true],
                            alignment: 'left', 
                        },{},{},{},
                        {
                            text: this.mascaraParaUni(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.producaoUnidade),
                            style:'corpoStyle',
                            colSpan: 5,
                            border:[false,false,false,true],
                            alignment: 'right', 
                        },{},{},{},{},
                        {
                            text:'Unid.',
                            style:'corpoStyle',
                            colSpan: 4,
                            border:[false,false,false,true],
                            alignment: 'left', 
                        },{},{},{},
                        {
                            text:'Total Geral',
                            style:'corpoStyle',
                            colSpan: 9,
                            border:[false,false,false,true],
                            alignment: 'right', 
                        },{},{},{},{},{},{},{},{},
                        {
                            text: this.mascaraReal(this.state.retornoRelatorio[i].estatisticaTotalizadorDto.totalGeral),
                            style:'corpoStyle',
                            colSpan: 9,
                            border:[false,false,true,true],
                            alignment: 'right',
                            //pageBreak: ((this.state.retornoRelatorio.length-1) == i ? 'avoid' : 'after'),                             
                        },{},{},{},{},{},{},{},{},                        
                    ];
                    body.push( totalizador13 );
                    if ((this.state.retornoRelatorio.length-1) > i){
                    var linhaVazia = [
                        {
                            text:' ',                            
                            border:[false,false,false,false],
                            pageBreak: 'after', 
                            colSpan: 36,
                            margin:[0,-5,0,0],
                        },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},  
                        ];
                    body.push( linhaVazia );
                     }           
                    
                }
               
            }
                  
            var docDefinition = {   
                pageSize: 'A4',
                pageOrientation: 'portrait',  
                pageMargins: [ 30, 65, 30, 35 ],                      
            
                    header: function(){
                        return  {
                                style:'headerStyle',
                                widths:[150, '*'],      
                                columns: [
                                        
                                        [
                                            {
                                                image:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCYRXhpZgAASUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAMAAAAWgAAAGmHBAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAAAR0lNUCAyLjguMTAAAwAAkAcABAAAADAyMTAAoAcABAAAADAxMDABoAMAAQAAAP//AAAAAAAA/+EComh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiB4bWxuczpleGlmPSdodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyc+CiAgPGV4aWY6WFJlc29sdXRpb24+NzI8L2V4aWY6WFJlc29sdXRpb24+CiAgPGV4aWY6WVJlc29sdXRpb24+NzI8L2V4aWY6WVJlc29sdXRpb24+CiAgPGV4aWY6UmVzb2x1dGlvblVuaXQ+SW5jaDwvZXhpZjpSZXNvbHV0aW9uVW5pdD4KICA8ZXhpZjpTb2Z0d2FyZT5BZG9iZSBJbWFnZVJlYWR5PC9leGlmOlNvZnR3YXJlPgogIDxleGlmOkV4aWZWZXJzaW9uPkV4aWYgVmVyc2lvbiAyLjE8L2V4aWY6RXhpZlZlcnNpb24+CiAgPGV4aWY6Rmxhc2hQaXhWZXJzaW9uPkZsYXNoUGl4IFZlcnNpb24gMS4wPC9leGlmOkZsYXNoUGl4VmVyc2lvbj4KICA8ZXhpZjpDb2xvclNwYWNlPlVuY2FsaWJyYXRlZDwvZXhpZjpDb2xvclNwYWNlPgogPC9yZGY6RGVzY3JpcHRpb24+Cgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSdyJz8+Cv/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQ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/NCvExwMf51qfhymVty8UoR9VFARabjfj8PixYsWLFiwjVsAgRQsJtrUDiIpQy2REH8DixYsWLFizSAgrmBkmQ9lHlyuJKdXw/DYsWLFixYcRtMqNxoN+1B/CAOkMPTFLsfMQ6WbFb5caWY5kpd8LRLCWEp7oFISDSF/dXy9xdu3Wahr1uBeoj5qYa3W7oPkoE2RM9oz7w4UShoNNwC1Y/ol5CSyrQNVbFYNOyE0bV484iZQbYQID1jbfuu441bKLl5JJOkxObU/BRuIpwi/Wte/FcfNUzIGndNIkweH/KnhKsAK9JpFwiPHaJaAHLER2+39yZvuqmEnRhHvRZZc7BU5/wAuYjCENteSufrmp27+AnAoVeG3dEHxV+2IDTBQEOKUiDFW4BTlkfbjsxAkYYY9j7/3JEymXNBB8Rsz+Ibs9m9sG7HuTBDK6aPl1UULD7+koCZMIyeiI41IK1OG+SB+Kws+LkYWbjmc1Jq4MSix8vvw2IRwI41j/ejU8ShiEvw8Q/8ATDnDglW4lJrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3rx/vXj/AHrx/vXj/evH+9eP968f714/3o4ZmKoJRWEBl37lJDDnZA5i5CR6UqkXiHsIVOXLRB2Wo+TtVzUSMnyQ0nuhECH7UWAsEAYDYUBVALqsBQISrPIMIYMPQNWvH+9eP968f714/wB68f714/3rx/vXj/evH+9eP968f714/wB68f714/3rx/vXj/evH+9eP968f714/wB68f714/3rx/vXj/evH+9eP968f714/wB68f714/3rx/vXj/evH+9eP968f714/wB68f714/3rx/vXj/evH+9eP968f714/wB68f714/3rx/vXj/evH+9eP96MHYcB1EyUevkgzFfvVfeq+9V96r71X3qvvVfeq+9V96r71X3qvvVfeq+9V96r71X3qvvVfeq+9V96r71X3qvvVfeq+9V96r71X3qvvVfeq+9V96r71X3qvvVfeq+9V96r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",
                                                width:110, height:31,
                                            },
                                            {
                                                text: 'Estatística de Pagamento',                                            
                                                style:'tituloStyle',
                                            },
                                        ],
                                        [
                                            {
                                                text: periodoDoRelatorio, 
                                                style:'subTituloStyle',
                                                margin:[-150,20,0,0],                                                
                                            },
                                            {
                                                text: consolidadoPor, 
                                                style:'subTituloStyle',     
                                                margin:[-150,0,0,0],                                   
                                            }
                                        ], 
                                                         
                                ], 
                        }     
                    },      
                      
                    footer: function(currentPage, pageCount) {
                        return {
                            style:'footerStyle1',
                                table:{
                                    style:'footerStyle2',
                                    widths:[110,'*',70],
                                    
                                        body:[
                                                [
                                                    {
                                                        text:'Ogmo System 3.0 - OGMO-ES',
                                                        style:'footerStyle',
                                                        border:[false,true,false,false],
                                                        alignment: 'left',
                                                    },
                                                    {
                                                        text: dataAtual,
                                                        style:'footerStyle',
                                                        border:[false,true,false,false],
                                                        alignment: 'center',
                                                    },
                                                    {
                                                        text:'Página: ' + currentPage.toString() + ' de ' + pageCount,
                                                        style:'footerStyle',
                                                        border:[false,true,false,false],
                                                        alignment: 'right',                            
                                                    },
                                                ]      
                                        ]   
                        
                                    }
                                }
                    },
  
                     content:[                    
                    {
                        table:{
                                widths: [
                                    5,5,5,5,5,5,5,5,5,5,
                                    5,5,5,5,5,5,5,5,5,5,
                                    5,5,5,5,5,5,5,5,5,5,
                                    5,5,5,5,'*','*',
                                ],
                                //headerRows: 3,
                                body: body,  
                        },
                    }
                ],
            
            
            styles: {

                reqNavStyle:{                                                            
                    fontSize: 8,    
                },
                atividadeStyle:{
                    fontSize: 8,
                    fillColor:'#d3d3d3',
                },

                atividadeStyle2:{
                    fontSize: 8,
                    fillColor:'#d3d3d3',
                    alignment: 'right',
                },

                trabRequiStyle:{
                    fontSize: 8,
                    bold: true,
                },

                corpoStyle:{
                    fontSize:7,
                    borderSize: 1,
                },
                
                footerStyle1:{
                    fontSize: 8,
                    margin: [30,0,29,40],
                },
                footerStyle2:{
                    fontSize: 8,
                    margin: [0,0,0,0],
                },

                headerStyle:{
                    margin: [30,20,25,60],
                    alignment: 'left'
                },

                tituloStyle:{
                    margin:[120,-25,0,0],
                    alignment:'center',
                    fontSize:13,
                    bold: true,
                },
                subTituloStyle:{
                    fontSize:7,
                    margin:[0,0,0,0],
                },
                
                tabelaStyle:{
                    alignment: 'center',
                    margin: [40, 30, 40, 20]
                },
            }
            
        }

        pdfMake.createPdf(docDefinition).open();

    }


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
		console.log(dataBr);
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
        validate.periodoSelecionado = 'Período de Pagamento'

		this.setState({
			periodoPagamento: true,
			periodoOperacao: false,
            periodoRelatorio:'P',
            periodoSelecionado:'Período de Pagamento',
			alertaPeriodo: false,
			validate
		},() => {
			console.log("states",this.state)
		})
	}

	onChangePeriodoOperacao() {

		const { validate } = this.state
        validate.periodoState = true
        validate.periodoSelecionado = 'Período de Operação'

		this.setState({
			periodoPagamento: false,
			periodoOperacao: true,
            periodoRelatorio:'O',
            periodoSelecionado:'Período de Operação',
			alertaPeriodo: false,
			validate
		},() => {
			console.log("states",this.state)
		})
		
	}

	// onChangeTipoDeRelatorioFolha(){

	// 	const { validate } = this.state
	// 	validate.relatorioState = true

	// 	this.setState({
	// 		relatorioFolha:true,
	// 		relatorioEstatistica:false,
	// 		classConsolidaRelatorio: 'oculta-filtro',
	// 		alertaConsolidacao: false,
	// 		validate
	// 	},() => {
	// 		console.log("states",this.state)
	// 	})

	// }

	// onChangeTipoDeRelatorioEstatistica(){

	// 	const { validate } = this.state
	// 	validate.relatorioState = true

	// 	this.setState({
	// 		relatorioFolha:false,
	// 		relatorioEstatistica:true,
	// 		classConsolidaRelatorio: '',
	// 		alertaConsolidacao: false,
	// 		validate
	// 	},() => {
	// 		console.log("states",this.state)
	// 	})

	// }

	onChangeConsolidarRequisitante() {
		const {validate} = this.state
        validate.consolidarState = true
        validate.consolidarPor = 'Requisitante'

		this.setState({
			consolidarRequisitante: true,
			consolidarRequisitNavio: false, 
			consolidarRequisitClient: false, 
			consolidarRequisitNavioClient: false,
            consolidarRelatorio:'requisitante',
            consolidarPor:'Requisitante',
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}

	onChangeConsolidarRequisitNavio() {
		const {validate} = this.state
        validate.consolidarState = true
        validate.consolidarPor = 'Requisitante/Navio'

		this.setState({
			consolidarRequisitante: false,
			consolidarRequisitNavio: true, 
			consolidarRequisitClient: false, 
			consolidarRequisitNavioClient: false,
            consolidarRelatorio:'requisitanteNavio',
            consolidarPor:'Requisitante/Navio',
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}

	onChangeConsolidarRequisitClient() {
		const {validate} = this.state
        validate.consolidarState = true
        validate.consolidarPor = 'Requisitante/Cliente'

		this.setState({
			consolidarRequisitante: false,
			consolidarRequisitNavio: false, 
			consolidarRequisitClient: true, 
			consolidarRequisitNavioClient: false,
            consolidarRelatorio:'requisitanteCliente',
            consolidarPor:'Requisitante/Cliente',
			alertaConsolidacao: false,
			validate
		},() => {
			console.log("verificacao",this.state)
		})
	}

	onChangeConsolidarRequisitNavioClient() {
		const {validate} = this.state
        validate.consolidarState = true
        validate.consolidarPor = 'Requisitante/Navio/Cliente'

		this.setState({
			consolidarRequisitante: false,
			consolidarRequisitNavio: false, 
			consolidarRequisitClient: false, 
			consolidarRequisitNavioClient: true,
            consolidarRelatorio:'requisitanteNavioCliente',
            consolidarPor:'Requisitante/Navio/Cliente',
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
    
    //MASCARAS VALORES PDF
    mascaraReal(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] =  numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    mascaraRealNegativo(numero) {
        var numero = numero.toFixed(2).split('.');
        numero[0] =  "-" + numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    mascaraParaTrabalhados(numero){
        var numero = numero.toFixed().split('.');
        numero[0] =  numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join('.');
    }

    mascaraParaKg(numero){
        var numero = numero.toFixed(3).split('.');
        numero[0] =  numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join(',');
    }

    mascaraParaUni(numero){
        var numero = numero.toFixed().split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        return numero.join('.');
    }

	// MENSAGEM DE ALERTA
	handleSubmit = (event) => {
		event.preventDefault();
		console.log("states",this.state.validate);
		console.log("props",this.props);
		console.log("periodoState",this.state.validate.periodoState);
		console.log("dataInicialState",this.state.validate.dataInicialState);
		console.log("dataFinalState",this.state.validate.dataFinalState);
		console.log("consolidarState",this.state.validate.consolidarState);
		console.log("classConsolidaRelatorioState",this.state.validate.classConsolidaRelatorioState);
	

		 if (this.state.validate.periodoState && this.state.validate.dataState && this.state.validate.consolidarState ) {
			// this.props.history.push('/operador-portuario/relatorioConsolidacao'); 
			this.getRelatorio();
		}

		if (!this.state.validate.periodoState) {
		 	this.setState({ alertaPeriodo: true });
		 }

		if (!this.state.validate.dataState) {
			this.setState({ alertaData: true });
		}

		if(!this.state.relatorioEstatistica){	
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
									<strong>Relatório Estatística:</strong>
								</CardHeader>

									<CardBody>
									{/* <Form onSubmit={ (event) => this.handleSubmit(event)}>*/}
                                    <div id="accordion">
										{/* <Row> 
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
										</Row>*/}
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
														<strong>Consolidar Relatório Por:*</strong>
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
														<Label htmlFor="produto"><strong>Produto:</strong></Label>
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
														<Label htmlFor="movimentacao"><strong>Movimentação:</strong></Label>
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
)(Filtro));
