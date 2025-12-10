const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Cloud Function to handle /go/:slug redirects
exports.redirectToAssociate = functions.https.onRequest(async (req, res) => {
  const slug = req.path.split('/').pop();

  try {
    // Default redirect
    if (slug === 'default' || !slug) {
      res.redirect(302, 'https://www.doterra.com');
      return;
    }

    // Query Firestore for associate with this slug
    const db = admin.firestore();
    const associatesRef = db.collection('associates');
    const snapshot = await associatesRef.where('slug', '==', slug).get();

    if (snapshot.empty) {
      // Fallback to doterra.com if slug not found
      res.redirect(302, 'https://www.doterra.com');
      return;
    }

    const associateDoc = snapshot.docs[0];
    const associateData = associateDoc.data();

    // Increment referral count
    await associateDoc.ref.update({
      referrals: admin.firestore.FieldValue.increment(1)
    });

    // Redirect to associate's doTERRA URL
    res.redirect(302, associateData.doterraUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.redirect(302, 'https://www.doterra.com');
  }
});
