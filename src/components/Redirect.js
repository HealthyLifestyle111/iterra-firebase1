import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import './Redirect.css';

function Redirect() {
  const { slug } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Check if slug is 'default'
        if (slug === 'default') {
          window.location.href = 'https://www.doterra.com';
          return;
        }

        // Query Firestore for the associate with this slug
        const associatesRef = collection(db, 'associates');
        const q = query(associatesRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const associateDoc = querySnapshot.docs[0];
          const associateData = associateDoc.data();

          // Increment referral count
          await updateDoc(doc(db, 'associates', associateDoc.id), {
            referrals: increment(1)
          });

          // Redirect to the associate's doTERRA URL
          window.location.href = associateData.doterraUrl;
        } else {
          // Fallback to doterra.com if slug not found
          setStatus('notfound');
          setTimeout(() => {
            window.location.href = 'https://www.doterra.com';
          }, 3000);
        }
      } catch (error) {
        console.error('Redirect error:', error);
        setStatus('error');
        setTimeout(() => {
          window.location.href = 'https://www.doterra.com';
        }, 3000);
      }
    };

    handleRedirect();
  }, [slug]);

  return (
    <div className="redirect">
      <div className="redirect-container">
        {status === 'loading' && (
          <>
            <div className="spinner"></div>
            <p>Redirecting to doTERRA...</p>
          </>
        )}
        {status === 'notfound' && (
          <>
            <p>Associate not found. Redirecting to doTERRA main site...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p>An error occurred. Redirecting to doTERRA main site...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Redirect;
