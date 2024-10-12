interface AttendanceRecord {
  absences: number;
  lates: number;
}

export function calculateCredits(attendance: AttendanceRecord): number {
  const MAX_CREDITS = 4;
  const ABSENCES_PER_CREDIT_LOSS = 8;
  const LATES_PER_ABSENCE = 5;

  // Convert lates to equivalent absences
  const totalAbsences =
    attendance.absences + Math.floor(attendance.lates / LATES_PER_ABSENCE);

  // Calculate credits lost
  const creditsLost = Math.floor(totalAbsences / ABSENCES_PER_CREDIT_LOSS);

  // Calculate final credits
  const finalCredits = Math.max(MAX_CREDITS - creditsLost, 0);

  return finalCredits;
}

// Example usage:
// const attendance = { absences: 3, lates: 7 };
// const credits = calculateCredits(attendance);
// console.log(credits); // Output: 3
