export interface AttendanceRecord {
  absences: number;
  lates: number;
}

export const rateAttendance = (attendance: AttendanceRecord): string => {
  if (attendance.absences < 3 && attendance.lates < 5) return "Excellent";
  if (attendance.absences < 6 && attendance.lates < 10) return "Good";
  if (attendance.absences < 9 && attendance.lates < 15) return "Fair";
  return "Poor";
};
