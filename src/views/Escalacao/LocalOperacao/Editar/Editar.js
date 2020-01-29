import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as escalacaoLocalOperacaoActions } from '../../../../store/ducks/escalacaoLocalOperacao';
import Form from '../../../../components/Escalacao/LocalOperacao/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.escalacaoLocalOperacao.id}
                titulo={"Editar Local de Operação"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, escalacaoLocalOperacaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    escalacaoLocalOperacao: state.escalacaoLocalOperacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
