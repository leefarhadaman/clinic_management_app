import { useState, useEffect } from 'react';
import { Plus, Stethoscope, Trash2, Search, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../ui/Button';
import { Doctor } from '../../types/doctor';

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('doctors');
    return saved
      ? JSON.parse(saved)
      : [
          { id: '1', name: 'Dr. Alice Brown', specialty: 'Cardiology', email: 'alice@example.com', phone: '555-123-4567' },
          { id: '2', name: 'Dr. Bob White', specialty: 'Neurology', email: 'bob@example.com', phone: '555-987-6543' },
        ];
  });
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialty: '',
    email: '',
    phone: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem('doctors', JSON.stringify(doctors));
  }, [doctors]);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${doctors.length + 1}`;
    setDoctors([...doctors, { ...newDoctor, id: newId }]);
    setNewDoctor({ name: '', specialty: '', email: '', phone: '' });
    toast.success('Doctor added successfully!');
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter((d) => d.id !== id));
    toast.success('Doctor deleted successfully!');
  };

  const handleExport = () => {
    const csv = [
      'ID,Name,Specialty,Email,Phone',
      ...doctors.map((d) => `${d.id},"${d.name}",${d.specialty},${d.email},${d.phone}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doctors.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Doctors exported successfully!');
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Doctor Management</h2>
      <form onSubmit={handleAddDoctor} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={newDoctor.name}
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialty</label>
          <input
            type="text"
            value={newDoctor.specialty}
            onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={newDoctor.email}
            onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={newDoctor.phone}
            onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Add Doctor
          </Button>
        </div>
      </form>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Doctor List</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDoctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
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
              onClick={() => setCurrentPage((p) => (p * itemsPerPage < filteredDoctors.length ? p + 1 : p))}
              disabled={currentPage * itemsPerPage >= filteredDoctors.length}
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

export default DoctorList;