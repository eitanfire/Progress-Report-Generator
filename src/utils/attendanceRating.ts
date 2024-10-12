export interface AttendanceRecord {
  absences: number;
  lates: number;
}

export function rateAttendance(attendance: AttendanceRecord): string {
  const totalSessions = 14; // The total number of class sessions
  const { absences, lates } = attendance;

  // Combine absences and lates (each 5 lates equals 1 absence equivalent)
  const lateEquivalents = Math.floor(lates / 5);
  const totalAbsenceImpact = absences + lateEquivalents;

  // Define the rating thresholds
  if (totalAbsenceImpact <= 1) {
    return "Excellent";
  } else if (totalAbsenceImpact <= 3) {
    return "Good";
  } else if (totalAbsenceImpact <= 6) {
    return "Fair";
  } else {
    return "Poor";
  }
}
