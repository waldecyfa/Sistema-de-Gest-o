import React from 'react';
import ReactDOM from 'react-dom';
import Novo from './Novo';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Novo />, div);
  ReactDOM.unmountComponentAtNode(div);
});
