"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import EnquiryModal from "@/app/components/EnquiryModal/EnquiryModal";

interface EnquiryContextType {
  openModal: () => void;
  closeModal: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export const EnquiryProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <EnquiryContext.Provider value={{ openModal, closeModal }}>
      {children}
      <EnquiryModal isOpen={isOpen} onClose={closeModal} />
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
};
