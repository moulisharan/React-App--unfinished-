package com.student.Management.DataAccessObject;

import java.util.List;

import com.student.Management.model.Student;

public interface StudentDataAccessObject {

	public abstract List<Student> getallDatas(); //// get all student records

	public abstract Student getDatabyID(int id);  ///// get the record of a student using ID

	public abstract String insertData(Student student);  //// insert data into student table

}
