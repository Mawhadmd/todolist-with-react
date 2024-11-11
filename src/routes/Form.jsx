import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Authf, GoogleProvider } from "../firebase.js";
import googlepng from "../assets/google.png";
import loadingpic from "../assets/load_13571808.png";
import forgotpng from "../assets/forgot.png";
import {
  applyActionCode,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import validator from "validator";
import "./Form.css";
Authf.useDeviceLanguage();
const Form = () => {
  const navigate = useNavigate();
  const [googleimg, setgoogleimg] = useState(googlepng);
  const [fpasswordimg, setfpasswordimg] = useState(forgotpng);
  const [isSignupUp, setIsSignupUp] = useState(false);
  const [signupStyle, setSignupStyle] = useState({});
  const [signinStyle, setSigninStyle] = useState({});
  const [signupFormStyle, setSignupFormStyle] = useState({});
  const [loginButtonText, setLoginButtonText] = useState("Login");
  const [signupButtonText, setSignupButtonText] = useState("SignUp");
  const [statusInfo, setStatusInfo] = useState("");
  
  const [email, setemail] = useState("");
  const [code, setcode] = useState("");
  const [waitingforcode, setwaitingforcode] = useState(false);
  const [password, setPassword] = useState("");
  
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get("oobCode");
  
  //   if (code) {
  //     applyActionCode(Authf, code)
  //       .then(() => console.log("Code applied successfully"))
  //       .catch(error => console.error("Error applying code:", error));
  //   }
  // }, []);

  //check if user is logged
  async function islogged() {
    onAuthStateChanged(Authf, (user) => {
      if (user.emailVerified) {
        navigate("/");
      } else {
        console.error("Verify your email");
      }
    });
  }
  useEffect(() => {
    islogged()
  }, []);


  const slideUp = () => {
    defaulting();
    setIsSignupUp(true);
    setSignupFormStyle({ top: "15%", borderRadius: "0" });
    setSignupStyle({ top: "0", padding: "10px", backgroundColor: "green" });
    setSigninStyle({ backgroundColor: "transparent" });
    setTimeout(() => {
      setSigninStyle({ top: "-45px", backgroundColor: "transparent" });
    }, 250);
  };
  const defaulting = () => {
    setemail("");
    setPassword("");
    setStatusInfo("");
  };
  const slideDown = () => {
    defaulting();
    setIsSignupUp(false);
    setSigninStyle({});
    setSignupStyle({});
    setSignupFormStyle({});
  };

  async function signup() {
    setSignupButtonText("Loading...");
    if (email && password) {
      try {
        let message;
        let emailstr = validator.isEmail(email);
        let passstr = validator.isStrongPassword(password);
        if (emailstr && passstr)
          try {
            var cred = await createUserWithEmailAndPassword(Authf, email, password);

            const actionCodeSettings = {
              url: "http://localhost:5174/Sign", // No parentheses needed
              handleCodeInApp: true,
            };
            
            await sendEmailVerification(cred.user, actionCodeSettings);

          } catch (e) {
            let err;

            if (String(e).includes("auth/invalid-email")) {
              err = "Invalid email address.";
            } else if (String(e).includes("auth/email-already-in-use")) {
              err = "An account with this email already exists.";
            } else if (String(e).includes("auth/operation-not-allowed")) {
              err =
                "Email/password sign-in is not enabled. Please contact support.";
            } else if (String(e).includes("auth/weak-password")) {
              err = "Password is too weak. Please choose a stronger password.";
            } else {
              err = `An unknown error occurred. + ${e}`;
            }

            message = err;
          }
        else {
          if (!emailstr) {
            message = "Wrong email";
          } else {
            message =
              "Weak password do this: minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1";
          }
        }

        setStatusInfo(message);

        if (message === "Welcome") navigate("/");
      } catch (e) {
        alert("Error: " + e.message);
      } finally {
        setSignupButtonText("SignUp");
      }
    } else {
      setStatusInfo("email and Password Required");
      setSignupButtonText("SignUp");
    }
    setSignupButtonText("SignUp");
    setemail("");
    setPassword("");
  }

  async function signin() {
    setLoginButtonText("Loading...");
    if (email && password) {
      try {
        let message;
        let emailstr = validator.isEmail(email);

        if (true) {
          if (emailstr) {
            try {
              var a = await signInWithEmailAndPassword(Authf, email, password);
            } catch (e) {
              let err;

              // Use e.code to capture Firebase Auth error codes
              // Email Enumeration Protection is enabled, can't tell the user the specific problem
              // Update (5Minutes after the previous comment) disabled EEP
              switch (e.code) {
                case "auth/invalid-email":
                  err = "Invalid email address.";
                  break;
                case "auth/user-disabled":
                  err = "This account has been disabled.";
                  break;
                case "auth/user-not-found":
                  err = "No user found with this email.";
                  break;
                case "auth/wrong-password":
                  err = "Invalid password for this email.";
                  break;
                default:
                  err = "An unknown error occurred: " + e.message;
              }

              message = err;
            }
          } else {
            message = "Wrong email";
          }
        }
        setStatusInfo(message);

        if (message === "Welcome") navigate("/");
      } catch (e) {
        alert("Error: " + e.message);
      } finally {
        setLoginButtonText("Login");
      }
    } else {
      setStatusInfo("email and Password Required");
      setLoginButtonText("Login");
    }

    setLoginButtonText("Login");
    setemail("");
    setPassword("");
    islogged()
  }
  async function Signwithgoogle() {
    setgoogleimg(loadingpic);
    var message;
    try {
      var signin = await signInWithPopup(Authf, GoogleProvider);
    } catch (e) {
      let err;

      if (String(e).includes("auth/account-exists-with-different-credential")) {
        await fetchSignInMethodsForEmail(Authf, signin.email);
        err =
          "An account with this email already exists with a different sign-in method.";
      } else if (String(e).includes("auth/auth-domain-config-required")) {
        err =
          "Authentication domain configuration is missing. Check your Firebase settings.";
      } else if (String(e).includes("auth/cancelled-popup-request")) {
        err =
          "Multiple popup requests detected. Please complete the first request.";
      } else if (String(e).includes("auth/operation-not-allowed")) {
        err =
          "This sign-in method is not enabled. Please enable it in Firebase Console.";
      } else if (
        String(e).includes("auth/operation-not-supported-in-this-environment")
      ) {
        err =
          "Sign-in is not supported in this environment. Use http or https.";
      } else if (String(e).includes("auth/popup-blocked")) {
        err =
          "Popup blocked by your browser. Please allow popups for this site.";
      } else if (String(e).includes("auth/popup-closed-by-user")) {
        err = "Popup closed before sign-in was completed.";
      } else if (String(e).includes("auth/unauthorized-domain")) {
        err =
          "Your domain is not authorized for this operation. Add it in Firebase Console.";
      } else {
        err = "An unknown error occurred.";
      }

      message = err;
    } finally {
      setStatusInfo(message);
      setgoogleimg(googleimg);
    }
  }
  async function Forgotpassword() {
    setfpasswordimg(loadingpic);
    var message;
    if (email == "") {
      setStatusInfo("Please Insert email and try again");
    } else {
      try {
        let forgotpassword = await sendPasswordResetEmail(Authf, email);
        message = "Email Sent";
        console.log(forgotpassword);
      } catch (e) {
        let err;

        if (String(e).includes("auth/invalid-email")) {
          err = "Invalid email address.";
        } else if (String(e).includes("auth/missing-android-pkg-name")) {
          err = "An Android package name is required.";
        } else if (String(e).includes("auth/missing-continue-uri")) {
          err = "A continue URL is required for this request.";
        } else if (String(e).includes("auth/missing-ios-bundle-id")) {
          err = "An iOS Bundle ID is required with the App Store ID.";
        } else if (String(e).includes("auth/invalid-continue-uri")) {
          err = "The continue URL provided is invalid.";
        } else if (String(e).includes("auth/unauthorized-continue-uri")) {
          err = "The domain of the continue URL is not whitelisted.";
        } else if (String(e).includes("auth/user-not-found")) {
          err = "No user found with this email address.";
        } else {
          err = "An unknown error occurred.";
        }

        message = err;
      }
      setStatusInfo(message);
    }

    setfpasswordimg(fpasswordimg);
  }
  return (
    <div className="formContainer">
      <div className="wraper">
        <div className="error">
          <p> {statusInfo} </p>
          {waitingforcode && (
            <input
              onChange={(e) => {
                setcode(e.target.value);
              }}
              style={{ width: "150px", margin: "0 auto", display: "block" }}
              value={code}
              placeholder="Verification Code"
            />
          )}
        </div>
        <main className="Main signin">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1
              onClick={() => {
                isSignupUp ? slideDown() : signin();
              }}
              style={signinStyle}
            >
              {loginButtonText}
            </h1>
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Email"
            />
            <input
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </form>

          <div style={signupFormStyle} className="Main signup">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <h1
                onClick={() => {
                  !isSignupUp ? slideUp() : signup();
                }}
                style={signupStyle}
              >
                {signupButtonText}
              </h1>
              <input
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Email"
              />
              <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </form>
          </div>
        </main>
        <div style={{ padding: "10px" }}>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
            }}
            to="/"
          >
            Continue as a guest
          </Link>
        </div>
      </div>
      <div className="sidebuttons">
        <button onClick={Signwithgoogle} className="SignG">
          <img
            src={googleimg}
            title="Signin with Google"
            alt="Google Sign"
          ></img>
        </button>
        <button onClick={Forgotpassword} className="PasswordReset">
          <img
            src={fpasswordimg}
            title="Forgot password?"
            alt="Forgot Password"
          ></img>
        </button>
      </div>
    </div>
  );
};

export default Form;
