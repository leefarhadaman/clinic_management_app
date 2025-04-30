import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import Button from '../ui/Button';
import { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default credentials check
    if (credentials.email === 'admin@example.com' && credentials.password === 'Admin123') {
      onLoginSuccess();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="h-5 w-5 text-indigo-600" />
          </span>
          <input
            id="email"
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            required
            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 transition duration-300 text-sm py-2"
            placeholder="admin@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="h-5 w-5 text-indigo-600" />
          </span>
          <input
            id="password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 transition duration-300 text-sm py-2"
            placeholder="********"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;