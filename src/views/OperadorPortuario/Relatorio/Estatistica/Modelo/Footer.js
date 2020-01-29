import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  layout,
} from 'reactstrap';


// var pdfmake = require('pdfmake/build/pdfmake.js'); 
// var vfsFonts = require('pdfmake/build/vfs_fonts.js');

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";



pdfMake.vfs = pdfFonts.pdfMake.vfs;


class Footer extends Component {

    constructor(props) {

        super(props);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
            horaData:{
                hora:"",
                minutos:"",
                segundos:"",
                dia:"",

            },
        };      
    }

   
    gerarPdf() {    

        var dataAtual = Date();
            dataAtual = new Date (dataAtual).toLocaleString();
        
        var docDefinition = {   
          //pageMargins: [ 40, 60, 40, 60 ],          
          pageOrientation: 'portrait',
          pageMargins: [ 30, 90, 30, 60 ],

          footer: function(currentPage, pageCount) {
            return {
                style:'footerStyle1',
                    table:{
                        style:'footerStyle2',
                        widths:[165,'*',115],
                        
                            body:[
                                    [
                                        {
                                            text:'Ogmo System 3.0 - OGMO-ES',
                                            style:'footerStyle',
                                            border:[false,true,false,false],
                                            alignment: 'left',
                                        },
                                        {
                                            text: dataAtual,
                                            style:'footerStyle',
                                            border:[false,true,false,false],
                                            alignment: 'center',
                                        },
                                        {
                                            text:'Página: ' + currentPage.toString() + ' de ' + pageCount,
                                            style:'footerStyle',
                                            border:[false,true,false,false],
                                            alignment: 'right',
                                        },
                                        ]      
                                    ]   
            
                        }
                    }
        },

            

            //margin: [left, top, right, bottom]

            styles:{
                body:{
                   // margin: [40, 10, 40, 0],
                },

                footerStyle1:{
                    fontSize: 8,
                    margin: [30,0,29,40],
                },
                
                footerStyle2:{
                    fontSize: 8,
                    margin: [0,0,0,0],
                },
            },
        }

        pdfMake.createPdf(docDefinition).open();
    }


    render() {
        
        return (

            <div className="animated fadeIn">
                <Row>
                    <Col>
                        <Card>
                            <CardHeader>
                                PDF
                            </CardHeader>
                            <CardBody>
                                <Button block color="primary" onClick={this.gerarPdf}>Gerar PDF</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Footer;