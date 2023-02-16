import React from 'react'
import Canvas from './components/canvas'
import axios from 'axios'

class RecognitionDemo extends React.Component{
    constructor(props) {
        super(props);
        // create a ref to store the textInput DOM element
        this.Canvas = React.createRef();
      }

    state = {
        started: false,
        time: 5000,
        emotion: '',
        cur_time: 0,
        intervalf: undefined,
        send_data: [],
        last_data: undefined,
        results: undefined
      }

    Start(_this){
        if(_this.state.started){
            return
        }
        var last_data = undefined
        var intervalid1 = setInterval(function(){
            if(_this.state.send_data.length>=231){
                clearInterval(_this.state.intervalf)
                // send the data
                console.log(_this.state.send_data)
                axios.post(window.location.protocol+'//'+window.location.hostname+':5000/Recognition', {data: _this.state.send_data})
                .then(function(response){
                    _this.setState({results: response.data.result})
                })
                    

                // reset
                _this.setState({send_data:[], cur_time: 0, started:false}, function(){
                    _this.Canvas.current.setState({pointer_state:'idle'})
                    _this.Canvas.current.setIntervalFunction()
                })
                
                
                return
            }
            
            if(_this.state.last_data!=undefined){
                var x, y, p, m
                if(_this.Canvas.current.state.pointer_state=='move' && _this.state.last_data[2]=='move'){
                    x = _this.Canvas.current.state.x - _this.state.last_data[0]
                    y = _this.Canvas.current.state.y - _this.state.last_data[1]
                    p = _this.Canvas.current.state.p
                    m = 1
                }else{
                    x = 0
                    y = 0
                    p = 0
                    m = 0
                }
                console.log(x,y,p,m)
                _this.state.send_data.push([x,y,p,m])
            }
            _this.setState({last_data: [_this.Canvas.current.state.x, _this.Canvas.current.state.y, _this.Canvas.current.state.pointer_state], cur_time: _this.state.cur_time+20})
        }, 20)
        _this.setState({started:true, intervalf: intervalid1, last_data, cur_time: 0})
    }

    render(){
        return (<div className='App flex_row'>
            <Canvas ref={this.Canvas} mother={this} annotation={false} inference={true}></Canvas>
            <div style={{marginLeft:'10px'}}>
                <p>Input Time: {Math.round(this.state.send_data.length/231*100)/100}/1</p>
                <div>
                <p>angry: {this.state.results!=undefined && Math.round(100*this.state.results['angry'])/100}</p>
                <p>disgusted: {this.state.results!=undefined && Math.round(100*this.state.results['disgusted'])/100}</p>
                <p>fearful: {this.state.results!=undefined && Math.round(100*this.state.results['fearful'])/100}</p>
                <p>happy: {this.state.results!=undefined && Math.round(100*this.state.results['happy'])/100}</p>
                <p>sad: {this.state.results!=undefined && Math.round(100*this.state.results['sad'])/100}</p>
                <p>surprised: {this.state.results!=undefined && Math.round(100*this.state.results['surprised'])/100}</p>
                </div>
            </div>
            
        </div>)
    }

}export default RecognitionDemo