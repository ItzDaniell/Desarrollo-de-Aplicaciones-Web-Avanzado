let students = [
    { id: 1, name: "Ana", grade: 18 },
    { id: 2, name: "Luis", grade: 15 },
    { id: 3, name: "Pedro", grade: 20 },
    { id: 4, name: "Maria", grade: 17 }
]

function getAll() {
    return students;
}

function create(student) {
    student.id = students.length + 1;
    students.push(student);
    return student;
}

function getById(id) {
    return students.find(student => student.id === parseInt(id));
}

function update(id, updateData) {
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
        students[index] = { ...students[index], ...updateData };
        return students[index];
    }
    return null;
}

function remove(id) {
    const index = students.findIndex(student => student.id === parseInt(id));
    if (index !== -1) {
        return students.splice(index, 1)[0];
    }
    return null;
}

module.exports = { getAll, getById, create, update, remove };