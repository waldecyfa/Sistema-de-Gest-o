import React, { Component } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import gifNavio from '../../assets/img/brand/carregando.gif';

class Carregando extends Component {
    
    /************
     * RENDER
     */
    render() {
      
        return (

            <SweetAlert
                show={this.props.exibe}
                title="Aguarde"
                showConfirm={false}
                onConfirm={() => {}}
                custom
                customIcon={gifNavio}
            >
                Navegando...
            </SweetAlert>                           

        );
    }
}


/************
 * REDUX
 */
export default Carregando;
