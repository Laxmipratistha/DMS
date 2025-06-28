// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAdnu31U1m54AspTINDR2SpR7wzfrlZlUc",
  authDomain: "geospatial-25b20.firebaseapp.com",
  projectId: "geospatial-25b20",
  storageBucket: "geospatial-25b20.appspot.com", // Fixed
  messagingSenderId: "75407395979",
  appId: "1:75407395979:web:0472c479fb290ffecfd88e",
  measurementId: "G-TC29KHT790"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Sign Up
function signUp() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Sign up successful!");
      window.location.href = "home.html"; // Redirect after signup
    })
    .catch((error) => {
      alert("Sign up error: " + error.message);
    });
}

// Login
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "home.html"; // Redirect after login
    })
    .catch((error) => {
      alert("Login error: " + error.message);
    });
}

// Logout
function logout() {
  auth.signOut()
    .then(() => {
      alert("Logged out!");
      document.getElementById("signup").style.display = "block";
      document.getElementById("login").style.display = "block";
      document.getElementById("user-info").style.display = "none";
    });
}
