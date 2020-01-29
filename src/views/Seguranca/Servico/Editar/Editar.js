import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaServicoActions } from '../../../../store/ducks/segurancaServico';
import Form from '../../../../components/Seguranca/Servico/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.segurancaServico.id}
                titulo={"Editar Serviço"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaServicoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaServico: state.segurancaServico,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
