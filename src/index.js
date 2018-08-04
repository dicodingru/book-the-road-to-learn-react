import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <App user={{ firstName: 'Di', lastName: 'Coderr' }} />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
