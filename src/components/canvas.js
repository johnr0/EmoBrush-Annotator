import React from 'react'
import Pressure from 'pressure'

class Canvas extends React.Component{
    state = {
        pointer_state:'idle',
        side: -1,
        x: -1,
        y: -1,
        p: -1,
        t: -1,
        pastpoints: [],
        intervalf: undefined
    }

    componentDidMount(){
        console.log(window.innerHeight-40)
        var side 
        if(window.innerWidth<window.innerHeight){
            side = window.innerWidth-40
        }else{
            side = window.innerHeight-40
        }
        console.log(side)
        this.setState({side})
        document.getElementById('Canvas_div').style.width = (side).toString()+'px'
        document.getElementById('Canvas_div').style.height = (side).toString()+'px'
        document.getElementById('Canvas').style.width = (side).toString()+'px'
        document.getElementById('Canvas').style.height = (side).toString()+'px'

        var _this = this
        

        if(this.props.annotation){
            this.setIntervalFunction()
        }
        
        var _this = this
        Pressure.set('#Canvas', {
            change: function(force, e){
                // console.log('touch', e)
                        
                        if(_this.state.pointer_state=='start' || _this.state.pointer_state=='move'){
                            console.log('changing...')
                            var x = (e.clientX - document.getElementById('Canvas').getBoundingClientRect().x)/_this.state.side
                            var y = (e.clientY - document.getElementById('Canvas').getBoundingClientRect().y)/_this.state.side
                            var p = force
                            if(x<0){x=0}
                            if(x>1){x=1}
                            if(y<0){y=0}
                            if(y>1){y=1}
                            console.log(x, y, p)
                            if(_this.state.pastpoints.length==0 || _this.state.pastpoints[_this.state.pastpoints.length-1][3]==-1 || (_this.state.pastpoints[_this.state.pastpoints.length-1][0]==x && _this.state.pastpoints[_this.state.pastpoints.length-1][1]==y)){
                                _this.setState({x, y, p,t:force, pointer_state:'move'})
                            }
                            
                            
                            
                        }
                    
                
                
            }
        })
    }

    setIntervalFunction(){
        var _this = this
        console.log(this.state.intervalf,window.refreshIntervalId)
        if(this.state.intervalf!=undefined){
            console.log(this.state.intervalf, 'yea')
            clearInterval(this.state.intervalf)
        }
        var intervalf = setInterval(function(){
            if(_this.props.started && _this.props.task_time>_this.props.time){
                if(_this.state.pointer_state=='move'){
                    // console.log(_this.state.x, _this.state.y, _this.state.p, k)
                    _this.state.pastpoints.push([_this.state.x,_this.state.y,_this.state.p, 1])
                    // TODO store data at here
                }else{
                    
                    if(_this.state.pastpoints.length>0){
                            _this.state.pastpoints.push([-1,-1,-1, -1])
                            _this.setState({})
                            
                    }
                    
                }
            }     
        }, 20)
        this.setState({intervalf})

    }

    canvasPointerDown(e){
        if(this.state.pointer_state=='idle'){
            this.setState({pointer_state:'start'})
            if(this.props.annotation){
                this.props.mother.Start(this.props.mother)
            }
            if(this.props.inference){
                this.props.mother.Start(this.props.mother)
                
            }
        }
    }

    

    canvasTouchMove(e){
        if(this.state.pointer_state=='start' || this.state.pointer_state=='move'){
            this.setPositionPressure(e)
            
        }
    }

    setPositionPressure(e){
        var x = (e.targetTouches[0].clientX - document.getElementById('Canvas').getBoundingClientRect().x)/this.state.side
        var y = (e.targetTouches[0].clientY - document.getElementById('Canvas').getBoundingClientRect().y)/this.state.side
        var p = e.targetTouches[0].force
        var l = e.targetTouches
        if(x<0){x=0}
        if(x>1){x=1}
        if(y<0){y=0}
        if(y>1){y=1}
        // console.log('t move', x, y, p)
        
        this.setState({x, y, p, l, pointer_state:'move'})

    }

    canvasPointerMove(e){
        if(this.state.pointer_state=='start' || this.state.pointer_state=='move'){
            var x = (e.clientX - document.getElementById('Canvas').getBoundingClientRect().x)/this.state.side
            var y = (e.clientY - document.getElementById('Canvas').getBoundingClientRect().y)/this.state.side
            var p = e.force
            // console.log('p move', x,y)
            if(x<0){x=0}
            if(x>1){x=1}
            if(y<0){y=0}
            if(y>1){y=1}
            
            this.setState({x, y, pointer_state:'move'})
            
        }
    }

