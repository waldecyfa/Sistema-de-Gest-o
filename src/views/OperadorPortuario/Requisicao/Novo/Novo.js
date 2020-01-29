import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as requisicaoModeloActions } from '../../../../store/ducks/requisicaoModelo';
import RequisicaoForm from '../../../../components/Requisicao/Form';


class Novo extends Component {

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

                id={0}
                idRequisicaoModelo={this.props.requisicaoModelo.id}
                titulo={"Nova Requisição"}
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
)(Novo));
