import { useState, useEffect } from 'react';
import { Plus, Calendar, Trash2, Search, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../ui/Button';
import { Appointment } from '../../types/appointment';
import { Doctor } from '../../types/doctor';
import { getDoctorSchedules, getAvailableSlots } from '../../utils/schedule';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('appointments');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            patientName: 'John Doe',
            doctorId: '1',
            department: 'Cardiology',
            purpose: 'Checkup',
            date: '2025-05-01',
            time: '10:00',
            isEmergency: false,
          },
          {
            id: '2',
            patientName: 'Jane Smith',
            doctorId: '2',
            department: 'Neurology',
            purpose: 'Consultation',
            date: '2025-05-02',
            time: '14:00',
            isEmergency: false,
          },
        ];
  });
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('doctors');
    return saved
      ? JSON.parse(saved)
      : [
          { id: '1', name: 'Dr. Alice Brown', specialty: 'Cardiology', email: 'alice@example.com', phone: '555-123-4567' },
          { id: '2', name: 'Dr. Bob White', specialty: 'Neurology', email: 'bob@example.com', phone: '555-987-6543' },
        ];
  });
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientName: '',
    doctorId: '',
    department: '',
    purpose: '',
    date: '',
    time: '',
    isEmergency: false,
  });
  const [customPurpose, setCustomPurpose] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const purposeOptions = ['Checkup', 'Consultation', 'Follow-up', 'Procedure', 'Other'];

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.doctorId || !newAppointment.date || (!newAppointment.isEmergency && !newAppointment.time)) {
      toast.error('Please fill all required fields.');
      return;
    }
    const purpose = newAppointment.purpose === 'Other' ? customPurpose : newAppointment.purpose;
    if (!purpose) {
      toast.error('Please specify a purpose.');
      return;
    }
    const newId = `${appointments.length + 1}`;
    const doctor = doctors.find((d) => d.id === newAppointment.doctorId);
    const department = doctor ? doctor.specialty : newAppointment.department;
    setAppointments([
      ...appointments,
      {
        ...newAppointment,
        id: newId,
        purpose,
        department,
        isEmergency: !!newAppointment.isEmergency,
        time: newAppointment.isEmergency ? 'Immediate' : newAppointment.time!,
      } as Appointment,
    ]);
    setNewAppointment({ patientName: '', doctorId: '', department: '', purpose: '', date: '', time: '', isEmergency: false });
    setCustomPurpose('');
    toast.success('Appointment booked successfully!');
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    toast.success('Appointment deleted successfully!');
  };

  const handleExport = () => {
    const csv = [
      'ID,Patient Name,Doctor,Department,Purpose,Date,Time,Emergency',
      ...appointments.map((a) => {
        const doctor = doctors.find((d) => d.id === a.doctorId);
        return `${a.id},"${a.patientName}","${doctor?.name || 'Unknown'}",${a.department},${a.purpose},${a.date},${a.time},${
          a.isEmergency ? 'Yes' : 'No'
        }`;
      }),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Appointments exported successfully!');
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctors
        .find((d) => d.id === a.doctorId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const availableSlots = newAppointment.doctorId && newAppointment.date && !newAppointment.isEmergency
    ? getAvailableSlots(newAppointment.doctorId, newAppointment.date, appointments)
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Appointment Scheduling</h2>
      <form onSubmit={handleAddAppointment} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            value={newAppointment.patientName}
            onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor</label>
          <select
            value={newAppointment.doctorId}
            onChange={(e) => {
              const doctor = doctors.find((d) => d.id === e.target.value);
              setNewAppointment({
                ...newAppointment,
                doctorId: e.target.value,
                department: doctor ? doctor.specialty : '',
              });
            }}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.specialty})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            value={newAppointment.department}
            readOnly
            className="mt-1 w-full rounded-lg border-gray-300 bg-gray-100 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <select
            value={newAppointment.purpose}
            onChange={(e) => setNewAppointment({ ...newAppointment, purpose: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          >
            <option value="">Select Purpose</option>
            {purposeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {newAppointment.purpose === 'Other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Custom Purpose</label>
            <input
              type="text"
              value={customPurpose}
              onChange={(e) => setCustomPurpose(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        {!newAppointment.isEmergency && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <select
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              required={!newAppointment.isEmergency}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
            >
              <option value="">Select Time</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={newAppointment.isEmergency}
            onChange={(e) =>
              setNewAppointment({ ...newAppointment, isEmergency: e.target.checked, time: e.target.checked ? 'Immediate' : '' })
            }
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded"
          />
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
            Emergency
          </label>
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Book Appointment
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Appointment List</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search appointments..."
                className="pl-9 w-64 rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
              />
            </div>
            <Button onClick={handleExport} className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAppointments.map((appointment) => {
                const doctor = doctors.find((d) => d.id === appointment.doctorId);
                return (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.purpose}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          appointment.isEmergency ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {appointment.isEmergency ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} appointments
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage((p) => (p * itemsPerPage < filteredAppointments.length ? p + 1 : p))}
              disabled={currentPage * itemsPerPage >= filteredAppointments.length}
              className="px-3 py-1"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;