    canvasPointerUp(){
        if(this.state.pointer_state=='move'){
            this.setState({pointer_state:'idle'})
            // if(){
            //     this.state.pastpoints.push([this.state.x,this.state.y,this.state.p, -1])
            // }
            
        }
    }

    renderDots(obj, pad){
        return obj.map((val, idx)=>{
            var x, y
            if(pad){
                x= val[0]+0.5
                y=val[1]+0.5
            }else{
                x=val[0]
                y=val[1]
            }
            return (<circle cx={this.state.side*x} cy={this.state.side*y} r={40*val[2]} opacity={0.1}></circle>)
        })
    }

    renderLines(){
        return this.state.pastpoints.map((val, idx)=>{
            if(idx==0){return}
            if(val[3]==-1){return}
            if(this.state.pastpoints[idx-1][3]==-1){
                return}
            // var tilt = (val[1]-val[0])/(this.state.pastpoints[idx-1][1]-this.state.pastpoints[idx-1][0])
            // var r_base = 20
            // var r0 = r_base * this.state.pastpoints[idx-1][2]
            // var r1 = r_base * val[2]
            // var x00 = r0/Math.sqrt(1+1/tilt*tilt)+this.state.side*this.state.pastpoints[idx-1][0]
            // var y00 = r0/Math.sqrt(1+tilt*tilt)+this.state.side*this.state.pastpoints[idx-1][1]

            // var x01 = -r0/Math.sqrt(1+1/tilt*tilt)+this.state.side*this.state.pastpoints[idx-1][0]
            // var y01 = -(x01-this.state.side*this.state.pastpoints[idx-1][0])/tilt++this.state.side*this.state.pastpoints[idx-1][1]
            // var y01 = -r0/Math.sqrt(1+tilt*tilt)+this.state.side*this.state.pastpoints[idx-1][1]

            // var x10 = r1/Math.sqrt(1+1/tilt*tilt)+this.state.side*val[0]
            // var y10 = r1/Math.sqrt(1+tilt*tilt)+this.state.side*val[1]

            // var x11 = -r1/Math.sqrt(1+1/tilt*tilt)+this.state.side*val[0]
            // var y11 = -r1/Math.sqrt(1+tilt*tilt)+this.state.side*val[1]
            // var poly = 
            // return (<polygon points></polygon>)
            // return (<line x1={this.state.side*this.state.pastpoints[idx-1][0]} y1={this.state.side*this.state.pastpoints[idx-1][1]} x2={this.state.side*val[0]} y2={this.state.side*val[1]} stroke='black' strokeWidth={(val[2])*80}></line>)
            return (<line x1={this.state.side*this.state.pastpoints[idx-1][0]} y1={this.state.side*this.state.pastpoints[idx-1][1]} x2={this.state.side*val[0]} y2={this.state.side*val[1]} stroke='black' strokeWidth={(val[2]+this.state.pastpoints[idx-1][2])/2*80}></line>)
            // return (<line x1={this.state.side*this.state.pastpoints[idx-1][0]} y1={this.state.side*this.state.pastpoints[idx-1][1]} x2={this.state.side*val[0]} y2={this.state.side*val[1]} stroke='black' strokeWidth={20} opacity={(val[2]+this.state.pastpoints[idx-1][2])/2}></line>)
        })
    }

    render(){
        return (<div id='Canvas_div' className='Canvas'>
            <svg id='Canvas' style={{backgroundColor:(this.props.task_time<=this.props.time)?'#aaaaaa':''}} onPointerDown={this.canvasPointerDown.bind(this)} onTouchMove={this.canvasTouchMove.bind(this)} onPointerMove={this.canvasPointerMove.bind(this)} onPointerUp={this.canvasPointerUp.bind(this)}>
                {this.props.annotation && this.renderDots(this.state.pastpoints)}
                {/* {this.props.inference && this.renderDots(this.props.mother.state.send_data, true)} */}
                {/* {this.renderLines()} */}
            </svg>
            <span className='disableSelect' style={{pointerEvents:'none'}}>{this.state.x.toFixed(2)}, {this.state.y.toFixed(2)}, {this.state.p.toFixed(2)}, {this.state.t}, {this.state.pointer_state.length}</span>
        </div>)
    }
}
export default Canvas