import { useState } from 'react'
import axios from "axios";
import AnnotationInfo from './components/annotation_info';
import Canvas from './components/canvas';
import React from 'react'
import gup from './components/gup'

class Annotation extends React.Component{
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.Canvas = React.createRef();
  }

  state = {
    started: false,
    time: 0,
    emotion: '',
    task_time: 0,
    annotator_id: '',
    intervalf: undefined,
  }

  componentDidMount(){
    var annotator_id = gup('annotator')
    var order = parseInt(gup('order'))
    var _this = this
    axios.post(window.location.protocol+'//'+window.location.hostname+':5000/initiateTask', {annotator_id, order})
    .then(function(response){
      if(response.data.response=='no_task'){
        alert('No task exists')
        window.location.href = window.location.protocol+'//'+window.location.hostname+':3000'
      }
      _this.setState({annotator_id, emotion: response.data.emotion, task_time: response.data.tasktime})
    })
  }

  Start(_this){

    var intervalf = setInterval(function(){
      var updated_time = _this.state.time + 100
      _this.setState({time:updated_time})
    }, 100)
    _this.setState({started:true, intervalf})
    var annotator_id = gup('annotator')
    var order = parseInt(gup('order'))
    axios.post(window.location.protocol+'//'+window.location.hostname+':5000/startTask', {annotator_id, order})
  }

  NextTask(){
    var annotator_id = gup('annotator')
    var order = parseInt(gup('order'))
    console.log(this.Canvas.current.state)
    axios.post(window.location.protocol+'//'+window.location.hostname+':5000/submitTask', {annotator_id, order, data:this.Canvas.current.state.pastpoints})
    .then(function(response){
      window.location.href = window.location.origin+'/annotator?order='+(order+1).toString()+'&annotator='+annotator_id
    })
 
  }

  ResetTask(){
    var _this = this
    clearInterval(this.state.intervalf)
    this.setState({time:0, started:false}, function(){
      _this.Canvas.current.setState({pastpoints:[], pointer_state:'idle'})
      _this.Canvas.current.setIntervalFunction()
      // func()
    })
  }

    //end of new line 
  render(){
    return (
      <div className="App flex_row">
        <AnnotationInfo mother={this} time={this.state.time} started={this.state.started} emotion={this.state.emotion} task_time={this.state.task_time} annotator_id={this.state.annotator_id}></AnnotationInfo>
        <Canvas ref={this.Canvas} annotation={true} mother={this} started={this.state.started} task_time={this.state.task_time} time={this.state.time}></Canvas>
        
      </div>
    );
  }  
  
}

export default Annotation;
