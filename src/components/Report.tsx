import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "reactstrap";
import gradesData from "../grades.json";
import gradeScaleData from "../utils/gradeScale.json";

interface Student {
  lastName: string;
  firstName: string;
  email: string;
  overallGrade: number | null;
}

interface GradeScale {
  letter: string;
  minPercentage: number;
}

const Report: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([]);

  useEffect(() => {
    const processedStudents = gradesData.students.map((student) => ({
      ...student,
      overallGrade: student.overallGrade
        ? parseFloat(student.overallGrade)
        : null,
    }));
    setStudents(processedStudents);
    setGradeScale(gradeScaleData.gradeScale);
  }, []);

  const formatGrade = (grade: number | null): string => {
    if (grade === null) return "N/A";
    return grade.toFixed(2) + "%";
  };

  const getLetterGrade = (grade: number | null): string => {
    if (grade === null) return "N/A";
    for (const { letter, minPercentage } of gradeScale) {
      if (grade >= minPercentage) {
        return letter;
      }
    }
    return "F"; // Default to F if no other grade matches
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1 className="heading">MID-SEMESTER STUDENT EVALUATION</h1>
          <h2 className="subheading">PROGRESS REPORT</h2>
        </Col>
      </Row>
      {students.map((student, index) => (
        <div key={index} className="report-specifics-container mb-5">
          <Row className="mb-2">
            <Col sm="6">
              <strong>Student:</strong> {student.firstName} {student.lastName}
            </Col>
            <Col sm="6">
              <strong>Date:</strong> {new Date().toLocaleDateString()}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col sm="6">
              <strong>Instructor:</strong> Eitan Fire
            </Col>
            <Col sm="6">
              <strong>Semester:</strong> 1
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
              {formatGrade(student.overallGrade)} (
              {getLetterGrade(student.overallGrade)})
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
      ))}
    </Container>
  );
};

export default Report;
