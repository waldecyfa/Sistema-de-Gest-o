import React, { Component } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button
} from 'reactstrap';


// var pdfmake = require('pdfmake/build/pdfmake.js'); 
// var vfsFonts = require('pdfmake/build/vfs_fonts.js');

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class Pdf extends Component {

    constructor(props) {

        super(props);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
        };
    }

    gerarPdf() {
        var docDefinition = {
            
            //CABEÇALHO
            header: function(currentPage, pageCount, pageSize) {
                // you can apply any logic and return any valid pdfmake element

                return [
                    { text: 'OGMO-ES', style: 'header' /*alignment: (currentPage % 2) ? 'left' : 'right'*/ },
                    { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                ]
            },
            footer: function(currentPage, pageCount) { 
                return [
                    { text: currentPage.toString() + ' of ' + pageCount, style: 'footer' }
                ]
            },
            content: [
                {
                    stack: [
                        'This header has both top and bottom margins defined',
                        {text: 'This is a subheader', style: 'subheader'},
                    ],
                    style: 'h1'
                },
                {
                    text: [
                        'Margins have slightly different behavior than other layout properties. They are not inherited, unlike anything else. They\'re applied only to those nodes which explicitly ',
                        'set margin or style property.\n',
                    ]
                },
                {
                    text: 'This paragraph (consisting of a single line) directly sets top and bottom margin to 20',
                    margin: [0, 20],
                },
                {
                    stack: [
                        {text: [
                                'This line begins a stack of paragraphs. The whole stack uses a ',
                                {text: 'superMargin', italics: true},
                                ' style (with margin and fontSize properties).',
                            ]
                        },
                        {text: ['When you look at the', {text: ' document definition', italics: true}, ', you will notice that fontSize is inherited by all paragraphs inside the stack.']},
                        'Margin however is only applied once (to the whole stack).'
                    ],
                    style: 'superMargin'
                },
                {
                    stack: [
                        'I\'m not sure yet if this is the desired behavior. I find it a better approach however. One thing to be considered in the future is an explicit layout property called inheritMargin which could opt-in the inheritance.\n\n',
                        {
                            fontSize: 15,
                            text: [
                                'Currently margins for ',
                                /* the following margin definition doesn't change anything */
                                {text: 'inlines', margin: 20},
                                ' are ignored\n\n'
                            ],
                        },
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Malit profecta versatur nomine ocurreret multavit, officiis viveremus aeternum superstitio suspicor alia nostram, quando nostros congressus susceperant concederetur leguntur iam, vigiliae democritea tantopere causae, atilii plerumque ipsas potitur pertineant multis rem quaeri pro, legendum didicisse credere ex maluisset per videtis. Cur discordans praetereat aliae ruinae dirigentur orestem eodem, praetermittenda divinum. Collegisti, deteriora malint loquuntur officii cotidie finitas referri doleamus ambigua acute. Adhaesiones ratione beate arbitraretur detractis perdiscere, constituant hostis polyaeno. Diu concederetur.\n',
                    ],
                    margin: [0, 20, 0, 0],
                    alignment: 'justify'
                }
            ],
            styles: {
                header: {
                    fontSize: 24,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 10, 0, 10]
                },
                footer: {
                    fontSize: 12,
                    alignment: 'center',
                    margin: [0, 10, 0, 10]
                },
                h1: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 90, 0, 80]
                },
                subheader: {
                    fontSize: 14,
                    borderWidth: 1,
                    borderColor: '#000000', 
                },
                superMargin: {
                    margin: [20, 0, 40, 0],
                    fontSize: 15
                }
            }
            
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

export default Pdf;
