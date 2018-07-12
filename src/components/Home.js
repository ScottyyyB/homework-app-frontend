import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import ClassroomForm from './ClassroomForm';
import Classroom from './Classroom';
import { Link, Route, Switch, Button } from 'react-router-dom';
import Auth from '../modules/Auth';
import '../stylesheets/Home.css'

class Home extends Component {
  constructor() {
  	super();

    this.state = {
      classrooms: [],
      classroomId: null,
    }

    this.handleChange = this.handleChange.bind(this);
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

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    })
  }


  render() {
  	return (
  	  <div className="container">
  	    <h1>Homework App</h1>
  	    <Link to="/classroom"><button>New Classroom</button></Link>
        <div className="classroom-container">
          { this.state.classrooms.map(classroom => {
            return (
             <div className="classroom" id="classroom">
               <h2> Grade: {classroom.grade} {classroom.name}</h2>
               <h3>Teacher: {classroom.teacher} </h3>
               <h3>Students: {classroom['student_count']}</h3>
               <Link to={`/classroom/${classroom.id}`}><button onClick={this.handleChange} name="classroomId" value={classroom.id}>Enter Classroom</button></Link>
             </div>
            )
           })}
        </div>
  	  </div>
  	)
  }
}

export default Home;
