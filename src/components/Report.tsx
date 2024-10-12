import React, { useState, useEffect } from "react";
import { Col, Row, Container } from "reactstrap";
import gradesData from "../grades.json";
import gradeScaleData from "../utils/gradeScale.json";
import attendanceData from "../utils/attendance.json";
import Logo from "../assets/sept-school-logo.png";
import { calculateCredits } from "../utils/creditCalculator"; // Import your utility

interface Student {
  lastName: string;
  firstName: string;
  email: string;
  overallGrade: number | null;
  attendance?: AttendanceRecord;
}

interface GradeScale {
  letter: string;
  minPercentage: number;
}

interface AttendanceRecord {
  name: string;
  absences: number;
  lates: number;
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

    const processedAttendance = attendanceData.studentAttendance.map(
      (student) => ({
        name: student.name,
        absences: student.attendance[6], // Index 6 corresponds to 'A' (Absences)
        lates: student.attendance[3] + student.attendance[4], // Indices 3 and 4 correspond to 'L' and 'LE' (Lates)
      })
    );

    // Merge attendance data with student data
    const studentsWithAttendance = processedStudents.map((student) => {
      const attendanceRecord = processedAttendance.find(
        (record) =>
          record.name.toLowerCase() === student.firstName.toLowerCase()
      );
      return { ...student, attendance: attendanceRecord };
    });

    setStudents(studentsWithAttendance);
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
      <img className="logo" src={Logo} alt="Logo" />
      <Row className="mb-3">
        <Col>
          <h1 className="heading">MID-SEMESTER STUDENT EVALUATION</h1>
          <h2 className="subheading">PROGRESS REPORT</h2>
        </Col>
      </Row>
      {students.map((student, index) => {
        // Calculate the student's credits based on their attendance
        const credits = student.attendance
          ? calculateCredits(student.attendance)
          : 4; // Default to 4 if no attendance record is available

        return (
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
                {student.attendance ? (
                  <>
                    <br />
                    Absences: {student.attendance.absences}
                    <br />
                    Lates: {student.attendance.lates}
                  </>
                ) : (
                  <span> No attendance data available</span>
                )}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm="6">
                <strong>GRADE IN PROGRESS:</strong>{" "}
                {getLetterGrade(student.overallGrade)}(
                {formatGrade(student.overallGrade)})
              </Col>
              <Col sm="6">
                <strong>CREDITS POSSIBLE:</strong>
                <br />
                {credits}
                {credits < 4 && (
                  <div className="text-danger">
                    Lost credit due to attendance.
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <strong>COMMENTS:</strong>
              </Col>
            </Row>
          </div>
        );
      })}
    </Container>
  );
};

export default Report;
