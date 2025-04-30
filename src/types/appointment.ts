export interface Appointment {
    id: string;
    patientName: string;
    doctorId: string;
    department: string;
    purpose: string;
    date: string;
    time: string;
    isEmergency: boolean;
  }