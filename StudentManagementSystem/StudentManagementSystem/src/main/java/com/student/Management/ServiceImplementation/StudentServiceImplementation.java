package com.student.Management.ServiceImplementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.student.Management.DataAccessObjectImplementation.StudentDataAccessObjectImplementation;
import com.student.Management.Service.StudentService;
import com.student.Management.model.Student;



@Component
public class StudentServiceImplementation implements StudentService{
	
	@Autowired
	
	StudentDataAccessObjectImplementation student;
	
	@Override
	public List<Student> getallDatas() {
		List<Student> newStudent = student.getallDatas();
		return newStudent;
	}

	@Override
	public Student getDatabyID(int id) {
		return null;
	}

	@Override
	public String insertData(Student student) {
		return null;
	}

}


