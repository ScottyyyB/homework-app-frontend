import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Auth from '../modules/Auth';

class Classroom extends Component {
  constructor() {
    super();
    this.state = {

    }
  }

  componentDidMount() {
    console.log(this.props.query.classroomId);
    fetch(`http://localhost:3002/api/v1/classrooms/31`, {
      headers: {
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`
      }
    }).then(res => res.json())
    .then(res => {
      console.log(res);
    })
  }

  render() {
    return (
      <div>
        <h1>Classroom</h1>
      </div>
    )
  }

}

export default Classroom;
