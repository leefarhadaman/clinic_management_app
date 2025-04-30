import { BarChart, Users, Calendar, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const stats = {
    totalPatients: 150,
    appointmentsThisMonth: 45,
    activeDoctors: 8,
    totalRevenue: 12500,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.totalPatients}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Appointments (Month)</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.appointmentsThisMonth}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-teal-100 text-teal-600">
            <BarChart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Active Doctors</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.activeDoctors}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-800">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          <li className="text-sm text-gray-600">Added patient "John Doe" on 2025-04-28</li>
          <li className="text-sm text-gray-600">Booked appointment for "Jane Smith" on 2025-05-02</li>
          <li className="text-sm text-gray-600">Dr. Alice Brown updated profile on 2025-04-27</li>
          <li className="text-sm text-gray-600">Invoice #3 issued for $200 on 2025-04-29</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;