export const LeaveType = {
  Annual: 1,
  Sick: 2,
  Excuse: 3,
  Unpaid: 4
} as const;

export type LeaveType = typeof LeaveType[keyof typeof LeaveType];