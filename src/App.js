import React, { Component } from 'react';
import Home from './components/Home';
import ClassroomForm from './components/ClassroomForm';
import Classroom from './components/Classroom';
import NoMatch from './components/NoMatch';
import Modal from 'react-modal';
import Auth from './modules/Auth';


import { Link, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';

import './stylesheets/App.css';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


Modal.setAppElement('#root');
class App extends Component {
  constructor() {
  	super();

  	this.state = {
      email: '',
      name: '',
      password: '',
      teacher: false,
      student: true,
      grade: 9,
      auth: Auth.isUserAuthenticated(),
      typeOfModal: '',
      currentUser: Auth.getName(),
      isTeacher: Auth.getTeacher(),
      errorMessage: []
  	};

  	this.openModal = this.openModal.bind(this);
  	this.afterOpenModal = this.afterOpenModal.bind(this);
  	this.closeModal = this.closeModal.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleCheckBox(e) {
    const name = e.target.name;
    const opposite =  ['student', 'teacher'].find(item => item != name);
    const gradeVal = opposite == 'teacher' ? null : this.state.grade;

    this.setState({
      [name]: document.getElementById(`${name}Check`).checked = true,
      [opposite]: document.getElementById(`${opposite}Check`).checked = false,
    });
  }

  errorHandler(name) {
    if (this.state.errorMessage.length > 0) {
      const arr = this.state.errorMessage.filter(v => v.includes(name));
      return arr.map((msg, i) => <h6 key={i} className="error-msg">{msg}</h6>);
    }
  }

  renderModal() {
   if (this.state.typeOfModal === 'register') {
      return (
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Register Modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Sign Up</h2>
          <form onSubmit={(e) => this.handleRegisterSubmit(e, this.state)}>
            <div className="user-input">
              <label>Email</label>
              {this.errorHandler('Email')}
              <input onChange={this.handleChange} value={this.state.email} className="input" type="text" name="email"/>
            </div>
            <div className="user-input">
              <label>Name</label>
              {this.errorHandler('Name')}
              <input onChange={this.handleChange} value={this.state.name} className="input" type="text" name="name"/>
            </div>
            <div className="user-input">
              <label>Password</label>
              {this.errorHandler('Password')}
              <input onChange={this.handleChange} value={this.state.password} className="input" type="password" name="password"/>
            </div>
            <div className="user-input">
              <label>Student</label>
              <input onChange={this.handleCheckBox} type="checkbox" name="student" checked={this.state.student} id="studentCheck" /><br />
              <label>Teacher</label>
              <input onChange={this.handleCheckBox} type="checkbox" name="teacher" checked={this.state.teacher} id="teacherCheck" />
            </div>
            {this.state.student && <div className="user-input">
              <select onChange={this.handleChange} name="grade">
                <option name="grade" value={9}>Grade 9</option>
                <option name="grade" value={10}>Grade 10</option>
                <option name="grade" value={11}>Grade 11</option>
                <option name="grade" value={12}>Grade 12</option>
              </select>
            </div>}
            <div className="form-buttons">
              <button type="submit">Submit</button>
              <button onClick={this.closeModal}>Close</button>
            </div>
          </form>
        </Modal>
      )
    }
    else {
      return (
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Login Modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Login</h2>
          {this.state.errorMessage.length > 0 && <h6 className="error-msg">Error with name or password</h6>}
          <form onSubmit={(e) => this.handleLoginSubmit(e, this.state)}>
            <div className="user-input">
              <label>Name</label>
              <input onChange={this.handleChange} value={this.state.name} className="input" type="text" name="name"/>
            </div>
            <div className="user-input">
              <label>Password</label>
              <input onChange={this.handleChange} value={this.state.password} className="input" type="password" name="password"/>
            </div>
            <div className="form-buttons">
              <button type="submit">Submit</button>
              <button onClick={this.closeModal}>Close</button>
            </div>
          </form>
        </Modal>
      );
    }
  }

  openModal(name) {
    this.setState({ typeOfModal: name, modalIsOpen: true });
    this.state.errorMessage.length > 0 ? this.setState({ errorMessage: []}) : null;
  	console.log("modal open!");
  }

   afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }

  closeModal(name) {
    this.setState({ typeOfModal: name, modalIsOpen: false});
  }

  handleRegisterSubmit(e, data) {
    e.preventDefault();
    fetch('http://localhost:3002/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        user: data
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
    .then(res => {
      if (res.token) {
        console.log(res);
        Auth.authenticateUser(res.token, res.name, res.teacher);
        this.setState({
          currentUser: res.name,
          isTeacher: res.teacher,
          auth: Auth.isUserAuthenticated(res.name)
        });
        this.closeModal()
      } else {
        console.log(res.errors);
        this.setState({ errorMessage: res.errors});
      }
      }).catch(err => {
        console.log(err);
      })
  }

  handleLoginSubmit(e, data) {
    e.preventDefault();
    fetch('http://localhost:3002/api/v1/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.token) {
        console.log(res);
        Auth.authenticateUser(res.token, res.name, res.teacher);
        this.setState({
          currentUser: res.name,
          isTeacher: res.teacher,
          auth: Auth.isUserAuthenticated()
        });
        this.closeModal()
      } else {
        this.setState({errorMessage: res.errors});
        // console.log(this.state.errorMessage[0].detail);
      }
    })
  }

  handleLogout() {
    fetch('http://localhost:3002/api/v1/logout', {
      method: 'DELETE',
      headers: {
        token: Auth.getToken(),
        'Authorization': `Token ${Auth.getToken()}`,
      },
    }).then(res => {
      Auth.deauthenticateUser();
       this.setState({
        username: '',
        password: '',
        auth: Auth.isUserAuthenticated()
      });
    }).catch(err => console.log(err));
  }

  render() {
    return (

      <div className="App">
      	<nav className="navbar">
      	  <ul>
      	    <li><Link to="/">Home</Link></li>
      	    <li onClick={(e) => this.openModal('register')}>Sign Up</li>
            {!this.state.auth && <li onClick={(e) => this.openModal('login')}>Login</li>}
      	    {this.state.auth && <li onClick={this.handleLogout}>Logout</li>}
            {this.state.auth && <li>Logged in as {this.state.currentUser}</li>}
          </ul>
      	</nav>
        {this.renderModal()}
        { this.state.auth &&
          <Switch>
            <Route exact path="/" render={(props) => <Home auth={this.state.auth} teacher={this.state.isTeacher} />} />
            <Route exact path="/classroom" render={(props) => <ClassroomForm teacher={this.state.isTeacher} />} />
            <Route exact path="/classroom/:id" component={Classroom} />
            <Route component={NoMatch} />
          </Switch>
        }
      </div>
    );
  }
}

export default App;
