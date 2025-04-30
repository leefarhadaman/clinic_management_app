import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, Stethoscope, BarChart, User, DollarSign, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-800">Clinic Management</h2>
        <button className="md:hidden text-gray-600" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {[
            { to: '', label: 'Dashboard', icon: Home },
            { to: 'patients', label: 'Patients', icon: Users },
            { to: 'appointments', label: 'Appointments', icon: Calendar },
            { to: 'doctors', label: 'Doctors', icon: Stethoscope },
            { to: 'billing', label: 'Billing', icon: DollarSign },
            { to: 'reports', label: 'Reports', icon: BarChart },
            { to: 'profile', label: 'Profile', icon: User },
          ].map((item) => (
            <li key={item.label}>
              <NavLink
                to={`/dashboard/${item.to}`}
                end={item.to === ''}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;