import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as requisicaoActions } from '../../../../store/ducks/requisicao';
import RequisicaoForm from '../../../../components/Requisicao/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <RequisicaoForm
                accessToken={this.props.autenticacao.accessToken}
                idOperadorPortuario={this.props.autenticacao.idOperadorPortuario}
                nomeOperadorPortuario={this.props.autenticacao.nomeCompleto}

                id={this.props.requisicao.id}
                idRequisicaoModelo={0}
                titulo={"Editar Requisição"}
            />

        );
    }
}


/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, requisicaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    requisicao: state.requisicao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
