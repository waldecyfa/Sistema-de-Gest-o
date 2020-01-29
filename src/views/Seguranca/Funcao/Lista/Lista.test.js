import React from 'react';
import ReactDOM from 'react-dom';
import Lista from './Lista';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Lista />, div);
  ReactDOM.unmountComponentAtNode(div);
});
