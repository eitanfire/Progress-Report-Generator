import React, { useState, useEffect } from "react";
import gradesData from "../grades.json";
import gradeScaleData from "../utils/gradeScale.json";
import attendanceData from "../utils/attendance.json";
import Logo from "../assets/unnamed.jpg";
import { calculateCredits } from "../utils/creditCalculator";
import { rateAttendance, AttendanceRecord } from "../utils/attendanceRating";
import courseDescriptions from "../utils/courseDescriptions";
import { TOTAL_SESSIONS, MAX_CREDITS } from "../utils/config";
import "../Report.css";

// Constants for attendance indices
const ABSENCES = attendanceData.attendanceCategories.indexOf("A"); // Index for 'A' (Absences)
const LATES = attendanceData.attendanceCategories.indexOf("L"); // Index for 'L' (Lates)
const LE = attendanceData.attendanceCategories.indexOf("LE"); // Index for 'LE' (Left Early)

// Helper functions to calculate absences and lates
const getAbsences = (attendance: number[]): number => {
  return attendance[ABSENCES];
};

const getLates = (attendance: number[]): number => {
  return attendance[LATES] + attendance[LE];
};

interface Student {
  lastName: string;
  firstName: string;
  email: string;
  overallGrade: number | null;
  attendance?: AttendanceRecord;
  courseName: string;
}

interface RawStudent {
  lastName: string;
  firstName: string;
  email: string;
  overallGrade: string | null;
  courseName?: string;
}

interface GradeScale {
  letter: string;
  minPercentage: number;
}

const Report: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([]);

  // Set the total number of class sessions
  const totalSessions = TOTAL_SESSIONS;

  useEffect(() => {
    // Process students and attendance data
    const processedStudents: Student[] = (
      gradesData.students as RawStudent[]
    ).map((student) => ({
      ...student,
      overallGrade: student.overallGrade
        ? parseFloat(student.overallGrade)
        : null,
      courseName:
        student.courseName || attendanceData.courseName || "Unknown Course",
    }));

    const processedAttendance = attendanceData.studentAttendance.map(
      (student) => ({
        name: student.name,
        absences: getAbsences(student.attendance),
        lates: getLates(student.attendance),
      })
    );

    const studentsWithAttendance: Student[] = processedStudents.map(
      (student) => {
        const attendanceRecord = processedAttendance.find(
          (record) =>
            record.name.toLowerCase() === student.firstName.toLowerCase()
        );
        return {
          ...student,
          attendance: attendanceRecord
            ? {
                absences: attendanceRecord.absences,
                lates: attendanceRecord.lates,
              }
            : undefined,
        };
      }
    );

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
          : MAX_CREDITS;

        const attendanceRating = student.attendance
          ? rateAttendance(student.attendance, totalSessions)
          : "No attendance data";

        const courseInfo = courseDescriptions[
          student.courseName.toLowerCase()
        ] || {
          name: student.courseName,
          emoji: "📚",
          description: "No description available for this course.",
        };

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
                  <strong>
                    COURSE: {courseInfo.name} {courseInfo.emoji}
                  </strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <em>{courseInfo.description}</em>
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
