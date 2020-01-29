import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaUsuarioActions } from '../../../../store/ducks/segurancaUsuario';
import Form from '../../../../components/Seguranca/Usuario/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.segurancaUsuario.username}
                titulo={"Editar Usuário"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaUsuarioActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaUsuario: state.segurancaUsuario,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
