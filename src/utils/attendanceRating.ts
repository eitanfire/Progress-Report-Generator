export interface AttendanceRecord {
  absences: number;
  lates: number;
}

// Define percentage thresholds for each rating
const attendanceThresholds = {
  excellent: { absences: 0.2, lates: 0.35 }, // less than 20% absences, less than 35% lates
  good: { absences: 0.4, lates: 0.7 }, // less than 40% absences, less than 70% lates
  fair: { absences: 0.6, lates: 1 }, // less than 60% absences, less than 100% lates
};

// Function to calculate rating based on the number of sessions
export const rateAttendance = (
  attendance: AttendanceRecord,
  totalSessions: number
): string => {
  const absencePercentage = attendance.absences / totalSessions;
  const latesPercentage = attendance.lates / totalSessions;

  if (
    absencePercentage < attendanceThresholds.excellent.absences &&
    latesPercentage < attendanceThresholds.excellent.lates
  )
    return "Excellent";

  if (
    absencePercentage < attendanceThresholds.good.absences &&
    latesPercentage < attendanceThresholds.good.lates
  )
    return "Good";

  if (
    absencePercentage < attendanceThresholds.fair.absences &&
    latesPercentage < attendanceThresholds.fair.lates
  )
    return "Fair";

  return "Poor";
};
