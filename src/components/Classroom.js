import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Auth from '../modules/Auth';
import { Redirect } from 'react-router';
import Home from './Home';

import "../stylesheets/Classroom.css";

class Classroom extends Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      classroom: {}
    }
  }

  componentWillMount() {
    fetch(`http://localhost:3002/api/v1/classrooms/${this.props.match.params.id}`, {
     headers: {
       token: Auth.getToken(),
       'Authorization': `Token ${Auth.getToken()}`
     }
    }).then(res => res.json())
    .then(res => {
      if (res.id) {
        console.log(res);
        this.setState({
         isLoaded: true,
         classroom: res
        })
      } else {
        this.setState({
          isLoaded: true
        })
      }
    })
  }

  render() {
    if (this.state.isLoaded) {
      if (!this.state.classroom.id) {
        return <Redirect to="/" />;
      }
      return (
        <div>
          <h1>Grade: {this.state.classroom.grade} {this.state.classroom.name}</h1>
          <div className="classroom-board">
            <div className="board-section">
              <h2>Homework</h2>
              <div className="board-block">
                <h3>Pending</h3>
                <img src="#" />
              </div>
              <div className="board-block">
                <h3>Completed</h3>
                <img src="#" />
              </div>
              <div className="board-block">
                <h3>Reviewed</h3>
                <img src="#" />
              </div>
            </div>
            <div className="board-section">
              <h2>Important Information</h2>
            </div>
            <div className="board-section">
              <h2>Chatroom</h2>
            </div>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }

}

export default Classroom;
