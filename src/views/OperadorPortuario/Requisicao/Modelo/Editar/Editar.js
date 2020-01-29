import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../../store/ducks/autenticacao';
import { Creators as requisicaoModeloActions } from '../../../../../store/ducks/requisicaoModelo';
import RequisicaoForm from '../../../../../components/Requisicao/Form';


class Editar extends Component {

    componentWillUnmount() {
        this.props.editarRequisicaoModelo(0);
    }

    /************
     * RENDER
     */
    render() {
        
        return (

            <RequisicaoForm
                accessToken={this.props.autenticacao.accessToken}
                idOperadorPortuario={this.props.autenticacao.idOperadorPortuario}
                nomeOperadorPortuario={this.props.autenticacao.nomeCompleto}

                id={this.props.requisicaoModelo.id}
                idRequisicaoModelo={0}
                titulo={"Editar Modelo"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, requisicaoModeloActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    requisicaoModelo: state.requisicaoModelo,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
