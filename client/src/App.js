import React from 'react';
import './App.css';

const baseURL = 'http://localhost:9000';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            studentForm: {
                name: '',
                branch: '',
                samester: '',
                subject: ''
            }
        };

        this.getData = this.getData.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.submitStudentForm = this.submitStudentForm.bind(this);
    }

    componentWillMount() {
        this.getData();
    }

    getData() {
        fetch(`${baseURL}/college/`)
            .then(res => res.text())
            .then(res => {
                this.setState({ data: JSON.parse(res) });
            });
    }

    handleFormChange(event) {
        const { studentForm } = this.state;
        studentForm[event.target.name] = event.target.value;

        this.setState({ studentForm });
    }

    submitStudentForm() {
        let { studentForm, data } = this.state;

        fetch(`${baseURL}/college/addStudent`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentForm)
            })
            .then(res => res.text())
            .then(res => {
                console.log(res);
                const result = JSON.parse(res);
                if(result.success) {
                    data.studentList = result.studentList;
                    studentForm = {
                        name: '',
                        branch: '',
                        samester: '',
                        subject: ''
                    };
                    this.setState({ data, studentForm });
                }
            });
    }

    render () {
        const { studentForm, data: { studentList = [], branches = [], semesters = [], subjects = []} } = this.state;
        return (
            <div className="container">
                <div className="student-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Branch</th>
                                <th>Semester</th>
                                <th>Subject</th>
                                <th>Professor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentList.map((student, id) => (
                                    <tr key={id}>
                                        <td>{student.name}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.semester}</td>
                                        <td>{student.subject}</td>
                                        <td>{student.professor}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="add-student">
                    <b>Add Student</b>
                    <div>
                        <form>
                            <label>
                                Name: 
                                <input type="text" name="name" value={studentForm.name} onChange={this.handleFormChange} />
                            </label>
                            <label>
                                Branch: 
                                <select name="branch" value={studentForm.branch} onChange={this.handleFormChange}>
                                    <option value="">Select</option>
                                    {
                                        branches.map((branch) => (
                                            <option value={branch.id}>{branch.name}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label>
                                Semester: 
                                <select name="semester" value={studentForm.semester} onChange={this.handleFormChange}>
                                    <option value="">Select</option>
                                    {
                                        semesters.map((semester) => (
                                            <option value={semester.id}>{semester.name}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <label>
                                Subject: 
                                <select name="subject" value={studentForm.subject} onChange={this.handleFormChange}>
                                    <option value="">Select</option>
                                    {
                                        subjects.filter(subject => subject.semester_id == studentForm.semester).map((subject) => (
                                            <option value={subject.id}>{subject.name}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <input type="button" value="Add" onClick={this.submitStudentForm} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
