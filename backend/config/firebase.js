const admin = require('firebase-admin');
const serviceAccount = require('../ServiceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

module.exports = admin; 