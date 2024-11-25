import snsWebSdk from '@sumsub/websdk';

/**
 * @param accessToken - access token that you generated
 * on the backend with levelName: mtc
 */
function launchWebSdk(accessToken) {
  let snsWebSdkInstance = snsWebSdk.init(
    accessToken,
    // Token update callback, must return Promise
    () => fetchNewAccessToken()
  )
    .withConf({
      // Language of WebSDK texts and comments (ISO 639-1 format)
      lang: 'en',
    })
    .on('onError', (error) => {
      console.log('onError', error);
      alert('Verification encountered an error. Please try again.');
    })
    .onMessage((type, payload) => {
      console.log('onMessage', type, payload);
      if (type === 'onSdkExit') {
        // Optional: Handle when user exits the SDK
        alert('Verification exited. You can retry if needed.');
      }
      if (type === 'onVerificationCompleted') {
        // Redirect to Fleet Management Dashboard
        window.location.href = '/fleet';
      }
    })
    .build();

  // Launch the WebSDK by providing the container element for it
  snsWebSdkInstance.launch('#sumsub-websdk-container');
}

function initializeSumSubSDK(accessToken) {
  if (typeof snsWebSdk === 'undefined') {
    console.error('SumSub SDK is not loaded');
    alert('Verification SDK failed to load. Please try again later.');
    return;
  }

  console.log('Launching SumSub SDK');
  launchWebSdk(accessToken);
}

function fetchNewAccessToken() {
  // Implement token refresh logic if SumSub requires token refresh
  // For demonstration, returning a resolved promise with a static token
  return Promise.resolve('prd:IEvJRQx1bbM743wVO85Np6tV.6LMeKAxre9b9kF7lqk80QS0dyibtoVLp');
}

// Listen for messages from SumSub (optional)
window.addEventListener('message', (event) => {
  if (event.data.type === 'verificationCompleted') {
    // Handle the verification completion (e.g., update UI, notify server)
    console.log('Verification completed for user:', event.data.userId);
    // Redirect or perform other actions as needed
    window.location.href = '/fleet';
  }
});

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj46uOcP-Y4T3X2ZpdlWt4_PxUWCTFwyM",
  authDomain: "masstransitcompany.firebaseapp.com",
  projectId: "masstransitcompany",
  storageBucket: "masstransitcompany.appspot.com",
  messagingSenderId: "1039705984668",
  appId: "1:1039705984668:web:e85aafd14917825b3d6759",
  measurementId: "G-NMMQLPBJD1"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized');
} catch (error) {
  console.error('Firebase initialization error:', error);
}
const auth = firebase.auth();

// Google Sign-In
document.getElementById('google-signin').addEventListener('click', () => {
  console.log('Google Sign-In clicked');
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(result => {
      console.log('Google sign-in successful:', result.user);
      startSumsubVerification(result.user.uid);
    })
    .catch(error => {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again.');
    });
});

// Email Sign-In
document.getElementById('email-signin').addEventListener('click', () => {
  console.log('Email Sign-In clicked');
  // Display Email Sign-In Form
  displayEmailSignInForm();
});

function displayEmailSignInForm() {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <h2>Email Sign-In</h2>
    <form id="email-signin-form">
      <input type="email" id="email-input" placeholder="Email" required>
      <input type="password" id="password-input" placeholder="Password" required>
      <button type="submit">Sign In</button>
    </form>
    <button id="back-button">Back</button>
  `;

  document.getElementById('email-signin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    if (email && password) {
      auth.signInWithEmailAndPassword(email, password)
        .then(result => {
          console.log('Email sign-in successful:', result.user);
          startSumsubVerification(result.user.uid);
        })
        .catch(error => {
          console.error('Email sign-in error:', error);
          // Optionally, handle sign-up if user doesn't exist
          if (error.code === 'auth/user-not-found') {
            auth.createUserWithEmailAndPassword(email, password)
              .then(result => {
                console.log('User created and signed in:', result.user);
                startSumsubVerification(result.user.uid);
              })
              .catch(signUpError => {
                console.error('Sign-up error:', signUpError);
                alert('Sign-up failed. Please try again.');
              });
          } else {
            alert('Email sign-in failed. Please check your credentials.');
          }
        });
    } else {
      alert("Email and password are required.");
    }
  });

  document.getElementById('back-button').addEventListener('click', () => {
    location.reload();
  });
}

// Start SumSub Verification
function startSumsubVerification(userId) {
  console.log('Starting SumSub verification for user:', userId);

  // Fetch access token from backend
  fetch('/api/generate-sumsub-token', { // Use relative path since backend is on the same domain
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.token) { // Expecting 'token' instead of 'accessToken'
      initializeSumSubSDK(data.token);
    } else {
      throw new Error('Access token not received');
    }
  })
  .catch(error => {
    console.error('Error fetching SumSub access token:', error);
    alert('Failed to initiate verification. Please try again later.');
  });
}
