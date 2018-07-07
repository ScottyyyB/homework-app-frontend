import React, { Component } from 'react';
import Auth from '../modules/Auth';
import { ReactDOM } from 'react-dom';
import { URL, URLSearchParams } from 'url';
import { Link, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Home from './Home';

class ClassroomForm extends Component {
  constructor() {
  	super();
  	  this.state = {
        name: '',
        filterName: '',
        classroomGrade: 9,
        grade: [9, 10, 11, 12],
        users: [],
        displayUsers: [],
        userIds: [],
        errorMessage: [],
        classroomCreated: false
      }
    this.handleChange = this.handleChange.bind(this);
    // this.handleSelectAll = this.handleSelectAll.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    console.log(this.props.teacher == null);
    fetch(`http://localhost:3002/api/v1/users?type=student`)
    .then(res => res.json())
    .then(res => {
      console.log(res);
      this.setState({
        users: res,
        displayUsers: res
      })
    }),
    (err) => console.error(err)
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });

    if (name == 'grade') {
      this.setState({
        displayUsers: this.state.users.filter(user => value.includes(user.grade))
      });
    }

    if (name == 'filterName') {
      this.setState({
        displayUsers: this.state.users.filter(user => [...value].every((c, i) => c == user.name[i]) && this.state.grade.includes(user.grade))
      });
    }
  }

  handleCheckBox(e) {
    const value = e.target.value;
    let arr = this.state.userIds;
    console.log(value);
    arr.includes(value) ? arr.splice(arr.indexOf(value), 1) : arr.push(value);
    this.setState({
      userIds: arr
    })
  }

  // handleSelectAll(e) {
  //   this.state.displayUsers.map((user) => {
  //     document.getElementById(`check${user.id}`).checked = true;
  //     this.handleCheckBox(e);
  //   });
  //   console.log(e.target.value);
  // }

  errorHandler(name) {
    if (this.state.errorMessage.length > 0) {
      const arr = this.state.errorMessage.filter(v => v.includes(name));
      return arr.map((msg, i) => <h6 key={i} className="error-msg">{msg}</h6>);
    }
  }

  handleClassRoomSubmit(e, data) {
    e.preventDefault();
    fetch('http://localhost:3002/api/v1/classrooms', {
      method: 'POST',
      body: JSON.stringify({
        classroom: data
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${Auth.getToken()}`
      }
    }).then(res => res.ok ? res : res.json())
    .then(res => {
      if (res.ok) {
        console.log('success');
        this.setState({ classroomCreated: true});
      } else {
        console.log(res.errors);
        this.setState({ errorMessage: res.errors});
      }
    })
  }

  render() {
    if (this.props.teacher == "false") {
      return <Redirect to="/" />
    }
    if (this.state.classroomCreated) {
      return <Redirect to="/" />
    }
  	return (
  	  <div>
        <li><Link to="/">Home</Link></li>
        <Route exact path="/" component={Home} />
  	    <h1>Create Classroom</h1>
  	    <form onSubmit={(e) => this.handleClassRoomSubmit(e, {name: this.state.name, grade: this.state.classroomGrade, user_ids: this.state.userIds})}>
          <div className="user-input">
    	      <label>Name</label>
            <div className="errors-section">
            {this.errorHandler('Name')}
            </div>
    	      <input onChange={this.handleChange} name="name" value={this.state.name}/>
          </div>

          <div className="user-input">
            <label>Choose Grade</label>
            <select onChange={this.handleChange} name="classroomGrade" value={this.state.classroomGrade}>
              <option value={9}>Grade 9</option>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>

          {this.state.users && <div className="user-input">
            <h4>Add Students</h4>
            <div className="user-filters user-input">
              <span style={{display: 'inline'}}>Filter By Grade: </span>
              <select onChange={this.handleChange} name="grade" value={this.state.grade}>
                <option value={[9, 10, 11, 12]}>All Grades</option>
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12</option>
              </select>
              <span style={{display: 'inline'}}>Filter By Name: </span>
              <input name="filterName" onBlur={this.handleChange} />
            </div>
            <div className="errors-section">
              {this.errorHandler('User ids')}
            </div>
            <table className="classroom-table">
              <tr>
                <th>Select {this.state.userIds.length > 0 ? this.state.userIds.length : null}</th>
                <th>Name</th>
                <th>Grade</th>
              </tr>
            {
              this.state.displayUsers.map((user) => {
               return  <tr type="checkbox">
                        <input onChange={(e) => this.handleCheckBox(e)} id={"check" + user.id} type="checkbox" value={user.id} name="userIds"/>
                        <td>{user.name}</td>
                        <td>{user.grade}</td>
                       </tr>
              })
            }
            </table>
          </div>}
          <button type="submit">Create Classroom</button>
  	    </form>
      </div>
  	)
  }
}

export default ClassroomForm;
