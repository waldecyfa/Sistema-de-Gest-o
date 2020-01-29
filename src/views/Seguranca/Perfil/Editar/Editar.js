import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaPerfilActions } from '../../../../store/ducks/segurancaPerfil';
import Form from '../../../../components/Seguranca/Perfil/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.segurancaPerfil.nome}
                titulo={"Editar Perfil"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaPerfilActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaPerfil: state.segurancaPerfil,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
