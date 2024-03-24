import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import Oauth from '../components/Oauth.jsx';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('general'); // Default to general user type
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields!');
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userType }), // Include userType in signup request
      });

      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/signin');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            Job
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Linker</span>
          </Link>
          <p className="text-sm mt-5">You can sign up with your email and password or with Google.</p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput type="text" placeholder="username" id="username" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput type="email" placeholder="email" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="password" id="password" onChange={handleChange} />
            </div>
            <div>
            <label htmlFor="userType" className="block font-semibold">User Type</label>
            <select id="userType" onChange={handleUserTypeChange} value={userType} className="w-full border rounded-md px-4 py-2 mt-1 focus:outline-none focus:border-purple-500">
                <option value="general">General</option>
                <option value="employer">Employer</option>
                <option value="institute">Institute</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && <Alert className=" mt-5" color="failure">{errorMessage}</Alert>}
        </div>
      </div>
    </div>
  );
}
