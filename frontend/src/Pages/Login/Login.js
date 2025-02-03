import React, { useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  appleProvider
} from "../../firebase-config";
import {
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { CustomAlert } from "../../Utils/CustomAlert/CustomAlert";
import "./Login.css"; // Create this file to style the login component

const Login = ({ onClose }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Initialize reCAPTCHA when the component mounts
  useEffect(() => {
    initializeRecaptcha();
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // Function to initialize reCAPTCHA
  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      const recaptchaContainer = document.getElementById("recaptcha-container");

      if (recaptchaContainer && recaptchaContainer.innerHTML.trim() === "") {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA verified");
            },
            "expired-callback": () => {
              console.warn("reCAPTCHA expired. Resetting verifier.");
              window.recaptchaVerifier = null;
            },
          }
        );

        window.recaptchaVerifier
          .render()
          .catch((err) => console.error("reCAPTCHA render error:", err));
      } else {
        console.log("reCAPTCHA already rendered.");
      }
    }
  };

  // Send OTP for Phone Login
  const sendOTP = async () => {
    if (!phone.match(/^\+\d{10,15}$/)) {
      CustomAlert("Enter a valid phone number with country code (e.g., +1234567890)");
      return;
    }

    setLoading(true);

    // Reset reCAPTCHA before sending OTP
    if (window.recaptchaVerifier) {
      try {
        await window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      } catch (error) {
        console.warn("Error clearing reCAPTCHA:", error);
      }
    }

    initializeRecaptcha();

    try {
      if (!window.recaptchaVerifier) {
        throw new Error("reCAPTCHA failed to initialize. Try again.");
      }

      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmResult(confirmation);
      setIsOtpSent(true);
      CustomAlert("OTP sent to your phone!");
    } catch (error) {
      console.error("Failed to send OTP:", error);
      CustomAlert(`Failed to send OTP: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and Login
  const verifyOTP = async () => {
    if (!otp) {
      CustomAlert("Enter the OTP!");
      return;
    }

    if (!confirmResult) {
      CustomAlert("Session expired! Please request a new OTP.");
      return;
    }

    setLoading(true);
    try {
      await confirmResult.confirm(otp);
      CustomAlert("Phone login successful!");
      onClose();
    } catch (error) {
      console.error("Invalid OTP:", error);
      CustomAlert("Invalid OTP! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result);
      CustomAlert("Google login successful!");
      onClose();
    } catch (error) {
      console.error("Google login error:", error);
      CustomAlert("Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  // Apple Login Handler
  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      console.log("Apple login successful:", result);
      CustomAlert("Apple login successful!");
      onClose();
    } catch (error) {
      console.error("Apple login error:", error);
      CustomAlert("Apple login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        {/* The reCAPTCHA container (it may remain invisible) */}
        <div id="recaptcha-container"></div>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="login-title">Login</h2>

        {/* Google Login Button */}
        <button className="login-btn google-login" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login with Google"}
        </button>

        {/* Apple Login Button */}
        <button className="login-btn apple-login" onClick={handleAppleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login with Apple"}
        </button>

        <hr className="line" />

        {/* Phone Number Login */}
        <input
          type="text"
          className="login-input"
          placeholder="Phone Number (+1234567890)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading || isOtpSent}
        />
        <button className="login-btn otp-btn" onClick={sendOTP} disabled={loading || isOtpSent}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* OTP Verification */}
        {isOtpSent && (
          <>
            <input
              type="text"
              className="login-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
            <button className="login-btn otp-btn" onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
