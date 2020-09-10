var express = require('express');
var router = express.Router();
var connection = require('../connection.js');

router.get('/', async function(req, res, next) {
	const getStudentsQuery = `select st.name, br.name as branch, sem.name as semester, sub.name as subject, pro.name as professor 
		from students as st 
		left join branch as br on br.id = st.branch_id 
		left join semester as sem on st.semester_id = sem.id 
		left join subjects as sub on st.sub_id = sub.id 
		left join professor as pro on st.branch_id = pro.branch_id and st.sub_id = pro.sub_id;`;

	const getBranchQuery = `select * from branch`;

	const getSemesterQuery = `select * from semester`;

	const getSubjectQuery = `select * from subjects`;


    const [studentList, branches, semesters, subjects ] = await Promise.all([
    	executeQuery(getStudentsQuery),
    	executeQuery(getBranchQuery),
    	executeQuery(getSemesterQuery),
    	executeQuery(getSubjectQuery),
	]);

	const data = { studentList, branches, semesters, subjects };

    res.send(data);
});

router.post('/addStudent', async function(req, res, next) {
	const { body } = req;

	if(!body.name || !body.branch || !body.semester || !body.subject) {
		const data = { success: false, message: 'Set student data' };
		res.send(data);
	}

	const addStudentQuery = "INSERT INTO students (`name`, `branch_id`, `semester_id`, `sub_id`) VALUES ( '" + body.name + "', '" + body.branch + "', '" + body.semester + "', '" + body.subject + "');";
	console.log(addStudentQuery);

	await executeQuery(addStudentQuery);

	const getStudentsQuery = `select st.name, br.name as branch, sem.name as semester, sub.name as subject, pro.name as professor 
		from students as st 
		left join branch as br on br.id = st.branch_id 
		left join semester as sem on st.semester_id = sem.id 
		left join subjects as sub on st.sub_id = sub.id 
		left join professor as pro on st.branch_id = pro.branch_id and st.sub_id = pro.sub_id;`;

	const studentList = await executeQuery(getStudentsQuery);

	const data = { success: true, message: '', studentList }

	res.send(data);
});

function executeQuery(query) {
	return new Promise((resolve, reject) => {
		connection.query(query, (error, results) => {
			if(error)
                return reject(error);

            resolve(results);
		});
    });

}

module.exports = router;
