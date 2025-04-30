import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../ui/Button';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.password && profile.password !== profile.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    console.log('Profile updated:', {
      name: profile.name,
      email: profile.email,
      password: profile.password || 'unchanged',
    });
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-indigo-600" />
              </span>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-indigo-600" />
              </span>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-indigo-600" />
              </span>
              <input
                type="password"
                name="password"
                value={profile.password}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
                placeholder="Leave blank to keep unchanged"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-indigo-600" />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={profile.confirmPassword}
                onChange={handleChange}
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 text-sm py-2"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;