import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import './Associate.css';

function Associate() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doterraUrl, setDoterraUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSlug = (email) => {
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate slug from email
      const slug = generateSlug(email);

      // Save to Firestore
      await setDoc(doc(db, 'associates', user.uid), {
        email: email,
        doterraUrl: doterraUrl,
        slug: slug,
        referrals: 0,
        createdAt: new Date().toISOString()
      });

      // Show success message with link
      const goLink = `${window.location.origin}/go/${slug}`;
      setMessage(`Success! Your referral link is: ${goLink}`);
      
      // Clear form
      setEmail('');
      setPassword('');
      setDoterraUrl('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="associate">
      <div className="associate-container">
        <h1>Associate Signup</h1>
        <p className="subtitle">Join the Iterra Oils community</p>

        <form onSubmit={handleSubmit} className="associate-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
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
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="doterraUrl">doTERRA URL</label>
            <input
              type="url"
              id="doterraUrl"
              value={doterraUrl}
              onChange={(e) => setDoterraUrl(e.target.value)}
              required
              placeholder="https://www.doterra.com/..."
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.startsWith('Success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <p className="back-link">
          <a href="/">← Back to Home</a>
        </p>
      </div>
    </div>
  );
}

export default Associate;
