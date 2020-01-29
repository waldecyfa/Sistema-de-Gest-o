import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter  } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import Form from '../../../../components/Escalacao/LocalOperacao/Form';


class Novo extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={0}
                titulo={"Novo Local de Operação"}
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
