import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from 'reactstrap';

const RemotePagination = ({ data, columns, options, onTableChange, className, MySearch, loading }) => {

    return (

        <ToolkitProvider
            keyField="id"
            data={ data }
            columns={ columns }
            search            
        >
        {
            toolkitprops => (
                <div>
                    <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend" className="search-prepend">
                            <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                        </InputGroupAddon>
                        <MySearch 
                            {...toolkitprops.searchProps}
                            placeholder="Pesquisar"
                            autoFocus={true}
                        />
                    </InputGroup>
                    <hr />
                    <BootstrapTable
                        { ...toolkitprops.baseProps }
                        // remote={ {sort: true} }
                        remote={ true }
                        loading={loading}
                        onTableChange={ onTableChange }
                        // keyField="id"
                        striped
                        hover
                        condensed
                        bordered={ false }
                        noDataIndication="Nenhum registro encontrado"
                        pagination={ paginationFactory( options )}
                        // filter={filterFactory()}
                        classes={ className }                
                    />
                </div>
            )
        }
        </ToolkitProvider>
    )
}

class TabelaRemota extends Component {
  
    /************
     * RENDER
     */
    render() {

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
            paginationTotalRenderer: customTotal,
            totalSize: this.props.pageTotalElements,
            page: this.props.pageNumber,
            sizePerPage :this.props.pageSize,
            sizePerPageList: [{
                text: '20', value: 20
            }, {
                text: '50', value: 50
            }, {
                text: '100', value: 100
            }] 
        };

        const MySearch = (props) => {
            let input;            

            return (
                <label className="search-label">
                    <input
                        className="form-control"
                        ref={n => input = n}
                        type="text"                        
                        placeholder="Pesquisar"
                        autoFocus={false}
                        value={this.props.busca}
                        onChange={this.props.aoBuscar}                        
                    />
                </label>
            );
        };

        return (

            <RemotePagination
                data={ this.props.lista }
                columns= { this.props.colunas }
                loading={this.props.loading}
                options={ options }
                onTableChange={ this.props.aoMudarTabela }                
                className= { this.props.className }
                MySearch={MySearch}
            />
        );
    }
}

export default TabelaRemota;
