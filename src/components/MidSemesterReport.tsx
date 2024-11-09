import React, { useState, useEffect } from "react";
import gradeScaleData from "../utils/gradeScale.json";
import attendanceDataJson from "../utils/attendance.json";
import gradesDataJson from "../grades.json";
import Logo from "../assets/unnamed.jpg";
import { calculateCredits } from "../utils/creditCalculator";
import { rateAttendance, AttendanceRecord } from "../utils/attendanceRating";
import courseDescriptions from "../utils/courseDescriptions";
import { TOTAL_SESSIONS, MAX_CREDITS } from "../utils/config";
import "../Report.css";

// Interface to define the structure of attendance data
interface AttendanceData {
  courses: {
    courseName: string;
    attendanceCategories: string[];
    studentAttendance: {
      name: string;
      attendance: number[];
    }[];
  }[];
}

// Attendance data type
const attendanceData: AttendanceData = attendanceDataJson;

// Helper functions to calculate absences and lates
const getAbsences = (
  attendance: number[],
  attendanceCategories: string[]
): number => {
  const ABSENCES = attendanceCategories.indexOf("A");
  return attendance[ABSENCES] ?? 0;
};

const getLates = (
  attendance: number[],
  attendanceCategories: string[]
): number => {
  const LATES = attendanceCategories.indexOf("L");
  const LE = attendanceCategories.indexOf("LE");
  return (attendance[LATES] ?? 0) + (attendance[LE] ?? 0);
};

// Helper function to split full names into first and last names
const splitName = (fullName: string): [string, string] => {
  const parts = fullName.split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return [firstName, lastName];
};

interface Student {
  lastName: string;
  firstName: string;
  email: string;
  overallGrade: number | null;
  attendance?: AttendanceRecord;
  courseName: string;
}

interface GradeScale {
  letter: string;
  minPercentage: number;
}

const Report: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScale[]>([]);

  const totalSessions = TOTAL_SESSIONS;

  useEffect(() => {
    const studentsWithAttendance: Student[] = [];

    // Combine attendance and grades data
    attendanceData.courses.forEach((course) => {
      course.studentAttendance.forEach((attendanceStudent) => {
        const [firstName, lastName] = splitName(attendanceStudent.name);

        // Find the corresponding grade data
        const gradeInfo = getGradeInfo(course.courseName, firstName, lastName);
        const overallGrade = gradeInfo
          ? parseFloat(gradeInfo.overallGrade)
          : null;

        studentsWithAttendance.push({
          lastName,
          firstName,
          email: "unknown@example.com",
          overallGrade,
          attendance: {
            absences: getAbsences(
              attendanceStudent.attendance,
              course.attendanceCategories
            ),
            lates: getLates(
              attendanceStudent.attendance,
              course.attendanceCategories
            ),
          },
          courseName: course.courseName,
        });
      });
    });

    setStudents(studentsWithAttendance);
    setGradeScale(gradeScaleData?.gradeScale ?? []);
  }, []);

  const getGradeInfo = (
    courseName: string,
    firstName: string,
    lastName: string
  ) => {
    const gradesData = gradesDataJson.courses.find(
      (course) => course.courseName === courseName
    );
    return (
      gradesData?.students.find(
        (student) =>
          student.firstName === firstName && student.lastName === lastName
      ) || null
    );
  };

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
    return "F";
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

        const courseInfo = courseDescriptions?.[
          student.courseName.toLowerCase()
        ] || {
          name: student.courseName || "Unknown Course",
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
                      Absences: {student.attendance?.absences || 0}
                      <br />
                      Lates: {student.attendance?.lates || 0}
                    </>
                  ) : (
                    <span>No attendance data available</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>GRADE IN PROGRESS:</strong>{" "}
                  {student.overallGrade !== null
                    ? getLetterGrade(student.overallGrade) +
                      ` (${formatGrade(student.overallGrade)})`
                    : "N/A"}
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
