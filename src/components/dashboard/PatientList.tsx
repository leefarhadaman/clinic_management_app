import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../ui/Button';
import { Patient } from '../../types/patient';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('patients');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            dateOfBirth: '1990-01-01',
            status: 'Pending',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '098-765-4321',
            dateOfBirth: '1985-05-15',
            status: 'Completed',
            aadhaar: '1234-5678-9012',
            pan: 'ABCDE1234F',
            guardianName: 'Mary Smith',
            guardianPhone: '555-555-5555',
          },
        ];
  });
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id' | 'status'>>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `${patients.length + 1}`;
    setPatients([...patients, { ...newPatient, id: newId, status: 'Pending' }]);
    setNewPatient({ name: '', email: '', phone: '', dateOfBirth: '' });
    toast.success('Patient registered successfully (Pending)!');
  };

  const handleEditPatient = (patient: Patient) => {
    setEditPatient(patient);
  };

  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPatient) return;
    setPatients(
      patients.map((p) =>
        p.id === editPatient.id
          ? { ...editPatient, status: editPatient.aadhaar && editPatient.pan ? 'Completed' : 'Pending' }
          : p
      )
    );
    setEditPatient(null);
    toast.success('Patient details updated successfully!');
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id));
    toast.success('Patient deleted successfully!');
  };

  const handleExport = () => {
    const csv = [
      'ID,Name,Email,Phone,Date of Birth,Aadhaar,PAN,Guardian Name,Guardian Phone,Status',
      ...patients.map((p) =>
        `${p.id},"${p.name}",${p.email},${p.phone},${p.dateOfBirth},${p.aadhaar || ''},${p.pan || ''},${
          p.guardianName || ''
        },${p.guardianPhone || ''},${p.status}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Patients exported successfully!');
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Patient Management</h2>
      <form onSubmit={handleAddPatient} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={newPatient.phone}
            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={newPatient.dateOfBirth}
            onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
            required
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Register Patient
          </Button>
        </div>
      </form>
      {editPatient && (
        <form
          onSubmit={handleUpdatePatient}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="sm:col-span-2 text-lg font-semibold text-gray-800">Complete Registration</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
            <input
              type="text"
              value={editPatient.aadhaar || ''}
              onChange={(e) => setEditPatient({ ...editPatient, aadhaar: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
            <input
              type="text"
              value={editPatient.pan || ''}
              onChange={(e) => setEditPatient({ ...editPatient, pan: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
            <input
              type="text"
              value={editPatient.guardianName || ''}
              onChange={(e) => setEditPatient({ ...editPatient, guardianName: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
            <input
              type="tel"
              value={editPatient.guardianPhone || ''}
              onChange={(e) => setEditPatient({ ...editPatient, guardianPhone: e.target.value })}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
            />
          </div>
          <div className="sm:col-span-2 flex space-x-2">
            <Button type="submit" className="w-full sm:w-auto">
              Save Details
            </Button>
            <Button
              type="button"
              onClick={() => setEditPatient(null)}
              className="w-full sm:w-auto bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Patient List</h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients..."
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
                {['name', 'email', 'phone', 'dateOfBirth', 'status'].map((field) => (
                  <th
                    key={field}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.dateOfBirth}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        patient.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
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
            {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
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
              onClick={() => setCurrentPage((p) => (p * itemsPerPage < filteredPatients.length ? p + 1 : p))}
              disabled={currentPage * itemsPerPage >= filteredPatients.length}
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

export default PatientList;