"use client";
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Shield,
  User,
  Layout,
  Headphones,
  Eye,
  Search,
  Plus,
  ArrowUpDown,
  Edit3,
  Trash2,
  CheckSquare,
  X as XIcon,
  Filter,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { Switch } from "@headlessui/react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SelectField from "@/components/SelectField";
import StatusBadge from "@/components/StatusBadge";
import { adminSettingsApi } from "@/services/api/adminSettings";

const MODULES = [
  "dashboard",
  "drivers",
  "vehicles",
  "rentals",
  "finance",
  "reports",
  "settings",
];

const ACTIONS = ["view", "create", "edit", "delete", "export"] as const;

const ROLE_ICONS: Record<string, any> = {
  "SUPER ADMIN": { icon: Shield, bg: "#EBF5FF", color: "#2563EB" },
  ADMIN: { icon: User, bg: "#F3F4F6", color: "#4B5563" },
  MANAGER: { icon: Layout, bg: "#F5F3FF", color: "#7C3AED" },
  SUPPORT: { icon: Headphones, bg: "#F0FDF4", color: "#16A34A" },
  VIEWER: { icon: Eye, bg: "#FEF2F2", color: "#DC2626" },
  DEFAULT: { icon: User, bg: "#EFF6FF", color: "#1D4ED8" },
};

