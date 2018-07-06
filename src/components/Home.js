import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import ClassroomForm from './ClassroomForm';
import { Link, Route, Switch, Button } from 'react-router-dom';
import Auth from '../modules/Auth';
import '../Home.css'

class Home extends Component {
  constructor() {
  	super();

    this.state = {
      classrooms: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:3002/api/v1/classrooms', {
      headers: {
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`
      }
    }).then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({
        classrooms: res
      });
    })
  }


  render() {
  	return (
  	  <div className="container">
  	    <h1>Homework App</h1>
  	    {this.props.auth && <Link to="/classroom"><button>New Classroom</button></Link>}
        <div className="classroom-container">
          { this.state.classrooms.map(classroom => {
            return (
             <div className="classroom">
               <h2> Grade: {classroom.grade} {classroom.name}</h2>
               <h3>Teacher: {classroom.teacher} </h3>
               <h3>Students: {classroom['student_count']}</h3>
               <button>Enter Classroom</button>
             </div>
            )
           })}
        </div>

  	  </div>
  	)
  }
}

export default Home;
