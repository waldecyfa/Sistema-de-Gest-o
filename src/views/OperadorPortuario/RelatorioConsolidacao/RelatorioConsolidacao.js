import React, { Component } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Col, 
    Pagination, 
    PaginationItem, 
    PaginationLink, 
    Row, 
    Table 
} from 'reactstrap';
import logo from '../../../assets/img/brand/Logomarca_contorno.PNG'

class RelatorioConsolidacao extends Component {

    render() {

        return (
			<div className="animated fadeIn">
				<Row>
					<Col>
						<Card>
							<CardHeader>
								{/*
					<i className="fa fa-align-justify"></i> 
					<ResponsiveImage source={logo} initWidth="138" initHeight="138"/>
				*/}

								<Row>
									<Col xs="12" lg="2">
										<img src={logo} alt="OGMO-ES" width="140" height="auto" ></img>

									</Col>
									<Col xs="10" lg="10">
										<h4>Cosolidação de pagamentos</h4>
										<p><span className="h6">PORTOCEL TERMINAL ESPECIALIZADO DE BARRA DO RIACHO SA</span><br />
											<span className="display-6">Período de Pagamento entre DD/MM/AAAA e DD/MM/AAAA</span></p>
									</Col>
								</Row>

							</CardHeader>
							<CardBody>
								<Table striped responsive size="sm2">
                            <thead>
                            <tr>
                                <th>Operação</th>                                
                                <th>Adicional</th>
                                <th>Terno </th>
                                <th>Tonelada</th>
                                <th>MMO (Sal.+Rsr)</th>
                                <th>13º Salário</th>
                                <th>Férias</th>
                                <th>INSS</th>
                                <th>FGTS</th>
                                <th>F.S.S.</th>
                                <th>P.P.C.</th>
                                <th>F.D.T.F.P.</th>
                                <th>F.G.R.B.</th>
                                <th>Lanc.Bancário</th>
                                <th>Alimentação</th>
                                <th>Transporte</th>
                                <th>Estrutura Sind.</th>
                                <th>Tx ADM</th>
                                <th>Total</th>
                            </tr>                          
                            </thead>
                            <tbody>
                            <tr>
                                <th colSpan={19}>Cliente: CIA NIPO BRASILEIRA</th>
                            </tr>   
                            <tr>
                                <th colSpan={17}>ARRUMADOR</th>
                                <th colSpan={2}>Navio: HARDANGER</th>
                            </tr>                         
                            <tr>                                
                                {/*<th scope="row">1</th>*/}
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>1</td>
                                <td>340,000</td>
                                <td>119,18</td>
                                <td>9,94</td>
                                <td>13,25</td>
                                <td>41,01</td>
                                <td>11,39</td>
                                <td>19,16</td>
                                <td>2,02</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>575,70</td>
                            </tr>
                            <tr>                                
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Arrumador</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={17}>CONFERENTE</th>
                                <th colSpan={2}>Navio: HARDANGER</th>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Conferente</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={17}>ESTIVADOR</th>
                                <th colSpan={2}>Navio: HARDANGER</th>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td>25%</td>
                                <td>1</td>
                                <td>340,000</td>
                                <td>119,18</td>
                                <td>9,94</td>
                                <td>13,25</td>
                                <td>41,01</td>
                                <td>11,39</td>
                                <td>19,16</td>
                                <td>2,02</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>575,70</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Estivador</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Navio</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Cliente</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={19}>Cliente: FIBRIA CELULOSE SA</th>
                            </tr>   
                            <tr>
                                <th colSpan={17}>ARRUMADOR</th>
                                <th colSpan={2}>Navio: HARDANGER</th>
                            </tr>                         
                            <tr>                                
                                {/*<th scope="row">1</th>*/}
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>1</td>
                                <td>340,000</td>
                                <td>119,18</td>
                                <td>9,94</td>
                                <td>13,25</td>
                                <td>41,01</td>
                                <td>11,39</td>
                                <td>19,16</td>
                                <td>2,02</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>575,70</td>
                            </tr>
                            <tr>                                
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Arrumador</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={17}>CONFERENTE</th>
                                <th colSpan={2}>Navio: HARDANGER</th>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Conferente</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={17}>ESTIVADOR</th>
                                <th colSpan={2}>Navio: HARDANGER</th>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td>25%</td>
                                <td>1</td>
                                <td>340,000</td>
                                <td>119,18</td>
                                <td>9,94</td>
                                <td>13,25</td>
                                <td>41,01</td>
                                <td>11,39</td>
                                <td>19,16</td>
                                <td>2,02</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>575,70</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <td>10/09/2018 07-13</td>
                                <td></td>
                                <td>2</td>
                                <td>312,000</td>
                                <td>97,69</td>
                                <td>8,15</td>
                                <td>10,86</td>
                                <td>33,62</td>
                                <td>9,34</td>
                                <td>15,71</td>
                                <td>8,90</td>
                                <td>1,01</td>
                                <td>1,01</td>
                                <td>9,64</td>
                                <td>128,00</td>
                                <td>180,00</td>
                                <td>32,00</td>
                                <td>8,09</td>
                                <td>534,21</td>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Estivador</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Navio</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            <tr>
                                <th colSpan={3}>Total Cliente</th>
                                <th>11.500,000</th>
                                <th>8.918,32</th>
                                <th>743,78</th>
                                <th>991,73</th>
                                <th>3.069,15</th>
                                <th>852,35</th>
                                <th>1.433,83</th>
                                <th>150,89</th>
                                <th>75,51</th>
                                <th>75,51</th>
                                <th>59,80</th>
                                <th>842,22</th>
                                <th>1.184,37</th>
                                <th>210,55</th>
                                <th>605,28</th>
                                <th>19.213,29</th>
                            </tr>
                            </tbody>
                        </Table>
								<nav>
									<Pagination>
										<PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
										<PaginationItem active>
											<PaginationLink tag="button">1</PaginationLink>
										</PaginationItem>
										<PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
										<PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
										<PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
										<PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
									</Pagination>
								</nav>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</div>

		);

    /*
        return (
            
            <div className="animated fadeIn">
                <Row>
                <Col xs="12" lg="6">
                    <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Simple Table 1111
                    </CardHeader>
                    <CardBody>
                        <Table responsive>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Date registered</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Samppa Nori</td>
                            <td>2012/01/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Estavan Lykos</td>
                            <td>2012/02/01</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="danger">Banned</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Chetan Mohamed</td>
                            <td>2012/02/01</td>
                            <td>Admin</td>
                            <td>
                            <Badge color="secondary">Inactive</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Derick Maximinus</td>
                            <td>2012/03/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="warning">Pending</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Friderik Dávid</td>
                            <td>2012/01/21</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        </tbody>
                        </Table>
                        <Pagination>
                        <PaginationItem>
                            <PaginationLink previous tag="button"></PaginationLink>
                        </PaginationItem>
                        <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink tag="button">4</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink next tag="button"></PaginationLink>
                        </PaginationItem>
                        </Pagination>
                    </CardBody>
                    </Card>
                </Col>

                <Col xs="12" lg="6">
                    <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Striped Table
                    </CardHeader>
                    <CardBody>
                        <Table responsive striped>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Date registered</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Yiorgos Avraamu</td>
                            <td>2012/01/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Avram Tarasios</td>
                            <td>2012/02/01</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="danger">Banned</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Quintin Ed</td>
                            <td>2012/02/01</td>
                            <td>Admin</td>
                            <td>
                            <Badge color="secondary">Inactive</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Enéas Kwadwo</td>
                            <td>2012/03/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="warning">Pending</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Agapetus Tadeáš</td>
                            <td>2012/01/21</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        </tbody>
                        </Table>
                        <Pagination>
                        <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                        <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                        </Pagination>
                    </CardBody>
                    </Card>
                </Col>
                </Row>

                <Row>

                <Col xs="12" lg="6">
                    <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Condensed Table
                    </CardHeader>
                    <CardBody>
                        <Table responsive size="sm">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Date registered</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Carwyn Fachtna</td>
                            <td>2012/01/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Nehemiah Tatius</td>
                            <td>2012/02/01</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="danger">Banned</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Ebbe Gemariah</td>
                            <td>2012/02/01</td>
                            <td>Admin</td>
                            <td>
                            <Badge color="secondary">Inactive</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Eustorgios Amulius</td>
                            <td>2012/03/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="warning">Pending</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Leopold Gáspár</td>
                            <td>2012/01/21</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        </tbody>
                        </Table>
                        <Pagination>
                        <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                        <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                        </Pagination>
                    </CardBody>
                    </Card>
                </Col>

                <Col xs="12" lg="6">
                    <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Bordered Table
                    </CardHeader>
                    <CardBody>
                        <Table responsive bordered>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Date registered</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Pompeius René</td>
                            <td>2012/01/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Paĉjo Jadon</td>
                            <td>2012/02/01</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="danger">Banned</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Micheal Mercurius</td>
                            <td>2012/02/01</td>
                            <td>Admin</td>
                            <td>
                            <Badge color="secondary">Inactive</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Ganesha Dubhghall</td>
                            <td>2012/03/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="warning">Pending</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Hiroto Šimun</td>
                            <td>2012/01/21</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        </tbody>
                        </Table>
                        <Pagination>
                        <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                        <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                        </Pagination>
                    </CardBody>
                    </Card>
                </Col>

                </Row>

                <Row>
                <Col>
                    <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Combined All Table
                    </CardHeader>
                    <CardBody>
                        <Table hover bordered striped responsive size="sm">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Date registered</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Vishnu Serghei</td>
                            <td>2012/01/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Zbyněk Phoibos</td>
                            <td>2012/02/01</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="danger">Banned</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Einar Randall</td>
                            <td>2012/02/01</td>
                            <td>Admin</td>
                            <td>
                            <Badge color="secondary">Inactive</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Félix Troels</td>
                            <td>2012/03/01</td>
                            <td>Member</td>
                            <td>
                            <Badge color="warning">Pending</Badge>
                            </td>
                        </tr>
                        <tr>
                            <td>Aulus Agmundr</td>
                            <td>2012/01/21</td>
                            <td>Staff</td>
                            <td>
                            <Badge color="success">Active</Badge>
                            </td>
                        </tr>
                        </tbody>
                        </Table>
                        <nav>
                        <Pagination>
                            <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                            <PaginationItem active>
                            <PaginationLink tag="button">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                            <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                            <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                            <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                        </Pagination>
                        </nav>
                    </CardBody>
                    </Card>
                </Col>
                </Row>
            </div>

        );
    */
    }
}

export default RelatorioConsolidacao;
