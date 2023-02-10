import { useState } from 'react'
import axios from "axios";
import AnnotationInfo from './components/annotation_info';
import Canvas from './components/canvas';
import React from 'react'

class Annotation extends React.Component{


  
    //end of new line 
  render(){
    return (
      <div className="App flex_row">
        <AnnotationInfo></AnnotationInfo>
        <Canvas></Canvas>
        
      </div>
    );
  }  
  
}

export default Annotation;
