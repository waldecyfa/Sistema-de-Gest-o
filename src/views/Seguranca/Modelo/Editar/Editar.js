import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaModeloActions } from '../../../../store/ducks/segurancaModelo';
import Form from '../../../../components/Seguranca/Modelo/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.segurancaModelo.id}
                titulo={"Editar Modelo"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaModeloActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaModelo: state.segurancaModelo,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
