import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';

class Tabela extends Component {
    
    /************
     * RENDER
     */
    render() {

        const { SearchBar } = Search;

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                {" "} { size } ({ from }-{ to })
            </span>
        );    
        
        const options = {
            paginationSize: 5,
            pageStartIndex: 1,
            // alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: '<<',
            prePageText: '<',
            nextPageText: '>',
            lastPageText: '>>',
            nextPageTitle: '<<',
            prePageTitle: '<',
            firstPageTitle: '>',
            lastPageTitle: '>>',
            showTotal: true,
            // page: this.props.pageNumber,
            // sizePerPage: this.props.pageSize,
            paginationTotalRenderer: customTotal,
            totalSize: this.props.lista.length,
            sizePerPageList: [{
                text: '20', value: 20
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }] 
          };

        return (
            <ToolkitProvider
                keyField="id"
                data={ this.props.lista } 
                columns={ this.props.colunas } 
                search            
            >
            {
                toolkitprops => (
                    <div>
                        <InputGroup className="input-prepend">
                            <InputGroupAddon addonType="prepend" className="search-prepend">
                                <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <SearchBar  
                                {...toolkitprops.searchProps}
                                placeholder="Pesquisar"
                                autoFocus={false}
                            />
                        </InputGroup>
                        <hr />
                        <BootstrapTable 
                            { ...toolkitprops.baseProps }
                            // keyField='id' 
                            striped
                            hover
                            condensed
                            bordered={ false }
                            noDataIndication="Nenhum registro encontrado"
                            // data={ this.props.lista } 
                            // columns={ this.props.colunas } 
                            pagination={ paginationFactory( options )}
                        />
                    </div>
                )
            }
            </ToolkitProvider>
        );
    }
}

export default Tabela;
