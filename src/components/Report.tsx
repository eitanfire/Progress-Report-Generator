import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "reactstrap";
import gradesData from '../grades.json';

interface Student {
  lastName: string;
  firstName: string;
  email: string;
  overallGrade: string | null;
}

const Report: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  useEffect(() => {
    setStudents(gradesData.students);
    if (gradesData.students.length > 0) {
      setCurrentStudent(gradesData.students[0]);
    }
  }, []);

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1 className="heading">MID-SEMESTER STUDENT EVALUATION</h1>
          <h2 className="subheading">PROGRESS REPORT</h2>
        </Col>
      </Row>
      <div className="report-specifics-container">
        <Row className="mb-2">
          <Col sm="6">
            <strong>Student:</strong>{" "}
            {currentStudent
              ? `${currentStudent.firstName} ${currentStudent.lastName}`
              : ""}
          </Col>
          <Col sm="6">
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm="6">
            <strong>Instructor: Eitan Fire</strong>
          </Col>
          <Col sm="6">
            <strong>Semester: 1</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <strong>COURSE and DESCRIPTION:</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>{/* {course.description} */}</Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <strong>ATTENDANCE:</strong>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm="6">
            <strong>GRADE IN PROGRESS:</strong>{" "}
            {currentStudent ? currentStudent.overallGrade : ""}
          </Col>
          <Col sm="6">
            <strong>CREDITS POSSIBLE:</strong>
            <br />
            (please note if reduced due to attendance, etc.)
          </Col>
        </Row>
        <Row>
          <Col>
            <strong>COMMENTS:</strong>
          </Col>
        </Row>
      </div>
      <Row className="mt-4">
        <Col>
          <h3>All Students:</h3>
          <ul>
            {students.map((student, index) => (
              <li
                key={index}
                onClick={() => setCurrentStudent(student)}
                style={{ cursor: "pointer" }}
              >
                {student.firstName} {student.lastName} -{" "}
                {student.overallGrade || "N/A"}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
