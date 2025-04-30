import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-blue-100 to-teal-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md">
        <h2 className="text-3xl font-bold text-indigo-800 text-center mb-8">Admin Login</h2>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;