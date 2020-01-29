import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
    AppAside,
    // AppBreadcrumb,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import menuOperadorPortuario from '../Menu/operadorPortuario';
import menuAdmin from '../Menu/admin';
// routes config
import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

import { Creators as AutenticacaoActions } from '../../store/ducks/autenticacao';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import {
    getApiAutenticado
} from '../../components/Oauth';
import Carregando from '../../components/Alerta/Carregando';
import Erro from '../../components/Alerta/Erro';

class DefaultLayout extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
            carregandoExibe: false,

            erroMensagem: '',
            erroExibe: false,

            lista: [],

            menu: {
                items: [{}]
            },
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.getListaMenu();
    }
    /************
     * GET LISTA MENU
     */
    getListaMenu = async () => {
        try {

            this.setState({ carregandoExibe: true })

            // define the api
            const api = getApiAutenticado(this.props.autenticacao.accessToken);

            // start making calls
            const response = await api.get(
                '/menu/search/getListaAtivos',
                {},
                {
                    params: {
                        'projection': 'complete',
                        'sort': 'posicao,asc'
                    }
                }
            );

            console.log("getListaMenu: ", response);

            if(response.ok) {

                let lista = [];
            
                for (let i = 0; i < response.data._embedded.menu.length; i++) {
                    
                    lista.push(
                        {
                            id: response.data._embedded.menu[i].id,
                            idMenuPai: (response.data._embedded.menu[i].idMenuPai === null) ? "" : response.data._embedded.menu[i].idMenuPai.nome,
                            nome: response.data._embedded.menu[i].nome,
                            url: response.data._embedded.menu[i].url,
                            icone: "fa " + response.data._embedded.menu[i].icone,
                            posicao: response.data._embedded.menu[i].posicao,
                        },
                    );                    
                }

                console.log("lista: ", lista);

                this.setState({ 
                    lista: lista,
                    carregandoExibe: false
                }, () => {
                    this.montaMenu();
                });
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

    montaMenu() {

        console.log("montaMenu: ", this.state.lista);
        let items = [];
        let obj = null;
        let objIdx = null;

        for (let i = 0; i < this.state.lista.length; i++) {
            
            if(this.state.lista[i].idMenuPai !== "") {

                obj = items.find(x => x.name === this.state.lista[i].idMenuPai);
                objIdx = items.findIndex(x => x.name === this.state.lista[i].idMenuPai);
                console.log("obj: ", obj);
                console.log("objIdx: ", objIdx);

                if(objIdx >= 0) {

                    obj.children.push({
                        name: this.state.lista[i].nome,
                        url: this.state.lista[i].url,
                        icon: this.state.lista[i].icone,                                        
                    });

                    items[objIdx] = {
                        ...obj,
                        // children
                    }
                }
                // 3o NIVEL - A FAZER
                else {
                    obj = items.find(x => x.children.find(y => y.name === this.state.lista[i].idMenuPai));
                    objIdx = items.findIndex(x => x.children.findIndex(y => y.name === this.state.lista[i].idMenuPai));
                    console.log("obj1: ", obj);
                    console.log("objIdx1: ", objIdx);

                    if(objIdx >= 0) {

                        obj.children.push({
                            name: this.state.lista[i].nome,
                            url: this.state.lista[i].url,
                            icon: this.state.lista[i].icone,                                        
                        });

                        // items[i][objIdx] = {
                            // ...obj,
                            // children
                        // }
                    }
                }
                // BLOCO DE CÓDIGO FINALIZADO - 3º NÍVEL - SUB-MENUS
            }
            else {
                items.push(
                    {
                        name: this.state.lista[i].nome,
                        url: this.state.lista[i].url,
                        icon: this.state.lista[i].icone,
                        children: []
                    },
                );            
            }
        }

        console.log("items: ", items);

        this.setState({ 
            menu: { items }            
        });
    }

    render() {

        let menu = null;

        if( (this.props.autenticacao === undefined) || (this.props.autenticacao.username === '') ) {
            this.props.history.push('/login');
        }
        else {
            // switch (this.props.autenticacao.perfil) {

            //     case 'ROLE_ADMIN':
                    // menu = menuAdmin;
            //         break;

            //     case 'ROLE_OPERADOR_PORTUARIO':
            //         menu = menuOperadorPortuario;
            //         break;
            
            //     default:
            //         this.props.history.push('/login');
            //         break;
            // }
            // menu = nav;
        }

        return (

            <div className="app">

                <AppHeader fixed>
                    <DefaultHeader />
                </AppHeader>

                <div className="app-body">

                    {(this.state.menu !== null) &&
                        <AppSidebar fixed display="lg">
                            <AppSidebarHeader />
                            <AppSidebarForm />
                            <AppSidebarNav navConfig={this.state.menu} {...this.props} />
                            <AppSidebarFooter />
                            <AppSidebarMinimizer />
                        </AppSidebar>
                    }

                    <main className="main">
                        {/* <AppBreadcrumb appRoutes={routes}/> */}

                        <Container fluid>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                                        <route.component {...props} />
                                        )} />)
                                        : (null);
                                    },
                                )}
                                <Redirect from="/" to="/inicio" />
                            </Switch>
                        </Container>
                    </main>

                    <AppAside fixed hidden>
                        <DefaultAside />
                    </AppAside>

                </div>

                <AppFooter>
                    <DefaultFooter />
                </AppFooter>

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

const mapDispatchToProps = dispatch =>
    bindActionCreators(AutenticacaoActions, dispatch);

const mapStateToProps = state => ({
    autenticacao: state.autenticacao
});
  
export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DefaultLayout));