import React from 'react'
import Canvas from './components/canvas'
import axios from 'axios'

class ImgGenDemo extends React.Component{
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
        results: undefined,

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
                var prompt = document.getElementById('prompt').value
                var negative_prompt = document.getElementById('negative_prompt').value
                axios.post(window.location.protocol+'//'+window.location.hostname+':5000/ImgGen', {data: _this.state.send_data, prompt:prompt, negative_prompt:negative_prompt})
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
            <div style={{marginLeft:'10px', flex:'2 1'}}>
                <p>Input Time: {Math.round(this.state.send_data.length/231*100)/100}/1</p>
                <div style={{display:'flex'}}>
                    Prompt: <textarea id='prompt' style={{flex:'2'}} type='text' value="man's portrait, surrealism, emotional"></textarea>
                </div>
                <div style={{display:'flex'}}>
                    Negative Prompt: <textarea id='negative_prompt' style={{flex:'2'}} type='text' value="low quality, graininess, blurs, bad anatomy, blurry, cloned face, extra arms, extra fingers, extra limbs, extra legs, fused fingers, malformed limbs , missing arms, missing legs, mutated hands, out of frame, too many fingers"></textarea>
                </div>
                {this.state.results && <div style={{marign: 10}}>
                    <img src={this.state.results} style={{width: '100%'}}></img>
                </div>}
            </div>
            
        </div>)
    }

}export default ImgGenDemo