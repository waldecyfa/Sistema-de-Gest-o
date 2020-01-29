import React from 'react';
import ReactDOM from 'react-dom';
import FiltrarRelatorioCons from './FiltrarRelatorioCons';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FiltrarRelatorioCons />, div);
  ReactDOM.unmountComponentAtNode(div);
});
