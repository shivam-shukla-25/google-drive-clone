// // Save as getToken.js
// const firebase = require('firebase/app');
// require('firebase/auth');

// // Replace with your Firebase config
// const firebaseConfig = {
//   apiKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCTV1jU/ps1UM3O\n6qwUtIc+xFXEFXvsA14OgVJ4saW1kPnNBipZ9KruFslYzP3AApGxvqrA1qm9Qfa/\ns73+xJW4PtEO6xlLVNNOmgfbxV6VrVPXQp/ZoRTEdr5dOyUfn0ENF37dmmW4Vsji\nuxj0qxKXNs7W2DWbe7ZAn8Ta108kPAhn7xJViJ4guPE3XCkaOUvE85rc1zhhyhek\nIknAgPnW9TcoicaaMdM0k7Bci2U00/gPTGb2gG1sHTFGnnzNpQj2u9F1arBA6G/R\nwfQvt0HAxgdg9eBPzPWk9FINqs7v6VBxx62cpCc+WWRjXqzgnBa8wTnyEgbE5wEM\nGkzq7gjjAgMBAAECggEAQOmliEkXhhiwY22+HG0gfIWxJ28zplohcRCGjgft8p0J\ngMsrk3AYckZ1tHqzfIllOMLApa6tH2VVWUXN+dUQBRkfr4viG+8mHSX9OlStBBJV\nsqt2k0HFTXznB1oMU+8skKD+UpE4KUuKu2EkcH6B9T6/R6X/kB2jwLri1msvQc3J\ntA7eom/a1c+cQuyji0mD5cYVIm6hic+E6yCa1s+PGhJJSPGXV+OgpbQOZNQcLAZq\n6493ir4ph+YxdUYcC7aQo0nkn4dfZcFp8M9d0/BFEXdUw58Hv8IxgqtsM+PLT/Tl\n7RqaTo3SLm8wsG2ZQOqDuCe9PCGQgWT94MWCxV+eqQKBgQDLPDcTp6cQTD3bkMCD\n1FX3xUfR20kA2fuKsEMGdbQkdC0KG4IMu3bN/Sy5km3Ceufr10K3NJw23JJ0E/Fc\n+nWs+cnxF68G3IUmQgmG2G1lsmbnW/hPrIF8eIXlevWADz5HQ1rSv7QLk++0NRP5\n5wbzBGccau4smCXvCqV9EJbZTwKBgQC5mDP+j61/NBDPowkkRG7yJ79WINRXdqHQ\nJTxVe32vD0QHHAY+KVwDEVvqZTGaUdfFTjWVUN1yFJW/ezmgp9BezM3qP5riGcCF\nOLYpF+2hjtDX+vSdkSVRmp1oi4I8W53n3sYFVO9SQQFvkNblz3XV4DzqLwJ5McAc\nP52DSJdKLQKBgHhGdY3jPSKPDFihrN0Xz5ynmx5d+TFQz+W+9JuhEvAz9Oezad6h\nHuk/OLXGK8DZveE77pa/wudQ2DdsCf5tlzC8Tz+oNYQJA5+lmz+7W9rAntey/Rwh\nyivgo9UwVJPp8YB5IwnwO9xSO5zZgK33hIxTgbY2riekD2cNVOzT4YJPAoGBAJg8\nFaIgPoMRtRxsMipyi8LMAbFnOmYH5FD0yhmgMwbucbGXNjO0/0lw6sFIgjiAG4o3\nTdKNwyc5ZV/sduel31BzlBAqXiRKVVWxoBHzE7OqjvoqWo4IqeDW/3jqvkg+Kjcw\nz6M9+RSyR7g4yV02IATwa2b4aoH44gkJ0W0HlTl9AoGBAKav3iGyHys2dAIssQWF\nYe+6BHc8C9llEOIYMJXcL4ky1cWJ6RKpktuqABO5GIVavHpBZLOiFpI9ZxRp8zjW\nfGsi/cLrum68gi42I5e5LsGdW0fZl2OTI0ZODo83a5GpyoPW0PvtFl+tatS7h7eR\nYCkcyl4MqTzt6mnd5RIDAlpG\n-----END PRIVATE KEY-----\n",
//   authDomain: "googleapis.com",
//   projectId: "drive-backend-98cbc",
// };

// firebase.initializeApp(firebaseConfig);

// const email = "test@example.com";
// const password = "test@123";

// firebase.auth().signInWithEmailAndPassword(email, password)
//   .then(userCredential => userCredential.user.getIdToken())
//   .then(idToken => {
//     console.log("Firebase ID Token:", idToken);
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error("Error:", err.message);
//     process.exit(1);
//   });

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyDzEZbpboZQN8QlxEZAkHw84jLWFQ0yDQ8",
     authDomain: "drive-backend-98cbc.firebaseapp.com",
  projectId: "drive-backend-98cbc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "testuser@example.com"; // Change as needed
const password = "testuser";    // Change as needed

const getIdToken = async () => {
  try {
    // Try to create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    console.log("✅ New user created.\nID Token:\n", token);
  } catch (createError) {
    if (createError.code === "auth/email-already-in-use") {
      // Sign in instead
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        console.log("🔁 User already exists.\nID Token:\n", token);
      } catch (signInError) {
        console.error("❌ Sign-in error:", signInError.message);
      }
    } else {
      console.error("❌ Create user error:", createError.message);
    }
  }
};

getIdToken();



 //eyJhbGciOiJSUzI1NiIsImtpZCI6IjZkZTQwZjA0ODgxYzZhMDE2MTFlYjI4NGE0Yzk1YTI1MWU5MTEyNTAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHJpdmUtYmFja2VuZC05OGNiYyIsImF1ZCI6ImRyaXZlLWJhY2tlbmQtOThjYmMiLCJhdXRoX3RpbWUiOjE3NTM2OTY2MjEsInVzZXJfaWQiOiJORjdvc3lQbDl6VjMwRDJiTERZYk5VeTVMR3MxIiwic3ViIjoiTkY3b3N5UGw5elYzMEQyYkxEWWJOVXk1TEdzMSIsImlhdCI6MTc1MzY5NjYyMSwiZXhwIjoxNzUzNzAwMjIxLCJlbWFpbCI6Im5ldy11c2VyQGV4YW1wbGUuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbIm5ldy11c2VyQGV4YW1wbGUuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Vd5MzCbLwwmDWK6LuvT2PjoNNKVAkHRI6m209JjJOBwYkHIPVPfH0h-be3N-FAVDsEQBQaRyyR-VUeV9YNDMvArxrwCxO_OmNqEAMw0IOMizB2TUbqo02nBcQpPY_Os5BLyiwzHvyQhpvd6RBKxRCltCE-jjQB9sZ8gu3H6AYb-yYg2Q4ytNm-96tcXlAXPbjYWfkpYDwCBi0fY267QF8mBdAUivCsVFhZRauhOnG4OYZC3G8uVN_dnMvacJykJxpNlhHalwKZ1vURwXpAk-T0VjL1TpINQOylBO4vTu2P2x2d_W9Z9kSxT4HNr6gtFOODTrbxoiQbHcZtnGSDxTaA