import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
import { URL, URLSearchParams } from 'url';

class ClassroomForm extends Component {
  constructor() {
  	super();
  	  this.state = {
        name: '',
        filterName: '',
        classroomGrade: 9,
        grade: [9, 10, 11, 12],
        users: [],
        displayUsers: []
  	  }
    this.handleChange = this.handleChange.bind(this);
  }
  
  componentDidMount() {
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
    if (this.state.users) {
     console.log('gandalf')
    }
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

  render() {
  	return (
  	  <div> 
  	    <h1>Create Classroom</h1>
  	    <form>
          <div className="user-input">
    	      <label>Name</label>
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
                {!this.state.grade && <option>Select Grade</option>}
                {this.state.grade && <option value={[9, 10, 11, 12]}>All Grades</option>}
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12</option>
              </select>
              <span style={{display: 'inline'}}>Filter By Name: </span>
              <input name="filterName" onBlur={this.handleChange} />
            </div>
            {this.state.displayUsers.map(function(user) {
              return <div className="user-section">
                       <span>Name: {user.name}</span>
                       <span>Grade: {user.grade}</span>
                     </div>
            })}
          </div>}
  	    </form>
      </div>
  	)
  }
}

export default ClassroomForm;