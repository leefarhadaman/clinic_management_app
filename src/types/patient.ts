export interface Patient {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    aadhaar?: string;
    pan?: string;
    guardianName?: string;
    guardianPhone?: string;
    status: 'Pending' | 'Completed';
  }