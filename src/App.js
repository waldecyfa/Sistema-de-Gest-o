import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, } from './store';

import './App.css';
// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'

// Containers
import { DefaultLayout } from './containers';

//Página de Login
import Login from './views/Seguranca/Usuario/Login';

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				{/* @Comentar abaixo */}
				<PersistGate loading={null} persistor={persistor}>
				<HashRouter>
					<Switch>
						<Route exact path="/login" name="Acessar Sistema" component={Login} />
						<Route path="/" name="Início" component={DefaultLayout} /> 
					</Switch>
				</HashRouter>
				{/* @Comentar abaixo */}
				</PersistGate>
			</Provider>
		);
	}
}

export default App;
