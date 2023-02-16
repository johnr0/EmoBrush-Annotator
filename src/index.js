import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import Annotation from './_Annotation';
import Start from './_Start';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import RecognitionDemo from './_RecognitionDemo_';
import ImgGenDemo from './_ImgGenDemo_';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/annotator" element={<Annotation />} />
        <Route path="/" element={<Start />} />
        <Route path="/recognition" element={<RecognitionDemo />} />
        <Route path="/image" element={<ImgGenDemo/>}/>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
