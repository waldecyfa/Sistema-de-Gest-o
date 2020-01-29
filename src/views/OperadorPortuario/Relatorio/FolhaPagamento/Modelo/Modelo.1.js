import React, { Component } from 'react';
import Imagem from '../../../../../assets/img/brand/Logomarca_contorno.PNG';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Styles,
    
} from 'reactstrap';




// var pdfmake = require('pdfmake/build/pdfmake.js'); 
// var vfsFonts = require('pdfmake/build/vfs_fonts.js');

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";



pdfMake.vfs = pdfFonts.pdfMake.vfs;


class Modelo extends Component {

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
        
        //function horaData(){        
        //}
        
    }

   
    
    gerarPdf() {    
        
        
        
        var docDefinition = {   

            pageOrientation: 'portrait',
            pageMargins: [ 40, 20, 40, 70 ],
            
            content:[{
                table:{},
            }],

            header: function(currentPage, pageCount, pageSize,) {
                
                return [
                    { text: 'Logo', style: 'header' , alignment: (currentPage % 2) ? 'left' : 'right'},
                    { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
                ]
            },

            footer: function(currentPage, pageCount, getTime) { 
                
                return {
                    
                    style:'defaultStyleFooter',
                    border:'3px',
                    
                    table: {                        
                         //widths: [10,6,6,8,8,8,9,9,9,11,6,6,6,6,8,11,13,13,8,8,8,8,8,8,8,8,8,8,8,18,1],
                          widths: [6,6,6,8,8,8,9,9,9,11,6,6,6,6,8,11,13,13,8,8,8,8,8,8,8,8,8,8,8,21,2],
                          //style: 'defaultStyle',                          

                            body:[
                                
                                [
                                    {
                                        text:' ',
                                        style:'footer',
                                        id:'',
                                        colSpan:16,
                                        border:[true,true,false,false],                                        
                                    },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                               
                                    { 
                                        text:'CONFIRMAMOS QUITAÇÃO',
                                        style:'footer',
                                        fillColor: '#000000',
                                        color: '#ffffff',
                                        colSpan:7,
                                        border:[true,true,false,false],
                                    },{},{},{},{},{},{},   

                                    { 
                                       
                                        text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                                        style:'footer',
                                        colSpan:7,
                                        border:[true,true,true,false],
                                        alignment: 'right',
                                    },{},{},{},{},{},{},
                                    
                                ],
                                
                                [
                                    {
                                        text:' ',
                                        style:'footer',
                                        colSpan:16,
                                        border:[true,false,true,true]
                                    },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                               
                                    { 
                                        text:'OGMOES',
                                        style:'footer',
                                        colSpan:7,
                                        border:[false,false,true,true]
                                    },{},{},{},{},{},{},   

                                    { 
                                        text: Date(),
                                        style:'footer',
                                        //id:'hora',
                                        colSpan:7,
                                        border:[false,false,true,true],
                                        alignment: 'right',
                                        
                                    },{},{},{},{},{},{},
                                       
                                
                                ],

                                ] 
                         
                    },
                }
            },            

           content:[
               
//                 {
//                     style: 'defaultStyle',
//                     color: '#000000',
//                     table: {
//                         widths: [6,6,6,8,8,8,9,9,9,11,6,6,6,6,8,11,13,13,8,8,8,8,8,8,8,8,8,8,8,21,2],
//                         //headerRows: 2,
//                         //keepWithHeaderRows: 1,                        
                        
//                         body: [                             
//                                 [     
//                                     {
//                                         text:'LOGO',
//                                         style:'header',
//                                         id: 'logo',
//                                         colSpan:8,
//                                         border:[true,true,false,false] 
//                                     },{},{},{},{},{},{},{}, 

//                                     {   
//                                         text:'PAGAMENTO FOLHA',  
//                                         style:'header', 
//                                         colSpan: 22, 
//                                         border:[false,true,true,false]
//                                     },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
//                                 ],        
                              
// //1 LINHA SUB TITULOS                           
//                                 [
                                
//                                 {
//                                     text: 'Requisitante:',
//                                     style: 'campoFixo',
//                                     border:[true,true,true,false], 
//                                     colSpan: 10,
//                                 },{},{},{},{},{},{},{},{},{},

//                                 { 
//                                     text: 'Cliente:', 
//                                     style: 'campoFixo',
//                                     border:[true,true,true,false], 
//                                     colSpan: 10,
//                                 },{},{},{},{},{},{},{},{},{},
                                
//                                 {
//                                     text: 'Data de operação:', 
//                                     style: 'campoFixo',
//                                     border:[true,true,true,false], 
//                                     colSpan: 4,
//                                 },{},{},{},

//                                 {
//                                     text: 'Turno:', 
//                                     style: 'campoFixo',
//                                     border:[true,true,true,false], 
//                                     colSpan: 3,
//                                 },{},{},
                                
//                                 {
//                                     text: 'Tipo dia:', 
//                                     style: 'campoFixo',
//                                     border:[true,true,true,false], 
//                                     colSpan: 3,
//                                 },{},{},

//                                 ],
// //1 LINHA IMPORTA
//                                 [
//                                     {
//                                         text: '6-POSEIDON MARITIMA LTDA',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan: 10,                                         
//                                     },{},{},{},{},{},{},{},{},{},
    
//                                     { 
//                                         text:'34 - POSEIDON MARITIMA LTDA', 
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan: 10,
//                                     },{},{},{},{},{},{},{},{},{},
                                    
//                                     {
//                                         text:'11/12/2018', 
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan: 4, 
//                                     },{},{},{},
    
//                                     {
//                                         text:'07:00 - 13:00', 
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan: 3,
//                                     },{},{},
                                    
//                                     {
//                                         text:'DIA ÚTIL', 
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan: 3,
//                                     },{},{},
    
//                                     ],

// //2 LINHA SUB TITULO
//                                 [                                    
//                                     {
//                                         text:'Porto:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false], 
//                                         colSpan:4,                                        
//                                     },{},{},{},
//                                     {
//                                         text:'Cais:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:4,
//                                     },{},{},{},
//                                     {
//                                         text:'Berço:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Embarcação ou local de Operação:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:10,
//                                     },{},{},{},{},{},{},{},{},{},
//                                     {
//                                         text:'Dt de Calculo:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3,
//                                     },{},{},
//                                     {
//                                         text:'Requisição:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3,
//                                     },{},{},
//                                     {
//                                         text:'Controle:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3,
//                                     },{},{},
//                                     {
//                                         text:'Viagem:',
//                                         style: 'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,
//                                     },{},
//                                 ],
// //2 LINHA IMPORTA
//                                 [                                    
//                                     {
//                                         text:'VILA VELHA',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:4,
//                                     },{},{},{},
//                                     {
//                                         text:'CAPUABA',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:4,
//                                     },{},{},{},
//                                     {
//                                         text:'202',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'SIRIUS LEADER',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true], 
//                                         colSpan:10,
//                                     },{},{},{},{},{},{},{},{},{},
//                                     {
//                                         text:'14/12/2018',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3,
//                                     },{},{},
//                                     {
//                                         text:'249228',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3,
//                                     },{},{},
//                                     {
//                                         text:'350941',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3,
//                                     },{},{},
//                                     {
//                                         text:'0',
//                                         style: 'campoRecebe',
//                                         border:[true,false,true,true], 
//                                         colSpan:2,
//                                     },{},
//                                 ],

// //3 LINHA   
//                                 [
//                                     {
//                                         colSpan: 30,                                       
//                                         fillColor: '#444',
//                                         text: '',
//                                         width: 1,
                                        
//                                     },{},{},{},{},{},{},{},{},{},{},{},{},{},
//                                 ],

// //4 LINHA SUB TITULOS
//                                 [
//                                     {
//                                         text:'\n\nPorão',
//                                         style:'campoFixo2',
//                                         rowSpan:3,
//                                         colSpan:2,
//                                     },{},
//                                 {
//                                         text:'Minutos',
//                                         style:'campoFixo2',
//                                         colSpan:4,
//                                 },{},{},{},
//                                 {
//                                         text:'Cargas Movimentadas',
//                                         style:'campoFixo2',
//                                         colSpan:16,
//                                 },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
//                                 {
//                                         text:'Taxa',
//                                         style:'campoFixo2',
//                                         colSpan:4,
//                                 },{},{},{},
//                                 {
//                                     text:'\nTipo de OP',
//                                     style:'campoFixo2',
//                                         colSpan:4,
//                                         rowSpan:2,
//                                 },{},{},{},
//                                 ],

// //5 LINHA
//                                 [
//                                     {},{},
//                                     {
//                                         text:'Parados',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Trab',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Faina',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Descrição de Carga',
//                                         style:'campoFixo2',
//                                         colSpan:8,
//                                     },{},{},{},{},{},{},{},
//                                     {
//                                         text:'Tipo',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'QTD',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Tons',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Normal',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'H Extra',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                     },{},{},{},{},
//                                 ],

// //6 LINHA
//                                 [
//                                     {},{},
//                                     {
//                                         text:'0',
//                                         style:'campoRecebe',
//                                         colSpan:2,                                        
//                                     },{},
//                                     {
//                                         text:'360',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'14.1.2',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'6 - AUTOMÓVEIS',
//                                         style:'campoRecebe',
//                                         colSpan:8,
//                                     },{},{},{},{},{},{},{},
//                                     {
//                                         text:'UTILITÁRIO',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'160,00',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'262,846',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'1,34440',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'1,34440',
//                                         style:'campoRecebe',
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'DESEMBARQUE',
//                                         style:'campoRecebe',
//                                         colSpan:4,
//                                     },{},{},{},
//                                 ],

// //7 LINHA

//                                 [
                                    
//                                     {
//                                         text:'TOTAIS = >',
//                                         style:'campoFixo2',
//                                         bold: true,
//                                         colSpan: 18,
//                                         },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
//                                     {
//                                         text:'160,00',
//                                         style:'campoRecebe',
//                                         bold: true,
//                                         colSpan: 2,
//                                     },{},
//                                     {
//                                         text:'262,846',
//                                         style:'campoRecebe',
//                                         bold: true,
//                                         colSpan: 10,
//                                     },{},{},{},{},{},{},{},{},{},
//                                 ],

// //8 LINHA

//                                 [
//                                     {
//                                         text:'\nTerno',
//                                         style:'campoFixo2',
//                                         colSpan:2,
//                                         rowSpan:2,
//                                     },{},
//                                     {
//                                         text:'\nFunção',
//                                         style:'campoFixo2',
//                                         colSpan:7,
//                                         rowSpan:2,
//                                     },{},{},{},{},{},{},
//                                     {
//                                         text:'\nTrabalhador',
//                                         style:'campoFixo2',
//                                         colSpan:9,
//                                         rowSpan:2,
//                                     },{},{},{},{},{},{},{},{},
//                                     {
//                                         text:'\nHE',
//                                         style:'campoFixo2',
//                                         colSpan:1,
//                                         rowSpan:2,
//                                     },
//                                     {
//                                         text:'\nAC',
//                                         style:'campoFixo2',
//                                         colSpan:1,
//                                         rowSpan:2,
//                                     },
//                                     {
//                                         text:'\nRT',
//                                         style:'campoFixo2',
//                                         colSpan:1,
//                                         rowSpan:2,
//                                     },
//                                     { 
//                                         text:'\nMF',
//                                         style:'campoFixo2',
//                                         colSpan:1,
//                                         rowSpan:2,
//                                     },
//                                     {
//                                         text:'Remuneração Bruta',
//                                         style:'campoFixo2',
//                                         colSpan:8,
//                                     },{},{},{},{},{},{},{},
//                                 ],

// //9 LINHA
//                                 [
//                                     {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                                    
//                                     {
//                                         text:'Salário',
//                                         style:'campoFixo2',
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'RSR',
//                                         style:'campoFixo2',
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'Restit.',
//                                         style:'campoFixo2',
//                                         colSpan:2,  
//                                     },{},
//                                     {
//                                         text:'Toral',
//                                         style:'campoFixo2',
//                                         colSpan:2,  
//                                     },{},
//                                 ],

//                                 // //10 LINHA METRICA
//                                 // //widths: [7,7,7,7,7,7,10,10,10,12,7,5,5,5,10,10,11,11,9,9,9,9,9,9,8,8,8,8,8,20,0],
//                                 // [
//                                 //     {text:'1',colSpan:1,style:'tableCampo',},
//                                 //     { text:'2',                                        
//                                 //     colSpan:1,style:'tableCampo', },{ text:'3',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'4',                                        
//                                 //     colSpan:1,style:'tableCampo', },{ text:'5',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'6',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'7',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'8',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'9',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'10',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'11',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'12',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'13',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'14',                                        
//                                 //     colSpan:1,style:'tableCampo', },{ text:'15',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'16',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'17',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'18',                                        
//                                 //     colSpan:1,style:'tableCampo', },{ text:'19',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'20',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'21',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'22',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'23',                                        
//                                 //     colSpan:1,style:'tableCampo', },{ text:'24',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'25',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'26',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'27',                                        
//                                 //     colSpan:1,style:'tableCampo', },{ text:'28',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'29',                                        
//                                 //     colSpan:1, style:'tableCampo',},{ text:'30',                                        
//                                 //     colSpan:1, style:'tableCampo',},
//                                 // ],

//                                 [
//                                     {   //TERNO
//                                         text: '1 \n 1 \n 1 \n 1 \n 1 \n 1 \n 1 ',
//                                         colSpan: 2,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },
//                                         {},
                                       
//                                         //FUNCAO
//                                         {text: '8 - CONTRAMESTRE \n 15 - MOTORISTA \n 15 - MOTORISTA \n 14 - MANOBREIRO \n 15 - MOTORISTA \n 15 - MOTORISTA \n 15 - MOTORISTA ',
//                                         colSpan: 7,
//                                         style:'tableCampo',
//                                         alignment: 'rigth',
//                                         },{},{},{},{},{},{},

//                                         //TRABALHADOR
//                                         {text: '2138 - ALEX SANTOS DE PAIVA \n 935 - ANTONIO SERGIO NASCIMENTO DOS SANTOS \n 338 - DAILSON BARBOSA MACHADO \n 415 - GENARIO MENEZES DA SILVA \n 903 - JOAO SANTANA LOPES FILHO \n 1706 - ROBERTO DA SILVA CICERO \n 831 - WALTER ANTONIO DE AVILA ',
//                                         colSpan: 9,
//                                         style:'tableCampo',
//                                         alignment: 'rigth',
//                                         },{},{},{},{},{},{},{},{},
                                       
//                                         //HE
//                                         {text: 'N \n N \n N \n N \n N \n N \n N ',
//                                         colSpan: 1,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },
                                       
//                                         //AC
//                                         {text: 'N \n N \n N \n N \n N \n N \n N ',
//                                         colSpan: 1,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },
                                      
//                                         //RT
//                                         {text: 'N \n N \n N \n N \n N \n N \n N ',
//                                         colSpan: 1,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },
                                      
//                                         //MF
//                                         {text: 'N \n N \n N \n N \n N \n N \n N ',
//                                         colSpan: 1,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },
                                       
//                                         //SALARIO
//                                         {text: '259,31 \n 172,87 \n 172,87 \n 224,73 \n 172,87 \n 172,87 \n 172,87 ',
//                                         colSpan: 2,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },{},
                                        
//                                         //RSR
//                                         {text: '47,14 \n 31,43 \n 31,43 \n 40,86 \n 31,43 \n 31,43 \n 31,43 ',
//                                         colSpan: 2,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },{},
                                      
//                                         //RESTITUIÇÃO
//                                         {text: '0,00 \n 0,00 \n 0,00 \n 0,00 \n 0,00 \n 0,00 \n 0,00 ',
//                                         colSpan: 2,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },{},
                                       
//                                         //TOTAL
//                                         {text: '306,45 \n 204,30 \n 204,30 \n 265,59 \n 204,30 \n 204,30 \n 204,30 ',
//                                         colSpan: 2,
//                                         style:'tableCampo',
//                                         alignment: 'center',
//                                         },{},
//                                 ],
                                
// //11 LINHA
//                                 [
//                                     {
//                                         colSpan: 30,                                       
//                                         fillColor: '#444',
//                                         text: '',
//                                         width: 1,
//                                     },{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
//                                 ],

//                                 // //12 LINHA
//                                 // [
//                                 //     {},{},{},{},{},{},{},{},{},{},{},{},{},{},
//                                 // ],

// //13 LINHA

//                                 [
//                                     {
//                                         text:'Homens',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'Pensi.',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,   
//                                     },{},
//                                     {
//                                         text:'Favor.',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,     
//                                     },{},
//                                     {
//                                         text:'Salário',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'Restituição',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'RSR',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'MMO Bruto',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'Férias',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'13º Salario',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:' INSS P/ MMO',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'INSS P/ FÉRIAS',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'INSS P/ 13°',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'FGTS',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:1, 
//                                     }, 
//                                 ],

// //13 LINHA

//                                 [
//                                     {
//                                         text:'7',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'0',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2,   
//                                     },{},
//                                     {
//                                         text:'0',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2,     
//                                     },{},
//                                     {
//                                         text:'1.348,39',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'0,00',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'245,15',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'1.593,54',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'177,21',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'132,91',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'459,09',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'51,03',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'38,29',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'152,27',
//                                         style:'campoRecebe',
//                                         border:[true,false,true,true],
//                                         colSpan:1, 
//                                     }, 
//                                 ],


// //14 LINHA
//                                 [
//                                     {
//                                         text:'Lan.Bancario',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'F.G.R.B.',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,  
//                                     },{},
//                                     {
//                                         text:'FSO',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,   
//                                     },{},
//                                     {
//                                         text:'FSS',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,     
//                                     },{},
//                                     {
//                                         text:'P.P.C',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2,
//                                     },{},
//                                     {
//                                         text:'TX Ogmo',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
                                    
//                                     {
//                                         text:'Desc Alim.',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'Pagto Alim.',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:2, 
//                                     },{},
//                                     {
//                                         text:'Desc Transp',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3, 
//                                     },{},{},
//                                     {
//                                         text:'Alimen./Transp.',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3,   
//                                     },{},{},
//                                     {
//                                         text:'Estru. Sindicato',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3,   
//                                     },{},{},
//                                     {
//                                         text:'Total Gerado',
//                                         style:'campoFixo',
//                                         border:[true,true,true,false],
//                                         colSpan:3,
//                                     },{},{},
//                                 ],
// //14 LINHA
//                             [
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:3,         
//                                 },{},{},
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:2,  
//                                 },{},
//                                 {
//                                     text:'13,49',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:2,        
//                                 },{},
//                                 {
//                                     text:'256,22',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:2,        
//                                 },{},
//                                 {
//                                     text:'26,98',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:2, 
//                                 },{},
//                                 {
//                                     text:'108,04',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:3,
//                                 },{},{},
                                
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:2,      
//                                 },{},
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:2,
//                                 },{},
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:3,
//                                 },{},{},
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:3,
//                                 },{},{},
//                                 {
//                                     text:'0,00',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:3,
//                                 },{},{},
//                                 {
//                                     text:'3.009,07',
//                                     style:'campoRecebe',
//                                     border:[true,false,true,true],
//                                     colSpan:3, 
//                                 },{},{},
//                             ],
//                         ]
//                     }
                    
//                 },
                    

             ],
            
            styles: {
                table:{
                    border:true,
                    
                },

                header: {
                    fontSize: 18,
                    color:'black',
                    bold: true,
                    alignment: 'left',
                    margin: [0, 10, 0, 10],
                    image: 'Logomarca_contorno.png',
                },
                               
                tableCampo: {
                    bold: false,
                    fontSize: 6,
                    color: 'black',                    
                    margin: [0, 2, 0, 2],         
                },

                DestacaCampo: {
                    fontSize: 7,
                    bold: true,
                    color: 'black',
                },

                docDefinition: {
                    alignment: 'left',
                    margin: [-8, 20, 0, 2],
                },

                footer: {
                    fontSize: 8,
                    color: 'black',                    
                   // margin: [0, 3, 9, 3], 
                },
            
                defaultStyle: {
                    alignment: 'left',
                    margin: [-8, 20, 0, 2],
                },

                defaultStyleFooter: {
                    alignment: 'left',
                    margin: [30, 0, 0, 0],
                    heigth: '20px',
                },

                campoFixo:{
                    fontSize: 6,
                    color: 'black', 
                    margin:[-2,0,0,-2],
                    alignment: 'rigth',

                },
                campoFixo2:{
                    fontSize: 6,
                    color: 'black', 
                    margin:[1,-1,-1,1],
                    alignment: 'center',

                },
                campoRecebe:{
                    fontSize: 7,
                    color: 'black', 
                    margin:[0,-1,-1,0],
                    alignment: 'rigth',
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

export default Modelo;
