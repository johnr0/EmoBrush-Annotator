import React from 'react'

class AnnotationInfo extends React.Component{

    render(){
        return (<div className='AnnotationInfo_div'>
            <div>
            <h3>Express an emotion by "touching" the screen.</h3>
            <p>You will given an emotion to express.</p>
            <p>Use the Apple Pencil to express you emotion on the canvas.</p>
            <p>Imagine that the canvas surface is the "skin" of a person.</p>
            <p>For example, to express your anger, you might strongly scratch a person's skin. Express your emotion in such a way, where the Apple Pencil serves the role of being "your finger tip."</p>
            <h3>Now, express the emotion, <span>"Anger,"</span> for 5 seconds.</h3>
            <p>You can begin by starting the stroke on the canvas.</p>
            <p>After 5 seconds, you can either choose to try the expression again (if you are not satisfied) or move forward to the next emotion (when you are satisfied).</p>
            </div>
            <div>
                
            </div>
        </div>)
    }
}export default AnnotationInfo;