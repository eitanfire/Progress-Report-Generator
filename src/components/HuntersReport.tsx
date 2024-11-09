// import React, { useState, useEffect } from "react";
// import gradeScaleData from "../utils/gradeScale.json";
// import attendanceDataJson from "../utils/huntersAttendance.json";
// import Logo from "../assets/unnamed.jpg";
// import { calculateCredits } from "../utils/creditCalculator";
// import { rateAttendance, AttendanceRecord } from "../utils/attendanceRating";
// import courseDescriptions from "../utils/courseDescriptions";
// import { TOTAL_SESSIONS, MAX_CREDITS } from "../utils/config";
// import "../Report.css";

// // Interface to define the structure of attendance data
// interface AttendanceData {
//   courses: {
//     courseName: string;
//     attendanceCategories: string[];
//     studentAttendance: {
//       name: string;
//       attendance: number[];
//     }[];
//   }[];
// }

// // Import and type attendance data
// const attendanceData: AttendanceData = attendanceDataJson;

// // Helper functions to calculate absences and lates
// const getAbsences = (
//   attendance: number[],
//   attendanceCategories: string[]
// ): number => {
//   const ABSENCES = attendanceCategories.indexOf("A"); // Index for 'A' (Absences)
//   return attendance[ABSENCES] ?? 0;
// };

// const getLates = (
//   attendance: number[],
//   attendanceCategories: string[]
// ): number => {
//   const LATES = attendanceCategories.indexOf("L"); // Index for 'L' (Lates)
//   const LE = attendanceCategories.indexOf("LE"); // Index for 'LE' (Left Early)
//   return (attendance[LATES] ?? 0) + (attendance[LE] ?? 0);
// };

// interface Student {
//   lastName: string;
//   firstName: string;
//   email: string;
//   overallGrade: number | null;
//   attendance?: AttendanceRecord;
//   courseName: string;
// }

// interface GradeScale {
//   letter: string;
//   minPercentage: number;
// }

// const Report: React.FC = () => {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [gradeScale, setGradeScale] = useState<GradeScale[]>([]);

//   // Set the total number of class sessions
//   const totalSessions = TOTAL_SESSIONS;

//   useEffect(() => {
//     // Process attendance data for all courses
//     const studentsWithAttendance: Student[] = attendanceData.courses.flatMap(
//       (course) => {
//         // Process each student's attendance in a course
//         const processedAttendance = course.studentAttendance.map(
//           (student): { name: string; absences: number; lates: number } => ({
//             name: student.name || "Unknown", // Fallback if name is missing
//             absences: getAbsences(
//               student.attendance,
//               course.attendanceCategories
//             ),
//             lates: getLates(student.attendance, course.attendanceCategories),
//           })
//         );

//         // Map student records to the `Student` structure for rendering
//         return course.studentAttendance.map((student) => ({
//           lastName: "Unknown", // Default value since last name is not provided in the data
//           firstName: student.name,
//           email: "unknown@example.com", // Default value since email is not provided in the data
//           overallGrade: null, // Set to null since gradesData is not used
//           attendance: processedAttendance.find(
//             (record) => record.name === student.name
//           ),
//           courseName: course.courseName || "Unknown Course",
//         }));
//       }
//     );

//     setStudents(studentsWithAttendance);
//     setGradeScale(gradeScaleData?.gradeScale ?? []); // Use fallback if gradeScaleData is unavailable
//   }, []);

//   const formatGrade = (grade: number | null): string => {
//     if (grade === null) return "N/A";
//     return grade.toFixed(2) + "%";
//   };

//   const getLetterGrade = (grade: number | null): string => {
//     if (grade === null) return "N/A";
//     for (const { letter, minPercentage } of gradeScale) {
//       if (grade >= minPercentage) {
//         return letter;
//       }
//     }
//     return "F"; // Default to F if no other grade matches
//   };

//   const renderAttendanceRatingTable = (rating: string) => {
//     const categories = ["Excellent", "Good", "Fair", "Poor"];
//     return (
//       <table className="attendance-rating-table">
//         <thead>
//           <tr>
//             {categories.map((category) => (
//               <th key={category}>{category}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             {categories.map((category) => (
//               <td key={category}>{rating === category ? "X" : ""}</td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div className="report-container">
//       <img className="logo" src={Logo} alt="Logo" />
//       <h1 className="heading">MID-SEMESTER STUDENT EVALUATION</h1>
//       <h2 className="subheading">PROGRESS REPORT</h2>

//       {students?.map((student, index) => {
//         const credits = student.attendance
//           ? calculateCredits(student.attendance)
//           : MAX_CREDITS;

//         const attendanceRating = student.attendance
//           ? rateAttendance(student.attendance, totalSessions)
//           : "No attendance data";

//         const courseInfo = courseDescriptions?.[
//           student.courseName.toLowerCase()
//         ] || {
//           name: student.courseName || "Unknown Course",
//           emoji: "📚",
//           description: "No description available for this course.",
//         };

//         return (
//           <table key={index} className="report-table">
//             <tbody>
//               <tr>
//                 <td>
//                   <strong>Student:</strong> {student.firstName}{" "}
//                   {student.lastName}
//                 </td>
//                 <td>
//                   <strong>Date:</strong> {new Date().toLocaleDateString()}
//                 </td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>Instructor:</strong> Hunter Amabile
//                 </td>
//                 <td>
//                   <strong>Semester:</strong> 1
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>
//                   <strong>
//                     COURSE: {courseInfo.name} {courseInfo.emoji}
//                   </strong>
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>
//                   <em>{courseInfo.description}</em>
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>
//                   <strong>ATTENDANCE:</strong>
//                   {renderAttendanceRatingTable(attendanceRating)}
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>
//                   {student.attendance ? (
//                     <>
//                       Absences: {student.attendance.absences}
//                       <br />
//                       Lates: {student.attendance.lates}
//                     </>
//                   ) : (
//                     <span>No attendance data available</span>
//                   )}
//                 </td>
//               </tr>
//               <tr>
//                 <td>
//                   <strong>GRADE IN PROGRESS:</strong>{" "}
//                   {student.overallGrade !== null
//                     ? getLetterGrade(student.overallGrade) +
//                       ` (${formatGrade(student.overallGrade)})`
//                     : "N/A"}
//                 </td>
//                 <td>
//                   <strong>CREDITS POSSIBLE:</strong> {credits}
//                   {credits < 4 && (
//                     <div className="text-danger">
//                       Lost credit due to attendance.
//                     </div>
//                   )}
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>
//                   <strong>COMMENTS:</strong>
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2} style={{ height: "100px" }}></td>
//               </tr>
//             </tbody>
//           </table>
//         );
//       })}
//     </div>
//   );
// };

// export default Report;
