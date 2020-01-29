import React, { Component } from 'react';
import { withRouter  } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as autenticacaoActions } from '../../../../store/ducks/autenticacao';
import { Creators as segurancaMenuActions } from '../../../../store/ducks/segurancaMenu';
import Form from '../../../../components/Seguranca/Menu/Form';


class Editar extends Component {

    /************
     * RENDER
     */
    render() {
        
        return (

            <Form
                accessToken={this.props.autenticacao.accessToken}

                id={this.props.segurancaMenu.id}
                titulo={"Editar Menu"}
            />

        );
    }
}

/**********
 * REDUX
 */
const mapDispatchToProps = dispatch =>
    bindActionCreators( Object.assign({}, autenticacaoActions, segurancaMenuActions), dispatch)

const mapStateToProps = state => ({
    autenticacao: state.autenticacao,
    segurancaMenu: state.segurancaMenu,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editar));
