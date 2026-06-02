"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState } from "react";
import {
  Save,
  X,
  RotateCcw,
  Calendar,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";

export default function CreateVehiclePage() {
  const router = useRouter();

  const [toggles, setToggles] = useState({
    active: true,
    approved: false,
    maintenance: false,
  });

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    background: COLORS.BG_CARD,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
    display: "block",
  };

  const toggleStyle = (active: boolean): React.CSSProperties => ({
    width: "44px",
    height: "22px",
    borderRadius: "11px",
    background: active ? "#10B981" : "#E5E7EB",
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.2s",
  });

  const knobStyle = (active: boolean): React.CSSProperties => ({
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: COLORS.BG_CARD,
    position: "absolute",
    top: "2px",
    left: active ? "24px" : "2px",
    transition: "left 0.2s",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  });

  const Toggle = ({
    active,
    onToggle,
  }: {
    active: boolean;
    onToggle: () => void;
  }) => (
    <div style={toggleStyle(active)} onClick={onToggle}>
      <div style={knobStyle(active)} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader
        title="Add New Vehicle"
        description="Dashboard / Vehicles / Add New"
        showBack
        notificationCount={5}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Image Upload Placeholder */}
          <Card>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Vehicle Media
            </h3>
            <div
              style={{
                height: "200px",
                border: "2px dashed #E5E7EB",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                background: "#F9FAFB",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "50%",
                  background: COLORS.BG_CARD,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <ImageIcon size={32} color="#9CA3AF" />
              </div>
              <p style={{ fontSize: "0.9rem", color: "#6B7280" }}>
                Click to upload vehicle images or drag and drop
              </p>
              <Button size="sm" variant="outline">
                Upload Images
              </Button>
            </div>
          </Card>

          {/* Registration Details */}
          <Card>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Registration Details
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div>
                <label style={labelStyle}>Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g. ABC-1234"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>VIN Number *</label>
                <input
                  type="text"
                  placeholder="17-digit VIN"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Registration Expiry *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    style={inputStyle}
                  />
                  <Calendar
                    size={18}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#6B7280",
                    }}
                  />
                </div>
              </div>
              <SelectField
                label="License Plate State"
                options={[
                  { label: "Select State", value: "Select State" },
                  { label: "Ontario", value: "Ontario" },
                  { label: "Quebec", value: "Quebec" },
                  { label: "Alberta", value: "Alberta" },
                ]}
              />
            </div>
          </Card>

          {/* Vehicle Specifications */}
          <Card>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Vehicle Specifications
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <SelectField
                label="Make *"
                options={[
                  { label: "Select Make", value: "Select Make" },
                  { label: "Toyota", value: "Toyota" },
                  { label: "Honda", value: "Honda" },
                  { label: "Nissan", value: "Nissan" },
                ]}
              />
              <div>
                <label style={labelStyle}>Model *</label>
                <input
                  type="text"
                  placeholder="e.g. Camry"
                  style={inputStyle}
                />
              </div>
              <SelectField
                label="Year *"
                options={[
                  { label: "Select Year", value: "Select Year" },
                  { label: "2022", value: "2022" },
                  { label: "2023", value: "2023" },
                  { label: "2024", value: "2024" },
                ]}
              />
              <div>
                <label style={labelStyle}>Color</label>
                <input
                  type="text"
                  placeholder="e.g. Silver"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Engine</label>
                <input
                  type="text"
                  placeholder="e.g. 2.5L 4-Cylinder"
                  style={inputStyle}
                />
              </div>
              <SelectField
                label="Transmission"
                options={[
                  { label: "Select Type", value: "Select Type" },
                  { label: "Automatic CVT", value: "Automatic CVT" },
                  { label: "Manual", value: "Manual" },
                ]}
              />
              <SelectField
                label="Fuel Type"
                options={[
                  { label: "Select Type", value: "Select Type" },
                  { label: "Gasoline", value: "Gasoline" },
                  { label: "Hybrid", value: "Hybrid" },
                  { label: "Electric", value: "Electric" },
                ]}
              />
              <div>
                <label style={labelStyle}>Current Mileage (km)</label>
                <input type="text" placeholder="0" style={inputStyle} />
              </div>
            </div>
          </Card>

          {/* Listing & Pricing */}
          <Card>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Listing & Pricing
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <label style={labelStyle}>Daily Rate ($) *</label>
                <input type="text" placeholder="0.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Weekly Rate ($)</label>
                <input type="text" placeholder="0.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Monthly Rate ($)</label>
                <input type="text" placeholder="0.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Security Deposit ($) *</label>
                <input type="text" placeholder="0.00" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Vehicle Description</label>
              <textarea
                style={{ ...inputStyle, height: "100px", resize: "none" }}
                placeholder="Describe the vehicle conditions and features..."
              />
            </div>
          </Card>

          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <Button variant="outline" onClick={() => router.back()}>
              Discard
            </Button>
            <Button onClick={() => router.back()}>
              <Plus size={18} />
              Create Vehicle
            </Button>
          </div>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Availability Settings */}
          <Card>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Status & Availability
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Set Active
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Make available for listings
                  </p>
                </div>
                <Toggle
                  active={toggles.active}
                  onToggle={() =>
                    setToggles((p) => ({ ...p, active: !p.active }))
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    Automatic Approval
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Skip manual review
                  </p>
                </div>
                <Toggle
                  active={toggles.approved}
                  onToggle={() =>
                    setToggles((p) => ({ ...p, approved: !p.approved }))
                  }
                />
              </div>
            </div>
          </Card>

          {/* Owner Assignment */}
          <Card>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Owner Information
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <SelectField
                label="Select Owner *"
                options={[
                  {
                    label: "Select Registered Owner",
                    value: "Select Registered Owner",
                  },
                  { label: "John Smith", value: "John Smith" },
                  { label: "Sarah Johnson", value: "Sarah Johnson" },
                  {
                    label: "Fleet Solutions Ltd",
                    value: "Fleet Solutions Ltd",
                  },
                ]}
              />
              <div
                style={{
                  padding: "1rem",
                  background: COLORS.PRIMARY_LIGHT,
                  borderRadius: "8px",
                  border: "1px solid #DBEAFE",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: COLORS.INFO_DARK,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <RotateCcw size={16} /> New owners must be registered before
                  being assigned a vehicle.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
