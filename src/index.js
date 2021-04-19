// IE SUPPORT
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingSpinner } from "hds-react";
import './index.css';
import './fonts.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSpinner style={{ margin: "50vh auto 0"}} />}>
      <Router>
        <App />
      </Router>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
