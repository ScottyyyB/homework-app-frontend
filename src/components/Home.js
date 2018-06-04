import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import ClassroomForm from './ClassroomForm';
import { Link, Route, Switch, Button } from 'react-router-dom';

class Home extends Component {
  constructor() {
  	super();
  }
  	
  
  render() {
  	return (
  	  <div>
  	    <h1>Homework App</h1>
  	     {this.props.auth && <Link to="/classroom"><button>New Classroom</button></Link>}
  	  </div>
  	)
  }
}

export default Home;
