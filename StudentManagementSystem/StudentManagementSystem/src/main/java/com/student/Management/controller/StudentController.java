package com.student.Management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.student.Management.ServiceImplementation.StudentServiceImplementation;
import com.student.Management.model.Student;




@RestController
public class StudentController {
	
	@Autowired
	StudentServiceImplementation Student;
	
	@RequestMapping(value="/getallstudentdata",method = RequestMethod.GET )
	
	public List<Student> getallDatas(){
		
		List<Student> studentdata = Student.getallDatas();
		return studentdata;
	}

}
