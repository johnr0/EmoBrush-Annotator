import React from 'react'

class AnnotationInfo extends React.Component{


    render(){
        return (<div className='AnnotationInfo_div'>
            <div>
            <p>Your id: {this.props.annotator_id}</p>
            <h3>Express an emotion by "touching" the screen.</h3>
            <p>You will given an emotion to express.</p>
            <p>Use the Apple Pencil to express you emotion on the canvas.</p>
            <p>Imagine that the canvas surface is the "skin" of a person.</p>
            <p>For example, to express your anger, you might strongly scratch a person's skin. Express your emotion in such a way, where the Apple Pencil serves the role of being "your finger tip."</p>
            <h3>Now, express the emotion, <span>"{this.props.emotion},"</span> for {this.props.task_time/1000} seconds.</h3>
            <p>You can begin by starting the stroke on the canvas.</p>
            <p>After {this.props.task_time/1000} seconds, you can either choose to try the expression again (if you are not satisfied) or move forward to the next emotion (when you are satisfied).</p>
            {!this.props.started && this.props.time==0 && <h3>Not yet started</h3>}
            {this.props.started && this.props.time<=this.props.task_time && <h3>Remaining time: {this.props.time/1000} / {this.props.task_time/1000}</h3>}
            {this.props.started && this.props.time>this.props.task_time && <h3>Task done</h3>}
            {this.props.started && this.props.time>this.props.task_time && 
                <p>
                    <input type='button' value="Next" onClick={this.props.mother.NextTask.bind(this.props.mother)}></input>
                    <input type='button' value="Redo" onClick={this.props.mother.ResetTask.bind(this.props.mother)} style={{marginLeft:'10px'}}></input>
                </p>}
            </div>
            <div>
                
            </div>
        </div>)
    }
}export default AnnotationInfo;