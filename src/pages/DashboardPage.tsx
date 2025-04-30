import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import PatientList from '../components/dashboard/PatientList';
import AppointmentList from '../components/dashboard/AppointmentList';
import DoctorList from '../components/dashboard/DoctorList';
import Billing from '../components/dashboard/Billing';
import Reports from '../components/dashboard/Reports';
import Profile from '../components/dashboard/Profile';
import { LogOut, Menu, X } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold text-indigo-800">Clinic Management</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </header>
        <main className="p-6">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="appointments" element={<AppointmentList />} />
            <Route path="doctors" element={<DoctorList />} />
            <Route path="billing" element={<Billing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;