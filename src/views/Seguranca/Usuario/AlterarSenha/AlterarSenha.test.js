import React from 'react';
import ReactDOM from 'react-dom';
import AlterarSenha from './AlterarSenha';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AlterarSenha />, div);
  ReactDOM.unmountComponentAtNode(div);
});
