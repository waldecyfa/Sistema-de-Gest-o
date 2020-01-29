import React from 'react';
import ReactDOM from 'react-dom';
import Filtro from './Filtro';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Filtro />, div);
  ReactDOM.unmountComponentAtNode(div);
});
