import React, { Component } from 'react';

class Auth {
  static authenticateUser(token, name, teacher) {
  	sessionStorage.setItem('token', token);
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('teacher', teacher);
  }

  static getValue() {

  }

  static userMatched = (token) => {
    return fetch(`http://localhost:3002/api/v1/validate_token?token=${token}`)
    .then((res) => {
      return res
    })
    .then((data) => {
      return data;
    })
  }

  static isUserAuthenticated() {
    return sessionStorage.getItem('token') != null;
  };

  static setName(name) {
    return sessionStorage.setItem('name', name);
  }

  static getName() {
    return sessionStorage.getItem('name');
  }

  static getTeacher() {
    return sessionStorage.getItem('teacher');
  }

  static deauthenticateUser() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('teacher');
  }

  static getToken() {
  	return sessionStorage.getItem('token');
  }

  static fetchClassroom() {
    return fetch(`http://localhost:3002/api/v1/classrooms/${this.props.match.params.id}`, {
     headers: {
       token: Auth.getToken(),
       'Authorization': `Token ${Auth.getToken()}`
     }
   }).then(res => res.json())
   .then(res => {
     console.log(res);
     this.setState({
       classroom: res
     })
    })
  }
}

export default Auth;
