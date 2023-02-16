# EmoBrush

This is a repository for EmoBrush, which allows you to steer the behavior of generation models with *emotional haptic interactions*.
EmoBrush is an application which contains a connected flask backend to a react frontend.
We recommend running the application on Ipad+Apple Pencil.

## Backend
Step1: Activate your environment:

For mac/unix users: 

**create:** ```python3 -m venv env```

**activate:** `source env/bin/activate`

For windows users: 

**create:** `py -m venv env`

**activate:** `.\env\Scripts\activate`


Step2: Then install the requirements using:
`pip install -r requirements.txt`

Step3: Initiate the database

In the `database` folder, run `sqlite3 database.db < config.sql`

## Running the server

Return to the base directory (`cd ..`) and run: `npm install` before running the scripts below.

Then, run `python base.py` to start the flask backend server.

Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

Next, run `npm start` to start the frontend section of the application.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Annotation interface
 Go to [http://locahost:3000/annotation](http://locahost:3000/annotation). It will allow you to either 1) start a new annotation task, or 2) resume on the previous task you did. For 2), you will need to input your "annotator id."

 Once started, with the input interface that **recognizes pressures**, do the annotation task of making a haptic input that corresponds to the displayed emotion. 

 We recommend using Ipad+Apple Pencil.

## Demo interface

### Recognition

### Image generation

### Text generation



