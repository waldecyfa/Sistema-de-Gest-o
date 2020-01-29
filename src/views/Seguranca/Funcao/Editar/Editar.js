import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaFuncaoActions } from '../../../../store/ducks/segurancaFuncao';
import Form from '../../../../components/Seguranca/Funcao/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.segurancaFuncao.id}
                titulo={"Editar Função"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaFuncaoActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaFuncao: state.segurancaFuncao,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
