import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Alert } from '../components/common/CommonComponents';
import { validateEmail, validateMatricNo, validatePassword } from '../utils/validators';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    matricNo: '',
    fullName: '',
    email: '',
    phone: '',
    departmentName: 'Computer Science',
    faculty: 'Natural & Applied Sciences',
    degree: 'B.Sc. (Hons) Computer Science',
    graduationYear: '2023/2024',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerStudent } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateMatricNo(formData.matricNo)) {
      setError('Please provide a valid matriculation number (e.g. FCP/CSC/19/2045).');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please provide a valid institutional or personal email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const studentData = {
        matricNo: formData.matricNo.trim().toUpperCase(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        departmentName: formData.departmentName,
        faculty: formData.faculty,
        degree: formData.degree,
        graduationYear: formData.graduationYear,
        password: formData.password
      };

      registerStudent(studentData);
      showToast('Registration successful! You are now logged in.', 'success');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-logo">📝</div>
          <h1 className="auth-title">Graduate Registration</h1>
          <p className="auth-subtitle">Create your student clearance profile</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Matriculation No.</label>
              <input
                type="text"
                name="matricNo"
                value={formData.matricNo}
                onChange={handleChange}
                placeholder="e.g. FCP/CSC/19/2045"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Full Name (Surname First)</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Okeke Chukwuebuka David"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@university.edu.ng"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="08012345678"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Academic Department</label>
              <select name="departmentName" value={formData.departmentName} onChange={handleChange}>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Economics">Economics</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Faculty</label>
              <select name="faculty" value={formData.faculty} onChange={handleChange}>
                <option value="Natural & Applied Sciences">Natural & Applied Sciences</option>
                <option value="Engineering & Technology">Engineering & Technology</option>
                <option value="Social & Management Sciences">Social & Management Sciences</option>
                <option value="Arts & Humanities">Arts & Humanities</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Degree Awarded</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. B.Sc. (Hons) Computer Science"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Graduating Session</label>
              <select name="graduationYear" value={formData.graduationYear} onChange={handleChange}>
                <option value="2023/2024">2023/2024</option>
                <option value="2022/2023">2022/2023</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1rem', padding: '0.75rem' }}
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
