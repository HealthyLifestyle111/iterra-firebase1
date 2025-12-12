import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Admin.css';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'admin@example.com';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === adminEmail) {
        setIsAuthenticated(true);
        fetchAssociates();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [adminEmail]);

  const fetchAssociates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'associates'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setAssociates(data);
    } catch (error) {
      console.error('Error fetching associates:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email === adminEmail) {
        setIsAuthenticated(true);
        await fetchAssociates();
      } else {
        setError('Unauthorized: Admin access only');
        await signOut(auth);
      }
    } catch (error) {
      setError(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin">
        <div className="admin-login-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
          <p className="back-link">
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="table-container">
          <table className="associates-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Email</th>
                <th>Referrals</th>
                <th>doTERRA URL</th>
              </tr>
            </thead>
            <tbody>
              {associates.map((associate) => (
                <tr key={associate.id}>
                  <td className="slug-cell">
                    <a href={`/go/${associate.slug}`} target="_blank" rel="noopener noreferrer">
                      {associate.slug}
                    </a>
                  </td>
                  <td>{associate.email}</td>
                  <td className="referrals-cell">{associate.referrals || 0}</td>
                  <td className="url-cell">
                    <a href={associate.doterraUrl} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {associates.length === 0 && (
            <p className="no-data">No associates found</p>
          )}
        </div>

        <p className="back-link">
          <a href="/">← Back to Home</a>
        </p>
      </div>
    </div>
  );
}

export default Admin;
