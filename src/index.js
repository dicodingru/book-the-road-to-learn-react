import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './App.css';

ReactDOM.render(
  <App user={{ firstName: 'Di', lastName: 'Coderr' }} />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
