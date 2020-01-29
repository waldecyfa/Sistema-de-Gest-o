import React from 'react';
import ReactDOM from 'react-dom';
import Editar from './Editar';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Editar />, div);
  ReactDOM.unmountComponentAtNode(div);
});
