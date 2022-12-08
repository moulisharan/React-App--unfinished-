package com.student.Management.DataAccessObjectImplementation;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import com.student.Management.DataAccessObject.StudentDataAccessObject;
import com.student.Management.model.Student;


@Component
public class StudentDataAccessObjectImplementation implements StudentDataAccessObject {

	@Autowired
	JdbcTemplate template;


	@Override
	public List<Student> getallDatas() {

		List<Student> studentlist = template.query("select * from student.details",new ResultSetExtractor<List<Student>>(){

			List<Student> newstudentList = new ArrayList<>();

			@Override
			public List<Student> extractData(ResultSet rs) throws SQLException, DataAccessException {

				while(rs.next()) {

					Student student = new Student();
					student.setStudentId(rs.getInt("StudentId"));
					student.setStudent_name(rs.getString("Student_name"));
					student.setAge(rs.getInt("Age"));
					student.setCity(rs.getString("City"));
					newstudentList.add(student);
				}

				return newstudentList;
			}

		});
		
		return studentlist;
	}


	@Override
	public Student getDatabyID(int id) {
		return null;
	}

	@Override
	public String insertData(Student student) {
		// TODO Auto-generated method stub
		return null;
	}

}
