import React, { Component } from 'react';
import Home from './components/Home';
import Modal from 'react-modal';
import Auth from './modules/Auth';

import { Link, Route, Switch } from 'react-router-dom';

import './App.css';

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
      username: '',
      password: '',
      password_confirmation: '',
      auth: Auth.isUserAuthenticated(),
      typeOfModal: ''
  	};

  	this.openModal = this.openModal.bind(this);
  	this.afterOpenModal = this.afterOpenModal.bind(this);
  	this.closeModal = this.closeModal.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
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
              <input onChange={this.handleChange} className="input" type="text" name="email"/>
            </div>
            <div className="user-input">
              <label>Username</label>
              <input onChange={this.handleChange} className="input" type="text" name="username"/>
            </div>
            <div className="user-input">
              <label>Password</label>
              <input onChange={this.handleChange} className="input" type="text" name="password"/>
            </div>
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

          <form onSubmit={(e) => this.handleLoginSubmit(e, this.state)}>
            <div className="user-input">
              <label>Email</label>
              <input onChange={this.handleChange} className="input" type="text" name="email"/>
            </div>
            <div className="user-input">
              <label>Username</label>
              <input onChange={this.handleChange} className="input" type="text" name="username"/>
            </div>
            <div className="user-input">
              <label>Password</label>
              <input onChange={this.handleChange} className="input" type="text" name="password"/>
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

  openModal(popup) {
    this.setState({ typeOfModal: popup, modalIsOpen: true })
  	console.log("modal open!");
  }

   afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleRegisterSubmit(e, data) {
    e.preventDefault();
    fetch('http://localhost:3002/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({
        user: data,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
    .then(res => {
        console.log(res);
        Auth.authenticateToken(res.token);
        this.setState({
          auth: Auth.isUserAuthenticated(),
        })
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
    }).then(res => res.json())
    .then(res => {
      console.log(res);
      Auth.authenticateToken(res.token);
      this.setState({
        auth: Auth.isUserAuthenticated()
      })
    }).catch(err => console.log(err));
  }

  render() {
    return (
      
      <div className="App">
      	<nav className="navbar">
      	  <ul>
      	    <li><Link to="/">Home</Link></li>
      	    <li onClick={(e) => this.openModal('register')}>Sign Up</li>
            <li onClick={(e) => this.openModal('login')}>Login</li>
            <li>Logout</li>
      	  </ul>
      	</nav>
        {this.renderModal()}    
      	<Route path="/" component={Home} /> 
       
      </div>
    );
  }
}

export default App;
