import React from 'react'
import axios from 'axios'

class Start extends React.Component{

    startExistingAnnotator(){
        var annotator_id = document.getElementById('annotator_id').value
        if(annotator_id==''){
            alert('No annotator Id is input.')
            return
        }else{
            // move on to the next task
            axios.post(window.location.protocol+'//'+window.location.hostname+':5000/ExistingAnnotator', {annotator_id:annotator_id}).then(function(response){
                if(response.data.response=='no_annotator'){
                    alert('No such a annotator exists.')
                }else if(response.data.response=='task_done'){
                    alert('All tasks seems to be done.')
                }else{
                    var order = response.data.order
                    window.location.href = window.location.origin+'/annotator?order='+order.toString()+'&annotator='+annotator_id
                }

            })
        }
    }

    startNewAnnotator(){
        axios.post(window.location.protocol+'//'+window.location.hostname+':5000/NewAnnotator', {}).then(function(response){
            window.location.href = window.location.origin+'/annotator?order=0&annotator='+response.data.annotator_id
        })

    }

    render(){
        return (<div className='App'>
            <h1>Start your task by inputting the annotator id.</h1>
            <p>
                <input type='text' id='annotator_id'></input>
                <input type='button' value="Start" onClick={this.startExistingAnnotator.bind(this)}></input>
            </p>
            <p>
                <input type='button' value="I'm new" onClick={this.startNewAnnotator.bind(this)}></input>
            </p>
            
        </div>)
    }
}export default Start;