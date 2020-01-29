import React from 'react';
import ReactDOM from 'react-dom';
import RelatorioConsolidacao from './RelatorioConsolidacao';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RelatorioConsolidacao />, div);
  ReactDOM.unmountComponentAtNode(div);
});
