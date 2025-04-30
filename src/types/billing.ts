export interface Invoice {
    id: string;
    patientName: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending' | 'Overdue';
  }