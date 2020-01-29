import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

class Erro extends Component {
    
    /************
     * RENDER
     */
    render() {
      
        return (

            <SweetAlert 
                error
                confirmBtnText="OK"
                confirmBtnBsStyle="primary"
                title="Erro"
                onConfirm={this.props.aoConfirmar}
                show={this.props.exibe}
            >
                {this.props.mensagem}
            </SweetAlert>                

        );
    }
}


/************
 * REDUX
 */
export default Erro;
