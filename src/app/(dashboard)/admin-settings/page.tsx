"use client";
import { COLORS } from "@/constants/Constant";
import React, { useState, useEffect, useCallback } from "react";
import {
  Users, CreditCard, FileText, Car, Bell,
  PieChart, Layout, Zap, Sliders, ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GeneralSettings from "@/components/GeneralSettings";
import RolesAndPermissions from "@/components/RolesAndPermissions";
import PaymentsAndFinance from "@/components/PaymentsAndFinance";
import AgreementsAndRentals from "@/components/AgreementsAndRentals";
import VehiclesAndCompliance from "@/components/VehiclesAndCompliance";
import NotificationSettings from "@/components/NotificationSettings";
import ReportsAndData from "@/components/ReportsAndData";
import Integrations from "@/components/Integrations";
import SystemSettings from "@/components/SystemSettings";
import { useRouter } from "next/navigation";
import { adminSettingsApi } from "@/services/api/adminSettings";

const SETTINGS_TABS = [
  {
    section: "GENERAL",
    items: [{ id: "general", label: "General", icon: Layout }],
  },
  {
    section: "CONFIGURATION",
    items: [
      { id: "users", label: "Users & Roles", icon: Users },
      { id: "payments", label: "Payments & Finance", icon: CreditCard },
      { id: "agreements", label: "Agreements & Rentals", icon: FileText },
      { id: "vehicles", label: "Vehicles & Compliance", icon: Car },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "reports", label: "Reports & Data", icon: PieChart },
      { id: "integrations", label: "Integrations", icon: Zap },
      { id: "system", label: "System", icon: Sliders },
    ],
  },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const router = useRouter();

  // General settings — loaded from backend
  const [generalSettingsLoading, setGeneralSettingsLoading] = useState(true);
  const [maintenanceMode, setMaintenanceModeState] = useState(false);
  const [newUserReg, setNewUserRegState] = useState(true);
  const [twoFactorAuth, setTwoFactorAuthState] = useState(false);
  const [ipWhitelisting, setIpWhitelistingState] = useState(false);
  const [rbac, setRbacState] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [generalSaveMsg, setGeneralSaveMsg] = useState<string | null>(null);

  const loadGeneralSettings = useCallback(async () => {
    setGeneralSettingsLoading(true);
    try {
      const res = await adminSettingsApi.getGeneralSettings();
      const d = res.data as any;
      if (d) {
        setMaintenanceModeState(d.maintenanceMode ?? false);
        setNewUserRegState(d.allowNewUserRegistration ?? d.newUserRegistration ?? true);
        setTwoFactorAuthState(d.twoFactorAuth ?? d.requireTwoFactor ?? false);
        setIpWhitelistingState(d.ipWhitelisting ?? false);
        setRbacState(d.rbacEnabled ?? d.roleBasedAccess ?? true);
      }
    } catch { /* use defaults */ }
    finally { setGeneralSettingsLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === "general") loadGeneralSettings();
  }, [activeTab, loadGeneralSettings]);

  // Save handler — persists to backend
  const saveGeneralSettings = async () => {
    setSavingGeneral(true);
    setGeneralSaveMsg(null);
    try {
      await adminSettingsApi.updateGeneralSettings({
        maintenanceMode,
        allowNewUserRegistration: newUserReg,
        twoFactorAuth,
        ipWhitelisting,
        rbacEnabled: rbac,
      });
      setGeneralSaveMsg("Settings saved successfully.");
    } catch (err: any) {
      setGeneralSaveMsg(err.message || "Failed to save settings.");
    } finally {
      setSavingGeneral(false);
      setTimeout(() => setGeneralSaveMsg(null), 3000);
    }
  };

  // Toggle handler — calls toggle endpoint and updates local state
  const handleToggle = async (
    feature: string,
    value: boolean,
    setter: (v: boolean) => void,
  ) => {
    setter(value);
    try {
      await adminSettingsApi.toggleGeneralSetting(feature, value);
    } catch {
      // revert on failure
      setter(!value);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <PageHeader
        title="Settings"
        searchPlaceholder="Search drivers, vehicles, agreements, rentals..."
        notificationCount={5}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "-1rem", marginBottom: "-0.5rem" }}>
        <p style={{ fontSize: "0.75rem", color: "#6B7280", cursor: "pointer" }} onClick={() => router.push("/")}>Dashboard</p>
        <ChevronRight size={14} style={{ color: "#6B7280" }} />
        <p style={{ fontSize: "0.75rem", color: "#6B7280", cursor: "pointer", fontWeight: 700 }}>Settings</p>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div style={{ width: "280px", flexShrink: 0, backgroundColor: COLORS.BG_CARD, padding: "1rem", borderRadius: "8px", height: "100vh", overflowY: "auto", position: "sticky", top: "80px" }}>
          {SETTINGS_TABS.map((section) => (
            <div key={section.section} style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 600, color: COLORS.TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem", paddingLeft: "1rem" }}>
                {section.section}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "8px", border: "none", background: isActive ? COLORS.PRIMARY_MAIN : "transparent", color: isActive ? "#fff" : COLORS.TEXT_SECONDARY, fontSize: "0.9rem", fontWeight: isActive ? 600 : 500, cursor: "pointer", transition: "all 0.2s", width: "100%", textAlign: "left" }}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {generalSaveMsg && (
            <div style={{ background: generalSaveMsg.includes("success") ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${generalSaveMsg.includes("success") ? "#BBF7D0" : "#FECACA"}`, borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: generalSaveMsg.includes("success") ? "#15803D" : "#DC2626", marginBottom: "1rem" }}>
              {generalSaveMsg}
            </div>
          )}

          {activeTab === "general" && (
            <GeneralSettings
              maintenanceMode={maintenanceMode}
              setMaintenanceMode={(v) => handleToggle("maintenanceMode", v, setMaintenanceModeState)}
              newUserReg={newUserReg}
              setNewUserReg={(v) => handleToggle("allowNewUserRegistration", v, setNewUserRegState)}
              twoFactorAuth={twoFactorAuth}
              setTwoFactorAuth={(v) => handleToggle("twoFactorAuth", v, setTwoFactorAuthState)}
              ipWhitelisting={ipWhitelisting}
              setIpWhitelisting={(v) => handleToggle("ipWhitelisting", v, setIpWhitelistingState)}
              rbac={rbac}
              setRbac={(v) => handleToggle("rbacEnabled", v, setRbacState)}
              loading={generalSettingsLoading}
              onSave={saveGeneralSettings}
              saving={savingGeneral}
            />
          )}
          {activeTab === "users" && <RolesAndPermissions />}
          {activeTab === "payments" && <PaymentsAndFinance />}
          {activeTab === "agreements" && <AgreementsAndRentals />}
          {activeTab === "vehicles" && <VehiclesAndCompliance setActiveTab={setActiveTab} />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "reports" && <ReportsAndData />}
          {activeTab === "integrations" && <Integrations />}
          {activeTab === "system" && <SystemSettings />}
        </div>
      </div>
    </div>
  );
}
