import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../../store/ducks/autenticacao';
import RequisicaoForm from '../../../../../components/Requisicao/Form';


class Novo extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <RequisicaoForm
                accessToken={this.props.autenticacao.accessToken}
                idOperadorPortuario={this.props.autenticacao.idOperadorPortuario}
                nomeOperadorPortuario={this.props.autenticacao.nomeCompleto}

                id={0}
                idRequisicaoModelo={0}
                titulo={"Novo Modelo"}
            />

        );
    }
}

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
)(Novo));
