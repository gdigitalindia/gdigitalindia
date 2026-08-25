"use client";

import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import styles from "./Captcha.module.css";

export interface CaptchaRef {
  validate: () => boolean;
  reset: () => void;
}

interface CaptchaProps {
  onVerify?: (isValid: boolean) => void;
  className?: string;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(({ onVerify, className }, ref) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!isChecked) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    reset: () => {
      setIsChecked(false);
      setIsVerifying(false);
      setError(false);
    },
  }));

  const handleCheckboxClick = () => {
    if (isChecked || isVerifying) return;

    setIsVerifying(true);
    setError(false);

    // Simulate Google reCAPTCHA verification delay (600ms)
    setTimeout(() => {
      setIsVerifying(false);
      setIsChecked(true);
      if (onVerify) onVerify(true);
    }, 600);
  };

  return (
    <div className={`${styles.recaptchaWrapper} ${className || ""}`}>
      {/* Official Google reCAPTCHA Box */}
      <div
        className={`${styles.recaptchaBox} ${error ? styles.recaptchaBoxError : ""}`}
        onClick={handleCheckboxClick}
      >
        <div className={styles.leftSection}>
          <div className={styles.checkboxContainer}>
            {isVerifying ? (
              <div className={styles.spinner} />
            ) : isChecked ? (
              <div className={styles.checkmark}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    fill="#0f9d58"
                  />
                </svg>
              </div>
            ) : (
              <div className={styles.checkbox} />
            )}
          </div>
          <span className={styles.robotText}>I&apos;m not a robot</span>
        </div>

        {/* Google reCAPTCHA Logo */}
        <div className={styles.rightSection}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                fill="#4285f4"
              />
              <path
                d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04L2.34 5.03C4.47 2.01 8 0 12 0c5.3 0 9.77 3.44 11.36 8.25l-4 1.79z"
                fill="#4285f4"
              />
              <path
                d="M4.64 13.96C5.33 17.41 8.36 20 12 20c2.89 0 5.4-1.64 6.65-4.04l3.01 3.01C19.53 21.99 16 24 12 24c-5.3 0-9.77-3.44-11.36-8.25l4-1.79z"
                fill="#34a853"
              />
            </svg>
          </div>
          <span className={styles.brandTitle}>reCAPTCHA</span>
          <div className={styles.privacyTerms}>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy
            </a>
            <span> - </span>
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Terms
            </a>
          </div>
        </div>
      </div>

      {error && (
        <span className={styles.errorText}>
          ⚠️ Please verify that you are not a robot.
        </span>
      )}
    </div>
  );
});

Captcha.displayName = "Captcha";

export default Captcha;
