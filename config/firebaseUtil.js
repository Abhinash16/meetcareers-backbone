var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://meetcareers-app-default-rtdb.asia-southeast1.firebasedatabase.app",
});
