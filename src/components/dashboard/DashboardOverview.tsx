import { Users, Calendar, Stethoscope } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const stats = [
    { label: 'Total Patients', value: '150', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Appointments Today', value: '12', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active Doctors', value: '8', icon: Stethoscope, color: 'bg-teal-100 text-teal-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <ul className="space-y-3">
          <li className="text-sm text-gray-600">New patient "John Doe" added.</li>
          <li className="text-sm text-gray-600">Appointment booked for "Jane Smith" on 2025-05-02.</li>
          <li className="text-sm text-gray-600">Dr. Alice Brown updated profile.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverview;