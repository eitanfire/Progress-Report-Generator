export const calculateCredits = (attendance: {
  absences: number;
  lates: number;
}) => {
  if (attendance.absences > 10) return 3;
  if (attendance.absences > 5) return 3.5;
  return 4; // Max credits
};
