"use client";

import React, { useState, useEffect, useCallback } from "react";
import { financeApi } from "@/services/api/finance";
import {
  DollarSign,
  Plus,
  Download,
  Search,
  AlertTriangle,
  X,
  Calendar,
  Edit,
  Eye,
  Trash2,
  CarFront,
} from "lucide-react";
import { COLORS } from "@/constants/Constant";
import StatCard from "@/components/StatCard";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import VehiclePurchaseDetail from "./VehiclePurchaseDetail";

// No hardcoded PURCHASE_DATA — fetched from API

interface PurchaseApiRecord {
  _id: string;
  purchaseDate?: string;
  registration?: string;
  vehicleName?: string;
  exGstCost?: number;
  gst?: number;
  incGstCost?: number;
  purchasedFrom?: string;
  isDuplicate?: boolean;
}

export type PurchaseRecord = PurchaseApiRecord;

interface VehiclePurchaseProps {
  selectedRecord: PurchaseRecord | null;
  setSelectedRecord: (record: PurchaseRecord | null) => void;
}

export default function VehiclePurchase({
  selectedRecord,
  setSelectedRecord,
}: VehiclePurchaseProps) {
  const [alertVisible, setAlertVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Monthly");
  const [records, setRecords] = useState<PurchaseApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await financeApi.getVehiclePurchaseDashboard({ limit: 50 });
      const d = res.data as any;
      setRecords(d.purchases ?? d.data ?? []);
    } catch (err: any) {
      setApiError(err.message ?? "Failed to load purchase records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  const duplicates = records.filter(r => r.isDuplicate);

  if (selectedRecord) {
    return (
      <VehiclePurchaseDetail
        record={selectedRecord as any}
        onBack={() => setSelectedRecord(null)}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
        }}
      >
        <StatCard
          title="Vehicles Purchased"
          value={records.length.toString()}
          badge={`${records.length} total`}
          badgeColor="#16A34A"
          badgeBg="#DCFCE7"
          icon={<CarFront size={24} />}
          iconBg="#EFF6FF"
          iconColor="#3B82F6"
        />
        <StatCard
          title="Total Purchase Value"
          value={"$" + records.reduce((sum, r) => sum + (r.incGstCost ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          badge="GST Inclusive"
          badgeColor="#6B7280"
          badgeBg="#F3F4F6"
          icon={<DollarSign size={24} />}
          iconBg="#F0FDF4"
          iconColor="#22C55E"
        />
      </div>

      {/* Filters and Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              background: "#fff",
              padding: "4px",
              borderRadius: "10px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            {["Monthly", "Weekly", "Quarterly", "Financial Year"].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    border: "none",
                    background:
                      activeFilter === filter
                        ? COLORS.PRIMARY_MAIN
                        : "transparent",
                    color:
                      activeFilter === filter ? "#fff" : COLORS.TEXT_SECONDARY,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {filter}
                </button>
              ),
            )}
          </div>
          <Button
            variant="outline"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Calendar size={16} />
            <span>Custom Date Range</span>
          </Button>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button
            variant="primary"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Plus size={18} />
            <span>Add Purchase Record</span>
          </Button>
          <Button
            variant="outline"
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <Download size={18} />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertVisible && (
        <div
          style={{
            background: "#FEFCE8",
            border: "1px solid #FEF08A",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ color: "#EAB308", marginTop: "2px" }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#854D0E",
                  marginBottom: "0.25rem",
                }}
              >
                Duplicate Registration Warning
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#A16207" }}>
                Registration ABC789 appears multiple times. Review purchase
                records for duplicates.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertVisible(false)}
            style={{
              background: "none",
              border: "none",
              color: "#A16207",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
              }}
            >
              Purchase Records
            </h3>
            <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
              {records.length.toLocaleString()} total purchases
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: COLORS.TEXT_MUTED,
                }}
              />
              <input
                type="text"
                placeholder="Search by registration, mak..."
                style={{
                  padding: "0.6rem 1rem 0.6rem 2.5rem",
                  borderRadius: "10px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.85rem",
                  width: "240px",
                  outline: "none",
                }}
              />
            </div>
            <SelectField
              options={[
                { label: "All Suppliers", value: "allsuppliers" },
                { label: "AutoDirect Ltd", value: "AutoDirect Ltd" },
                { label: "FleetSource NZ", value: "FleetSource NZ" },
                { label: "CarHub Auction", value: "CarHub Auction" },
              ]}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}>
                <th style={tableHeaderStyle}>Purchase Date</th>
                <th style={tableHeaderStyle}>Registration</th>
                <th style={tableHeaderStyle}>Make & Model</th>
                <th style={tableHeaderStyle}>GST Ex Cost</th>
                <th style={tableHeaderStyle}>GST</th>
                <th style={tableHeaderStyle}>GST Inc Cost</th>
                <th style={tableHeaderStyle}>Purchased From</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ height: "36px", background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "4px" }} />)}
                  </div>
                  <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
                </td></tr>
              ) : apiError ? (
                <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#DC2626" }}>{apiError}</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>No purchase records found</td></tr>
              ) : records.map((row) => (
                <tr
                  key={row._id}
                  onClick={() => setSelectedRecord(row)}
                  style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}`, background: row.isDuplicate ? "#FEF2F2" : "transparent", textAlign: "center", cursor: "pointer" }}
                >
                  <td style={tableCellStyle}>{row.purchaseDate ? new Date(row.purchaseDate).toLocaleDateString() : "--"}</td>
                  <td style={tableCellStyle}>
                    <span style={{ fontWeight: 600 }}>{row.registration || "--"}</span>
                    {row.isDuplicate && (
                      <div style={{ alignItems: "center", padding: "4px 6px", borderRadius: "4px", color: COLORS.ERROR_MAIN, fontSize: "0.7rem", fontWeight: 700, border: `0.5px solid ${COLORS.ERROR_MAIN}`, backgroundColor: COLORS.ERROR_LIGHT }}>
                        <AlertTriangle size={10} /><span>Duplicate</span>
                      </div>
                    )}
                  </td>
                  <td style={tableCellStyle}>{row.vehicleName || "--"}</td>
                  <td style={tableCellStyle}>${(row.exGstCost ?? 0).toLocaleString()}</td>
                  <td style={tableCellStyle}>${(row.gst ?? 0).toLocaleString()}</td>
                  <td style={tableCellStyle}><span style={{ fontWeight: 700 }}>${(row.incGstCost ?? 0).toLocaleString()}</span></td>
                  <td style={tableCellStyle}>{row.purchasedFrom || "--"}</td>
                  <td style={tableCellStyle}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }} onClick={(e) => e.stopPropagation()}>
                      <button style={actionButtonStyle}><Edit size={16} /></button>
                      <button style={actionButtonStyle} onClick={() => setSelectedRecord(row)}><Eye size={16} /></button>
                      <button style={{ ...actionButtonStyle, color: COLORS.ERROR_MAIN }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "1rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableCellStyle: React.CSSProperties = {
  padding: "1rem",
  fontSize: "0.85rem",
  color: COLORS.TEXT_MAIN,
};

const actionButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: COLORS.TEXT_SECONDARY,
  cursor: "pointer",
  padding: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  transition: "all 0.2s",
};