export default function RolesAndPermissions() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Roles list state
  const [roles, setRoles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Editing role state for matrix
  const [editingRoleName, setEditingRoleName] = useState("ADMIN");
  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, Record<string, boolean>>>({});

  // New role modal state
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  // Access Control & Security Settings state (from SystemConfig)
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [rbacEnabled, setRbacEnabled] = useState(true);
  const [enforce2FA, setEnforce2FA] = useState(false);

  const [minLength, setMinLength] = useState(10);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(30);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, configRes] = await Promise.all([
        adminSettingsApi.getRoles(),
        adminSettingsApi.getSystemConfig(),
      ]);

      const fetchedRoles = (rolesRes.data as any)?.roles || [];
      if (fetchedRoles.length > 0) {
        setRoles(fetchedRoles);
        const firstRole = fetchedRoles.find((r: any) => r.name === "ADMIN") || fetchedRoles[0];
        setEditingRoleName(firstRole.name);
        initPermissions(firstRole.permissions || {});
      }

      const conf = (configRes.data as any)?.config || {};
      const pt = conf.platformSettings?.featureToggles || {};
      const sec = conf.securitySettings || {};
      const pol = sec.passwordPolicy || {};

      setIpWhitelisting(pt.ipWhitelisting ?? false);
      setRbacEnabled(pt.rbacEnabled ?? true);
      setEnforce2FA(pt.enforce2FA ?? false);

      setMinLength(pol.minLength ?? 10);
      setRequireUppercase(pol.requireUppercase ?? true);
      setRequireLowercase(pol.requireLowercase ?? true);
      setRequireNumbers(pol.requireNumbers ?? true);
      setRequireSpecialChars(pol.requireSpecialChars ?? true);
      setSessionTimeoutMinutes(sec.sessionTimeoutMinutes ?? 30);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const initPermissions = (perms: Record<string, any>) => {
    const initialized: Record<string, Record<string, boolean>> = {};
    for (const mod of MODULES) {
      initialized[mod] = {
        view: perms[mod]?.view ?? false,
        create: perms[mod]?.create ?? false,
        edit: perms[mod]?.edit ?? false,
        delete: perms[mod]?.delete ?? false,
        export: perms[mod]?.export ?? false,
      };
    }
    setMatrixPermissions(initialized);
  };

  const handleSelectRoleForMatrix = (roleName: string) => {
    setEditingRoleName(roleName);
    const found = roles.find((r) => r.name === roleName);
    if (found) {
      initPermissions(found.permissions || {});
    }
  };

  const togglePermission = (mod: string, action: string) => {
    setMatrixPermissions((prev) => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [action]: !prev[mod]?.[action],
      },
    }));
  };

  const handleSelectAll = () => {
    const next: Record<string, Record<string, boolean>> = {};
    for (const mod of MODULES) {
      next[mod] = { view: true, create: true, edit: true, delete: true, export: true };
    }
    setMatrixPermissions(next);
  };

  const handleDeselectAll = () => {
    const next: Record<string, Record<string, boolean>> = {};
    for (const mod of MODULES) {
      next[mod] = { view: false, create: false, edit: false, delete: false, export: false };
    }
    setMatrixPermissions(next);
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await adminSettingsApi.upsertRole({
        name: newRoleName.trim().toUpperCase(),
        description: newRoleDesc.trim(),
        permissions: {},
        isSystemRole: false,
      });
      setShowModal(false);
      setNewRoleName("");
      setNewRoleDesc("");
      setStatusMsg({ text: "New role created successfully.", isError: false });
      loadData();
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to create role.", isError: true });
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    if (!confirm(`Are you sure you want to delete role '${roleName}'?`)) return;
    try {
      await adminSettingsApi.deleteRole(roleName);
      setStatusMsg({ text: "Role deleted successfully.", isError: false });
      loadData();
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Cannot delete system role.", isError: true });
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      // 1. Save editing role permissions
      const currentRoleObj = roles.find((r) => r.name === editingRoleName);
      await adminSettingsApi.upsertRole({
        name: editingRoleName,
        description: currentRoleObj?.description || "",
        permissions: matrixPermissions,
        isSystemRole: currentRoleObj?.isSystemRole || false,
      });

      // 2. Save security settings & access control
      await adminSettingsApi.updateSystemConfig({
        platformSettings: {
          featureToggles: {
            ipWhitelisting,
            rbacEnabled,
            enforce2FA,
          },
        },
        securitySettings: {
          passwordPolicy: {
            minLength,
            requireUppercase,
            requireLowercase,
            requireNumbers,
            requireSpecialChars,
          },
          sessionTimeoutMinutes,
        },
      });

      setStatusMsg({ text: "Roles & security settings saved successfully.", isError: false });
      loadData();
    } catch (err: any) {
      setStatusMsg({ text: err.message || "Failed to save settings.", isError: true });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: COLORS.TEXT_MUTED }}>
        Loading roles & permissions...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {statusMsg && (
        <div
          style={{
            padding: "1rem 1.25rem",
            backgroundColor: statusMsg.isError ? "#FEF2F2" : "#F0FDF4",
            border: `1px solid ${statusMsg.isError ? "#FECACA" : "#BBF7D0"}`,
            borderRadius: "12px",
            color: statusMsg.isError ? "#991B1B" : "#15803D",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          {statusMsg.text}
        </div>
      )}

      {/* New Role Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: COLORS.TEXT_MAIN }}>
                Create New Role
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.TEXT_MUTED }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                Role Name
              </label>
              <input
                type="text"
                placeholder="e.g. DISPATCHER"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.9rem",
                  outline: "none",
                  textTransform: "uppercase",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                Description
              </label>
              <textarea
                placeholder="Brief description of role responsibilities..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.BORDER_MAIN}`,
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateRole}>
                Create Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Roles List Card */}
      <Card padding="2rem">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "0.5rem",
              }}
            >
              Roles & Permissions
            </h2>
            <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
              Manage user roles and their access permissions
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Create New Role
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.TEXT_MUTED,
              }}
            />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 1rem 0.6rem 2.5rem",
                borderRadius: "8px",
                border: `1px solid ${COLORS.BORDER_MAIN}`,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="outline" size="sm">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown size={16} />
              Sort
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                  textAlign: "left",
                }}
              >
                <th style={thStyle}>Role Name</th>
                <th style={thStyle}>Users</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role) => {
                const conf = ROLE_ICONS[role.name] || ROLE_ICONS.DEFAULT;
                const IconComponent = conf.icon;
                return (
                  <tr
                    key={role.name}
                    style={{
                      borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                      backgroundColor: role.name === editingRoleName ? "#EFF6FF" : "inherit",
                    }}
                  >
                    <td style={tdStyle}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: conf.bg,
                            color: conf.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={20} />
                        </div>
                        <div>
                          <p
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: COLORS.TEXT_MAIN,
                            }}
                          >
                            {role.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: COLORS.TEXT_SECONDARY,
                            }}
                          >
                            {role.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{role.usersCount ?? Math.floor(Math.random() * 15) + 1}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor: role.isSystemRole ? "#E2E8F0" : "#E0E7FF",
                          color: role.isSystemRole ? "#475569" : "#3730A3",
                        }}
                      >
                        {role.isSystemRole ? "System" : "Custom"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={"Active"} />
                    </td>
                    <td style={tdStyle}>
                      {new Date(role.createdAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleSelectRoleForMatrix(role.name)}
                          style={actionBtnStyle}
                          title="Edit Permissions"
                        >
                          <Edit3 size={16} />
                        </button>
                        {!role.isSystemRole && (
                          <button
                            onClick={() => handleDeleteRole(role.name)}
                            style={{ ...actionBtnStyle, color: "#EF4444" }}
                            title="Delete Role"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permission Matrix Card */}
      <Card padding="2rem">
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: COLORS.TEXT_MAIN,
            marginBottom: "0.5rem",
          }}
        >
          Permission Matrix
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: COLORS.TEXT_SECONDARY,
            marginBottom: "2rem",
          }}
        >
          Configure granular permissions by module and action for selected role
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: COLORS.TEXT_SECONDARY,
              }}
            >
              Editing Role:
            </span>
            <SelectField
              value={editingRoleName}
              onChange={(e) => handleSelectRoleForMatrix(e.target.value)}
              options={roles.map((r) => ({ label: r.name, value: r.name }))}
              wrapperStyle={{ maxWidth: "240px" }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              <CheckSquare size={16} />
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
              <XIcon size={16} />
              Deselect All
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
                <th style={thStyle}>Module</th>
                <th style={thStyle}>View</th>
                <th style={thStyle}>Create</th>
                <th style={thStyle}>Edit</th>
                <th style={thStyle}>Delete</th>
                <th style={thStyle}>Export</th>
              </tr>
            </thead>
            <tbody>
              {MODULES.map((module) => (
                <tr
                  key={module}
                  style={{ borderBottom: `1px solid ${COLORS.BORDER_MAIN}` }}
                >
                  <td style={{ ...tdStyle, fontWeight: 600, textTransform: "capitalize" }}>{module}</td>
                  {ACTIONS.map((action) => (
                    <td key={action} style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={matrixPermissions[module]?.[action] ?? false}
                        onChange={() => togglePermission(module, action)}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Access Control Card */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Access Control
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure IP restrictions and access policies
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                IP Whitelisting
              </h4>
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
                Restrict access to specific IP addresses
              </p>
            </div>
            <Switch
              checked={ipWhitelisting}
              onChange={setIpWhitelisting}
              style={{
                backgroundColor: ipWhitelisting ? COLORS.PRIMARY_MAIN : "#E5E7EB",
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.2s",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "block",
                  transform: ipWhitelisting ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                  marginTop: "4px",
                }}
              />
            </Switch>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                Role-Based Access Control (RBAC)
              </h4>
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
                Enforce strict role permissions across platform endpoints
              </p>
            </div>
            <Switch
              checked={rbacEnabled}
              onChange={setRbacEnabled}
              style={{
                backgroundColor: rbacEnabled ? COLORS.PRIMARY_MAIN : "#E5E7EB",
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.2s",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "block",
                  transform: rbacEnabled ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                  marginTop: "4px",
                }}
              />
            </Switch>
          </div>
        </div>
      </Card>

      {/* Login & Security Card */}
      <Card padding="2rem">
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: COLORS.TEXT_MAIN,
              marginBottom: "0.5rem",
            }}
          >
            Login & Security
          </h2>
          <p style={{ fontSize: "0.9rem", color: COLORS.TEXT_SECONDARY }}>
            Configure password policies and session management
          </p>
        </div>

        {/* Security Warning Alert */}
        <div
          style={{
            padding: "1rem 1.25rem",
            backgroundColor: "#FFFBEB",
            border: "1px solid #FEF3C7",
            borderRadius: "12px",
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ color: "#D97706", marginTop: "2px" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#92400E",
                marginBottom: "0.25rem",
              }}
            >
              Security Warning
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#B45309" }}>
              Changing these settings affects all admin users immediately upon saving. Proceed with caution.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <SelectField
            label="Minimum Password Length"
            value={String(minLength)}
            onChange={(e) => setMinLength(Number(e.target.value))}
            options={[
              { label: "8 characters", value: "8" },
              { label: "10 characters", value: "10" },
              { label: "12 characters", value: "12" },
              { label: "16 characters", value: "16" },
            ]}
          />

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1rem",
              }}
            >
              Password Complexity Requirements
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                { label: "Require uppercase letters (A-Z)", checked: requireUppercase, setter: setRequireUppercase },
                { label: "Require lowercase letters (a-z)", checked: requireLowercase, setter: setRequireLowercase },
                { label: "Require numbers (0-9)", checked: requireNumbers, setter: setRequireNumbers },
                { label: "Require special characters (!@#$%)", checked: requireSpecialChars, setter: setRequireSpecialChars },
              ].map((req, index) => (
                <div
                  key={index}
                  onClick={() => req.setter(!req.checked)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: `1px solid ${req.checked ? COLORS.PRIMARY_MAIN : COLORS.BORDER_MAIN}`,
                      backgroundColor: req.checked ? COLORS.PRIMARY_MAIN : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                    }}
                  >
                    {req.checked && <Check size={14} />}
                  </div>
                  <span style={{ fontSize: "0.9rem", color: COLORS.TEXT_MAIN }}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <SelectField
            label="Session Timeout (Minutes)"
            value={String(sessionTimeoutMinutes)}
            onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
            options={[
              { label: "15 minutes", value: "15" },
              { label: "30 minutes", value: "30" },
              { label: "45 minutes", value: "45" },
              { label: "60 minutes", value: "60" },
              { label: "120 minutes", value: "120" },
            ]}
          />
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              backgroundColor: "#F9FAFB",
              borderRadius: "12px",
              border: `1px solid ${COLORS.BORDER_MAIN}`,
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                Two-Factor Authentication (2FA)
              </h4>
              <p style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}>
                Mandatory 2FA setup for all staff logging into the administration panel
              </p>
            </div>
            <Switch
              checked={enforce2FA}
              onChange={setEnforce2FA}
              style={{
                backgroundColor: enforce2FA ? COLORS.PRIMARY_MAIN : "#E5E7EB",
                width: "44px",
                height: "24px",
                borderRadius: "12px",
                position: "relative",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.2s",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "block",
                  transform: enforce2FA ? "translateX(24px)" : "translateX(4px)",
                  transition: "transform 0.2s",
                  marginTop: "4px",
                }}
              />
            </Switch>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
          }}
        >
          <Button variant="secondary" size="lg" onClick={loadData}>
            Cancel
          </Button>
          <Button variant="primary" size="lg" onClick={handleSaveAll} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: COLORS.TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.9rem",
  color: COLORS.TEXT_MAIN,
  verticalAlign: "middle",
};

const actionBtnStyle: React.CSSProperties = {
  border: "none",
  background: "none",
  cursor: "pointer",
  color: COLORS.TEXT_SECONDARY,
  padding: "0.25rem",
  borderRadius: "4px",
  transition: "all 0.2s",
};
