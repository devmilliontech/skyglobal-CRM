"use client";
import React from "react";
import PageHeader from "@/components/PageHeader";
import KYCVerificationQueue from "@/components/KYCVerificationQueue";

export default function KYCQueuePage() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <PageHeader 
        title="KYC Verification Queue" 
        description="Review and verify pending driver documents"
        notificationCount={3}
      />
      
      <KYCVerificationQueue />
    </div>
  );
}
