"use client";
import React from "react";
import { useEnquiry } from "@/app/context/EnquiryContext";

interface ConsultationButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function ConsultationButton({ className, style, children }: ConsultationButtonProps) {
  const { openModal } = useEnquiry();
  
  return (
    <button onClick={openModal} className={className} style={{ border: 'none', cursor: 'pointer', ...style }}>
      {children || "Get Free Consultation"}
    </button>
  );
}
