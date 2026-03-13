import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './assets/fontawesome-pro-6.5.1-web/css/all.css'
import './assets/fontawesome-pro-6.5.1-web/css/all.min.css'
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider} from '@react-oauth/google';  
import { ContextAPI } from './component/Service/APIContext';

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <GoogleOAuthProvider clientId="83839772058-dd75gs5bntr1rqih85uo9gjbfbo9p2rr.apps.googleusercontent.com"> 
  <BrowserRouter>
    <ContextAPI>
    <App />
    </ContextAPI>
  </BrowserRouter>
  </GoogleOAuthProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();