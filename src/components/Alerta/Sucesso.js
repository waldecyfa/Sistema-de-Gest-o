import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';

class Sucesso extends Component {
    
    /************
     * RENDER
     */
    render() {
      
        return (

            <SweetAlert 
                success
                confirmBtnText="OK"
                confirmBtnBsStyle="primary"
                title="Sucesso"
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
export default Sucesso;
