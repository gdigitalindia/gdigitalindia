"use client";
import React from "react";
import { useEnquiry } from "@/app/context/EnquiryContext";

interface ConsultationButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function ConsultationButton({ className, children }: ConsultationButtonProps) {
  const { openModal } = useEnquiry();
  
  return (
    <button onClick={openModal} className={className} style={{ border: 'none', cursor: 'pointer' }}>
      {children || "Get Free Consultation"}
    </button>
  );
}
