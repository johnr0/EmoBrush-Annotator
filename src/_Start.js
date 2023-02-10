import React from 'react'
import axios from 'axios'

class Start extends React.Component{

    startExistingWorker(){
        var worker_id = document.getElementById('worker_id').value
        if(worker_id==''){
            alert('No worker Id is input.')
            return
        }else{
            // move on to the next task
        }
    }

    startNewWorker(){
        axios.post('http://localhost:5000/NewWorker', {}).then(function(response){
            window.location.href = window.location.origin+'/annotator?order=0&response='+response.data.worker_id
        })

    }

    render(){
        return (<div className='App'>
            <h1>Start your task by inputting the annotator id.</h1>
            <p>
                <input type='text' id='worker_id'></input>
                <input type='button' value="Start" onClick={this.startExistingWorker.bind(this)}></input>
            </p>
            <p>
                <input type='button' value="I'm new" onClick={this.startNewWorker.bind(this)}></input>
            </p>
            
        </div>)
    }
}export default Start;