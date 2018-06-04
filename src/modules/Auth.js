class Auth {
  static authenticateUser(token, name, teacher) {
  	sessionStorage.setItem('token', token);
    sessionStorage.setItem('name', name);
    sessionStorage.setItem('teacher', teacher);
  }

  static isUserAuthenticated() {
  	return sessionStorage.getItem('token') != undefined;
  }

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
}

export default Auth;