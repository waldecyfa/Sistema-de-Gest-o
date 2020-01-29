import React, { Component } from 'react';
import { 
    CardFooter,
    Col, 
    Row,
    Button,
} from 'reactstrap';

class Rodape extends Component {

    /************
     * RENDER
     */
    render() {

        return (

            <CardFooter>
                <Row>
                    <Col xs="12" md="12" className="botao-centro">
                        <Button type="button" color="primary" onClick={this.props.aoAdicionar}><i className="fa fa-file"></i> Novo</Button>
                    </Col>
                </Row>
            </CardFooter>

        );
    }
}

export default Rodape;
