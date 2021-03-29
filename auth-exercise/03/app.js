const tableBody = document.querySelector('tbody');

document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    createStudent(formData);

    e.target.reset();
});

async function getStudents() {
    let request = await fetch('http://localhost:3030/jsonstore/collections/students');

    let response = await request.json();
    
    tableBody.innerHTML = '';

    Object.values(response).map(appendStudent);
}

async function createStudent(studentData) {
    if([...studentData.values()].map(v => v.trim()).includes('')){
        return;
    }

    let student = {
        firstName: studentData.get('firstName'),
        lastName: studentData.get('lastName'),
        facultyNumber: studentData.get('facultyNumber'),
        grade: studentData.get('grade')
    };

    let request = await fetch('http://localhost:3030/jsonstore/collections/students',{
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(student)
    });

    if(request.ok){
        getStudents();
    }else{
        alert('Error occured while adding new student');
    }
}

function appendStudent(student) {
    let row = ce('tr');
    let firstName = ce('td', student.firstName);
    let lastName = ce('td', student.lastName);
    let facultyNumber = ce('td', student.facultyNumber);
    let grade = ce('td', student.grade);

    row.appendChild(firstName)
    row.appendChild(lastName)
    row.appendChild(facultyNumber)
    row.appendChild(grade);

    tableBody.appendChild(row);
}

function ce(type, content, className) {
    let el = document.createElement(type);

    if (content) {
        el.textContent = content;
    }

    if (className) {
        el.className = className;
    }

    return el;
}

getStudents();