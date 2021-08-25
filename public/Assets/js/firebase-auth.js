// If lastLogin is grater than 1hr redirect to index.html for Login
const lastLogin = localStorage.getItem("lastLogin");
if((Date.now()-lastLogin)>3600000){
    if(window.location.href.indexOf('index.html')<0){window.location.href = './index.html'}
} else {
    localStorage.setItem('lastLogin', Date.now());
}


function loadFirebaseAuth(redirectURL){
    localStorage.clear();
    try {
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        let uiConfig = {
            callbacks: {
              signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                const firstIndexOfSpace = encodeURIComponent(authResult.user.displayName).indexOf("%20");
                localStorage.setItem('userShortName', encodeURIComponent(authResult.user.displayName).substring(0,firstIndexOfSpace));
                localStorage.setItem('userFullName', encodeURIComponent(authResult.user.displayName));
                localStorage.setItem('lastLogin', Date.now());
                localStorage.setItem('userEmail', authResult.user.email);
                localStorage.setItem('userPhotoURL', authResult.user.photoURL);
                localStorage.setItem('userUUID', authResult.user.uid);
                localStorage.setItem('userPhoneNumber', authResult.user.phoneNumber);
                return true;
              },
              uiShown: function() {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
                document.getElementsByClassName('logo-index')[0].classList.add('small');
              }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            signInFlow: 'popup',
            signInSuccessUrl: redirectURL,
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    scopes: [
                    'profile',
                    'email'
                    ],
                    fullLabel: 'Google',
                    customParameters: {
                    // Forces account selection even when one account
                    // is available.
                    prompt: 'select_account'
                    }
                },
                // {
                //     provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                //     scopes: [
                //     'public_profile',
                //     'email'
                //     ],
                //     fullLabel: 'Facebook',
                //     customParameters: {
                //     // Forces password re-entry.
                //     // auth_type: 'reauthenticate'
                //     }
                // },
                // {
                //     provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
                //     fullLabel: 'Twitter'
                // },
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, // Other providers don't need to be given as object.
                    fullLabel: 'Correo'
                },
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    recaptchaParameters: {
                        type: 'image', // 'audio'
                        size: 'invisible', // 'invisible' or 'compact'
                        badge: 'inline' //' bottomright' or 'inline' applies to invisible.
                    },
                    defaultCountry: 'MX', // Set default country to the United Kingdom (+44).
                    fullLabel: "Teléfono"
                }
            ],
            // Terms of service url.
            tosUrl: '<your-tos-url>',
            // Privacy policy url.
            privacyPolicyUrl: '<your-privacy-policy-url>'
          };
          // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    } catch (error) {}
}

function signOut(){
    firebase
		.auth()
		.signOut()
		.then(function () {
            localStorage.clear();
            window.location.href = './index.html';
        })
        .catch(function(error){
            console.error(error);
        })
}