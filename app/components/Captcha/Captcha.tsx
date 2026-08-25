"use client";

import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import styles from "./Captcha.module.css";

export interface CaptchaRef {
  validate: () => boolean;
  refresh: () => void;
}

interface CaptchaProps {
  onVerify?: (isValid: boolean) => void;
  className?: string;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(({ onVerify, className }, ref) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const n2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    setNum1(n1);
    setNum2(n2);
    setUserAnswer("");
    setError(false);
    if (onVerify) onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const isCorrect = parseInt(userAnswer.trim(), 10) === num1 + num2;
      if (!isCorrect) {
        setError(true);
      } else {
        setError(false);
      }
      return isCorrect;
    },
    refresh: () => {
      generateCaptcha();
    },
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);
    setError(false);
    const isCorrect = parseInt(val.trim(), 10) === num1 + num2;
    if (onVerify) onVerify(isCorrect);
  };

  return (
    <div className={`${styles.captchaContainer} ${className || ""}`}>
      <label className={styles.label}>
        Security Verification <span className={styles.required}>*</span>
      </label>

      <div className={styles.captchaBox}>
        {/* Math Challenge Visual Card */}
        <div className={styles.challengeCard}>
          <span className={styles.mathText}>
            {num1} + {num2} = ?
          </span>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={generateCaptcha}
            title="Refresh Security Code"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>

        {/* User Input Field */}
        <input
          type="number"
          required
          className={`${styles.input} ${error ? styles.inputError : ""}`}
          placeholder="Answer"
          value={userAnswer}
          onChange={handleChange}
        />
      </div>

      {error && (
        <span className={styles.errorText}>
          ❌ Incorrect answer. Please calculate {num1} + {num2} correctly.
        </span>
      )}
    </div>
  );
});

Captcha.displayName = "Captcha";

export default Captcha;
