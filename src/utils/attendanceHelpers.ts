import attendanceData from "./attendance.json";

// Constants for attendance indices
const ABSENCES = attendanceData.attendanceCategories.indexOf("A"); // Index for 'A' (Absences)
const LATES = attendanceData.attendanceCategories.indexOf("L"); // Index for 'L' (Lates)
const LE = attendanceData.attendanceCategories.indexOf("LE"); // Index for 'LE' (Left Early)

// Helper functions to calculate absences and lates
export const getAbsences = (attendance: number[]): number => {
  return attendance[ABSENCES];
};

export const getLates = (attendance: number[]): number => {
  return attendance[LATES] + attendance[LE];
};
