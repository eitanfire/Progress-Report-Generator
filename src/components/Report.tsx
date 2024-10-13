import React, { useState, useEffect } from "react";
import gradesData from "../grades.json";
import gradeScaleData from "../utils/gradeScale.json";
import attendanceData from "../utils/attendance.json";
import Logo from "../assets/sept-school-logo.png";
import { calculateCredits } from "../utils/creditCalculator";
import { rateAttendance, AttendanceRecord } from "../utils/attendanceRating";
import "../Report.css";

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

const Report: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([]);

  useEffect(() => {
    // Process students and attendance data
    const processedStudents = gradesData.students.map((student) => ({
      ...student,
      overallGrade: student.overallGrade
        ? parseFloat(student.overallGrade)
        : null,
    }));

    const processedAttendance = attendanceData.studentAttendance.map(
      (student) => ({
        name: student.name,
        absences: student.attendance[6], // Assuming index 6 corresponds to 'A' (Absences)
        lates: student.attendance[3] + student.attendance[4], // Assuming indices 3 and 4 correspond to 'L' and 'LE' (Lates)
      })
    );

    // Combine attendance data with students
    const studentsWithAttendance = processedStudents.map((student) => {
      const attendanceRecord = processedAttendance.find(
        (record) =>
          record.name.toLowerCase() === student.firstName.toLowerCase()
      );
      return { ...student, attendance: attendanceRecord };
    });

    // Set the processed students and grade scale into state
    setStudents(studentsWithAttendance);
    setGradeScale(gradeScaleData.gradeScale);
  }, []); // Empty dependency array means this will run once when the component mounts

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

  const renderAttendanceRatingTable = (rating: string) => {
    const categories = ["Excellent", "Good", "Fair", "Poor"];
    return (
      <table className="attendance-rating-table">
        <thead>
          <tr>
            {categories.map((category) => (
              <th key={category}>{category}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {categories.map((category) => (
              <td key={category}>{rating === category ? "X" : ""}</td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="report-container">
      <img className="logo" src={Logo} alt="Logo" />
      <h1 className="heading">MID-SEMESTER STUDENT EVALUATION</h1>
      <h2 className="subheading">PROGRESS REPORT</h2>

      {students.map((student, index) => {
        const credits = student.attendance
          ? calculateCredits(student.attendance)
          : 4;

        const attendanceRating = student.attendance
          ? rateAttendance(student.attendance)
          : "No attendance data";

        return (
          <table key={index} className="report-table">
            <tbody>
              <tr>
                <td>
                  <strong>Student:</strong> {student.firstName}{" "}
                  {student.lastName}
                </td>
                <td>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Instructor:</strong> Eitan Fire
                </td>
                <td>
                  <strong>Semester:</strong> 1
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>ATTENDANCE:</strong>
                  {renderAttendanceRatingTable(attendanceRating)}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  {student.attendance ? (
                    <>
                      Absences: {student.attendance.absences}
                      <br />
                      Lates: {student.attendance.lates}
                    </>
                  ) : (
                    <span>No attendance data available</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>GRADE IN PROGRESS:</strong>{" "}
                  {getLetterGrade(student.overallGrade)} (
                  {formatGrade(student.overallGrade)})
                </td>
                <td>
                  <strong>CREDITS POSSIBLE:</strong> {credits}
                  {credits < 4 && (
                    <div className="text-danger">
                      Lost credit due to attendance.
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>COMMENTS:</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ height: "100px" }}></td>
              </tr>
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

export default Report;
