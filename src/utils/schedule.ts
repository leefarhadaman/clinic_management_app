import { Doctor } from '../types/doctor';

export interface Schedule {
  doctorId: string;
  date: string;
  slots: string[];
}

export const getDoctorSchedules = (): Schedule[] => {
  const saved = localStorage.getItem('schedules');
  return saved
    ? JSON.parse(saved)
    : [
        {
          doctorId: '1',
          date: '2025-05-01',
          slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'],
        },
        {
          doctorId: '1',
          date: '2025-05-02',
          slots: ['09:00', '09:30', '10:00', '10:30', '11:00'],
        },
        {
          doctorId: '2',
          date: '2025-05-01',
          slots: ['10:00', '10:30', '11:00', '11:30', '15:00', '15:30'],
        },
        {
          doctorId: '2',
          date: '2025-05-02',
          slots: ['10:00', '10:30', '11:00', '11:30'],
        },
      ];
};

export const saveDoctorSchedules = (schedules: Schedule[]) => {
  localStorage.setItem('schedules', JSON.stringify(schedules));
};

export const getAvailableSlots = (doctorId: string, date: string, appointments: any[]): string[] => {
  const schedules = getDoctorSchedules();
  const schedule = schedules.find((s) => s.doctorId === doctorId && s.date === date);
  if (!schedule) return [];
  const bookedSlots = appointments
    .filter((a) => a.doctorId === doctorId && a.date === date && !a.isEmergency)
    .map((a) => a.time);
  return schedule.slots.filter((slot) => !bookedSlots.includes(slot));
};