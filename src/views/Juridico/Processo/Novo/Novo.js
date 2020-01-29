import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
//import { Creators as requisicaoModeloActions } from '../../../../store/ducks/requisicaoModelo';
import ProcessoForm from '../../../../components/Juridico/Processo/Form';


class Novo extends Component {

    //componentWillUnmount() {
    //   this.props.editarRequisicaoModelo(0);
    //}

    /************
     * RENDER
     */
    render() {
        
        return (

            <ProcessoForm
                accessToken={this.props.autenticacao.accessToken}
                idOperadorPortuario={this.props.autenticacao.idOperadorPortuario}
                nomeUsuario={this.props.autenticacao.nomeCompleto}                

                id={0}
                //idRequisicaoModelo={this.props.requisicaoModelo.id}
                titulo={"Processo Jurídico"}
                //tipo={"requisicao"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Novo));
