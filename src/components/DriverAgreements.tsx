"use client";
import React from "react";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Home, 
  Car, 
  Search, 
  Download, 
  Plus,
  Filter,
  Calendar
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";
import Button from "./Button";
import SelectField from "./SelectField";

const DriverAgreements = () => {
  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
        <StatCard 
          title="Total Agreements" 
          value="2,847" 
          icon={<FileText size={20} />} 
          iconBg="#EFF6FF" 
          iconColor="#2563EB"
        />
        <StatCard 
          title="Active Agreements" 
          value="1,923" 
          badge="Healthy"
          icon={<CheckCircle size={20} />} 
          iconBg="#ECFDF5" 
          iconColor="#059669"
        />
        <StatCard 
          title="Pending Approval" 
          value="156" 
          icon={<Clock size={20} />} 
          iconBg="#FFFBEB" 
          iconColor="#D97706"
        />
        <StatCard 
          title="Expiring Soon" 
          value="43" 
          icon={<AlertTriangle size={20} />} 
          iconBg="#FEF2F2" 
          iconColor="#DC2626"
        />
        <StatCard 
          title="Rent-to-Own" 
          value="987" 
          icon={<Home size={20} />} 
          iconBg="#F5F3FF" 
          iconColor="#7C3AED"
        />
        <StatCard 
          title="Rental Only" 
          value="936" 
          icon={<Car size={20} />} 
          iconBg="#EFF6FF" 
          iconColor="#2563EB"
        />
      </div>

      {/* Filters Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: COLORS.TEXT_SECONDARY }} />
            <input 
              type="text" 
              placeholder="Search by agreement title..." 
              style={filterInputStyle}
            />
          </div>
          <SelectField 
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "active" },
              { label: "Pending", value: "pending" },
              { label: "Expired", value: "expired" },
            ]}
          />
          <SelectField 
            options={[
              { label: "Agreement Type", value: "all" },
              { label: "Rent-to-Own", value: "rto" },
              { label: "Rental Only", value: "rental" },
            ]}
          />
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: COLORS.TEXT_SECONDARY }} />
            <input 
              type="text" 
              placeholder="Search by vehicle..." 
              style={filterInputStyle}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Calendar size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: COLORS.TEXT_SECONDARY }} />
            <input type="text" placeholder="mm/dd/yyyy" style={filterInputStyle} />
          </div>
          <div style={{ position: "relative" }}>
            <Calendar size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: COLORS.TEXT_SECONDARY }} />
            <input type="text" placeholder="mm/dd/yyyy" style={filterInputStyle} />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", gridColumn: "span 2", justifyContent: "flex-end" }}>
            <Button variant="primary" style={{ padding: "0.6rem 2rem" }}>
              Apply Filters
            </Button>
            <Button variant="secondary">
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>All Agreements</h3>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>Showing 1-10 of 2,847 agreements</span>
            <Button variant="secondary">
              <Download size={16} /> Export
            </Button>
            <Button variant="primary">
              <Plus size={16} /> New Agreement
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                <th style={tableHeaderStyle}>Agreement</th>
                <th style={tableHeaderStyle}>Driver</th>
                <th style={tableHeaderStyle}>Vehicle</th>
                <th style={tableHeaderStyle}>Type</th>
                <th style={tableHeaderStyle}>Start Date</th>
                <th style={tableHeaderStyle}>End Date</th>
                <th style={tableHeaderStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {agreementData.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: 700 }}>{item.id}</div>
                    <div style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{item.title}</div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <img src={item.driverAvatar} alt={item.driverName} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.driverName}</div>
                        <div style={{ fontSize: "0.7rem", color: COLORS.TEXT_SECONDARY }}>{item.driverId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ fontWeight: 600 }}>{item.vehicleModel}</div>
                    <div style={{ fontSize: "0.75rem", color: COLORS.TEXT_SECONDARY }}>{item.vehiclePlate}</div>
                  </td>
                  <td style={tableCellStyle}>
                    <StatusBadge status={item.type} />
                  </td>
                  <td style={tableCellStyle}>{item.startDate}</td>
                  <td style={tableCellStyle}>
                    <div>{item.endDate}</div>
                    {item.remaining && (
                      <div style={{ fontSize: "0.7rem", color: "#DC2626", fontWeight: 600 }}>{item.remaining}</div>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const filterInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem 0.6rem 2.25rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  fontSize: "0.85rem",
  outline: "none",
  background: "#F9FAFB",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1.25rem 1rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};

const agreementData = [
  {
    id: "AGR-2024-001234",
    title: "Toyota Camry Agreement",
    driverName: "Michael Johnson",
    driverId: "DRV-001234",
    driverAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    vehicleModel: "Toyota Camry 2023",
    vehiclePlate: "ABC-123",
    type: "Rent-to-Own",
    startDate: "15 Jan 2024",
    endDate: "15 Jan 2026",
    status: "Active",
  },
  {
    id: "AGR-2024-001235",
    title: "Honda Civic Agreement",
    driverName: "Sarah Wilson",
    driverId: "DRV-001235",
    driverAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    vehicleModel: "Honda Civic 2022",
    vehiclePlate: "DEF-456",
    type: "Rental Only",
    startDate: "20 Jan 2024",
    endDate: "20 Feb 2024",
    status: "Pending",
  },
  {
    id: "AGR-2024-001236",
    title: "Mazda CX-5 Agreement",
    driverName: "David Chen",
    driverId: "DRV-001236",
    driverAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    vehicleModel: "Mazda CX-5 2023",
    vehiclePlate: "GHI-789",
    type: "Rent-to-Own",
    startDate: "10 Feb 2024",
    endDate: "10 Feb 2024",
    remaining: "(7 days)",
    status: "Expiring",
  },
];

export default DriverAgreements;
