import React, { Component } from 'react';

import {  
    UncontrolledDropdown,  
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
} from 'reactstrap';

import PropTypes from 'prop-types';

import {    
    AppHeaderDropdown,
    AppNavbarBrand,
    AppSidebarToggler, 
} from '@coreui/react';

import { withRouter  } from 'react-router-dom';

import logo from '../../assets/img/brand/logomarca.jpg';

import sygnet from '../../assets/img/brand/ico.png';

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

// import { Creators as AutenticacaoActions } from '../../store/ducks/autenticacao';

import { Creators as rootActions } from '../../store/ducks/root';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

    handleLogout = () => {
        // this.props.removeAutenticacao();
        this.props.setLogout();
        this.props.history.push('/login');  
    }

    handleAlterarSenha = () => {
        this.props.history.push('/seguranca/usuario/alterar-senha');  
    }

    render() {

        // eslint-disable-next-line
        const { children, ...attributes } = this.props;       
        
        return (
            <React.Fragment>

                <AppSidebarToggler className="d-lg-none" display="md" mobile />
                
                <AppNavbarBrand
                    full={{ src: logo, width: 140, height: 41, alt: 'OgmoSystem 3.0' }}
                    minimized={{ src: sygnet, width: 40, height: 40, alt: 'OgmoSystem 3.0' }}
                />

                <AppSidebarToggler className="d-md-down-none" display="lg" />

                <span className="header-usuario">
                    {this.props.autenticacao.nome}
                </span>
                
                {/* <Nav className="d-md-down-none" navbar>
                    <NavItem className="px-3">
                    <NavLink href="/">Dashboard</NavLink>
                    </NavItem>
                    <NavItem className="px-3">
                    <NavLink href="#/users">Users</NavLink>
                    </NavItem>
                    <NavItem className="px-3">
                    <NavLink href="#">Settings</NavLink>
                    </NavItem>
                </Nav> */}

                <Nav className="ml-auto" navbar>

                    {/* <NavItem className="d-md-down-none">
                        <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
                    </NavItem>

                    <NavItem className="d-md-down-none">
                        <NavLink href="#"><i className="icon-list"></i></NavLink>
                    </NavItem>

                    <NavItem className="d-md-down-none">
                        <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
                    </NavItem> */}

                    <AppHeaderDropdown direction="down">
                        <UncontrolledDropdown>
                            <DropdownToggle nav>
                                {/* <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" /> */}
                                <i className="fa fa-user-circle fa-2x"></i>
                            </DropdownToggle>
                            
                            <DropdownMenu >
                                <DropdownItem header tag="div" className="text-center"><strong>Conta</strong></DropdownItem>
                                {/* <DropdownItem><i className="fa fa-user"></i> Perfil</DropdownItem> */}
                                <DropdownItem onClick={this.handleAlterarSenha}><i className="fa fa-key"></i> Alterar Senha</DropdownItem>
                                {/* <DropdownItem><i className="fa fa-shield"></i> Proteger Tela</DropdownItem> */}
                                <DropdownItem onClick={this.handleLogout}><i className="fa fa-sign-out"></i> Sair</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </AppHeaderDropdown>

                </Nav>

                {/* <AppAsideToggler className="d-md-down-none" /> */}
                {/*<AppAsideToggler className="d-lg-none" mobile />*/}

            </React.Fragment>
        );
    }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapDispatchToProps = dispatch =>
    bindActionCreators(rootActions, dispatch);

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    root: state.root
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(DefaultHeader));
