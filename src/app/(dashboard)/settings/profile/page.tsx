"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/constants/Constant";
import {
  Shield,
  Smartphone,
  CheckCircle,
  Phone,
  Monitor,
  Mail,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import TabsNav from "@/components/TabsNav";
import InputField from "@/components/InputField";

import { Switch } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { profileApi } from "@/services/api/profile";

const SESSIONS = [
  {
    id: 1,
    device: 'MacBook Pro 16"',
    browser: "Chrome Browser",
    location: "San Francisco, US",
    ip: "192.168.1.104",
    status: "Current Session",
    statusColor: "#10B981",
    action: "Logout",
    icon: Monitor,
  },
  {
    id: 2,
    device: "iPhone 14 Pro",
    browser: "Safari Mobile",
    location: "San Francisco, US",
    ip: "172.20.10.2",
    status: "Active 2 hours ago",
    statusColor: "#6B7280",
    action: "Logout",
    icon: Smartphone,
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [enable2FA, setEnable2FA] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>(SESSIONS);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    jobTitle: "",
    department: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const [profileRes, sessionsRes] = await Promise.allSettled([
          profileApi.getProfile(),
          profileApi.getSessions(),
        ]);

        if (profileRes.status === "fulfilled" && profileRes.value?.data) {
          const data = profileRes.value.data;
          setProfileData(data);
          setEnable2FA(data.twoFactorEnabled || false);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            jobTitle: data.jobTitle || "",
            department: data.department || "",
          });
          if (data.profileImage || data.avatar) {
            setImagePreview((data.profileImage || data.avatar) as string);
          }
        }

        if (sessionsRes.status === "fulfilled" && sessionsRes.value?.data) {
          const apiSessions = (
            Array.isArray(sessionsRes.value.data) ? sessionsRes.value.data : []
          ).map((s: any, i: number) => ({
            id: s._id || i + 1,
            device: s.device || "Unknown Device",
            browser: s.browser || "Unknown Browser",
            location: s.location || "Unknown",
            ip: s.ip || "",
            status: s.status || "Active",
            statusColor: s.status === "Current Session" ? "#10B981" : "#6B7280",
            action: "Logout",
            icon:
              (s.device || "").toLowerCase().includes("phone") ||
                (s.device || "").toLowerCase().includes("iphone")
                ? Smartphone
                : Monitor,
          }));
          if (apiSessions.length) setSessions(apiSessions);
        }
      } catch (err) {
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors: any = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!profileData?.email?.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const fd = new FormData();
      if (formData.firstName) fd.append("firstName", formData.firstName);
      if (formData.lastName) fd.append("lastName", formData.lastName);
      if (formData.phone) fd.append("phone", formData.phone);
      if (formData.jobTitle) fd.append("jobTitle", formData.jobTitle);
      if (formData.department) fd.append("department", formData.department);
      if (profileImage) {
        fd.append("profileImage", profileImage);
      }

      const res = await profileApi.updateProfile(fd);
      if (res.success) {
        setProfileData(res.data);
        alert("Profile updated successfully");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const calculateStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "#D1D5DB" };
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "#EF4444" };
      case 2:
        return { score: 2, label: "Fair", color: "#F59E0B" };
      case 3:
        return { score: 3, label: "Good", color: "#10B981" };
      case 4:
        return { score: 4, label: "Strong", color: "#059669" };
      default:
        return { score: 1, label: "Weak", color: "#EF4444" };
    }
  };

  const strength = calculateStrength(newPassword);

  const tabs = [
    { name: "Personal Info" },
    { name: "Security" },
    { name: "Login Activity" },
    { name: "Permissions" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <PageHeader title="My Profile" />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            color: COLORS.SECONDARY_MAIN,
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          Dashboard
        </p>
        <ChevronRight size={14} style={{ color: COLORS.SECONDARY_MAIN }} />
        <p
          style={{
            fontSize: "0.75rem",
            color: COLORS.SECONDARY_MAIN,
            fontWeight: 700,
          }}
        >
          Profile
        </p>
      </div>
      <TabsNav
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        margin="0"
      />

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Left Column */}
        <div
          style={{
            width: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* Profile Summary Card */}
          <Card padding="2rem">
            <div style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  margin: "0 auto 1.5rem",
                  overflow: "hidden",
                  border: "4px solid #fff",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() =>
                  document.getElementById("profileImageInput")?.click()
                }
                title="Click to update profile image"
              >
                <img
                  src={
                    imagePreview ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                  }
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <input
                  type="file"
                  id="profileImageInput"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImage(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "170px",
                  right: "85px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#3B82F6",
                  border: "2px solid #fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <CheckCircle size={14} />
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: COLORS.TEXT_MAIN,
                  marginBottom: "0.25rem",
                }}
              >
                {profileData?.firstName
                  ? `${profileData.firstName} ${profileData.lastName || ""}`
                  : "Emily Johnson"}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: COLORS.TEXT_SECONDARY,
                  marginBottom: "1rem",
                }}
              >
                {profileData?.email || "johnson@example.com"}
              </p>

              <div
                style={{
                  display: "inline-block",
                  padding: "0.4rem 1.25rem",
                  borderRadius: "8px",
                  backgroundColor: "#EFF6FF",
                  color: "#3B82F6",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "1.5rem",
                }}
              >
                {profileData?.role || "Super Admin"}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ color: "#9CA3AF" }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                      Phone Number
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      {profileData?.phone}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ color: "#10B981" }}>
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                      Account Status
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#10B981",
                      }}
                    >
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Overview Card */}
          <Card padding="1.5rem">
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: COLORS.TEXT_MAIN,
                marginBottom: "1.25rem",
              }}
            >
              Security Overview
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: COLORS.TEXT_SECONDARY }}>Last Login</span>
                <span style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Today, 09:41 AM
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: COLORS.TEXT_SECONDARY }}>IP Address</span>
                <span style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  192.168.1.104
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: COLORS.TEXT_SECONDARY }}>Created</span>
                <span style={{ fontWeight: 600, color: COLORS.TEXT_MAIN }}>
                  Oct 12, 2022
                </span>
              </div>
            </div>
          </Card>

          {/* Additional Actions */}
          <Card padding="1rem">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#6B7280",
                }}
              >
                <Shield size={18} />
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Enable 2FA
                </span>
              </div>
              <Switch
                checked={enable2FA}
                onChange={setEnable2FA}
                className={`${enable2FA ? "bg-blue-600" : "bg-gray-200"}
                  relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                style={{
                  backgroundColor: enable2FA ? "#2563EB" : "#E5E7EB",
                  position: "relative",
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <span
                  aria-hidden="true"
                  className={`${enable2FA ? "translate-x-5" : "translate-x-0"}
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  style={{
                    display: "block",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    transform: enable2FA ? "translateX(20px)" : "translateX(0)",
                    transition: "transform 0.2s",
                    margin: "2px",
                  }}
                />
              </Switch>
            </div>
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #FEE2E2",
                textAlign: "center",
                cursor: "pointer",
                color: "#EF4444",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <AlertCircle
                size={16}
                style={{
                  display: "inline",
                  marginRight: "6px",
                  verticalAlign: "middle",
                }}
              />
              Logout all devices
            </div>
          </Card>
        </div>

        {/* Right Column (Tab Content) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {activeTab === "Personal Info" ? (
            <Card padding="2rem">
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "0.25rem",
                  }}
                >
                  Personal Details
                </h3>
                <p
                  style={{ fontSize: "0.85rem", color: COLORS.TEXT_SECONDARY }}
                >
                  Update your personal information and contact details.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <InputField
                  label="First Name *"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <InputField
                  label="Last Name *"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />

                <div style={{ position: "relative" }}>
                  <InputField
                    label="Email Address *"
                    value={profileData?.email || "dev@millionhits.net.au"}
                    readOnly
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "5px",
                      backgroundColor: "#EFF6FF",
                      color: "#3B82F6",
                      fontSize: "0.7rem",
                      padding: "0.5rem 0.9rem",
                      borderRadius: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Verified
                  </span>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: COLORS.TEXT_SECONDARY,
                      marginTop: "0.4rem",
                    }}
                  >
                    Contact Super Admin to change email address.
                  </p>
                </div>

                <InputField
                  label="Phone Number"
                  placeholder="(213) 555-1234"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <InputField
                  label="Job Title"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                />
                <InputField
                  label="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  borderTop: `1px solid ${COLORS.BORDER_MAIN}`,
                  paddingTop: "1.5rem",
                }}
              >
                <Button
                  variant="secondary"
                  style={{
                    padding: "0.6rem 1.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{
                    padding: "0.6rem 1.5rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Card>
          ) : activeTab === "Security" ? (
            <>
              {/* Change Password Card */}
              <Card padding="2rem">
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: COLORS.TEXT_MAIN,
                    marginBottom: "1.5rem",
                  }}
                >
                  Change Password
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    maxWidth: "600px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      style={inputStyle}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: COLORS.TEXT_MAIN,
                      }}
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      style={inputStyle}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div
                      style={{ display: "flex", gap: "4px", marginTop: "4px" }}
                    >
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          style={{
                            flex: 1,
                            height: "4px",
                            borderRadius: "2px",
                            backgroundColor:
                              level <= strength.score
                                ? strength.color
                                : "#D1D5DB",
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: COLORS.TEXT_SECONDARY,
                      }}
                    >
                      Password strength:{" "}
                      <span style={{ color: strength.color, fontWeight: 600 }}>
                        {strength.label}
                      </span>
                    </p>
                  </div>

                  <div style={{ marginTop: "0.5rem" }}>
                    <Button
                      variant="primary"
                      style={{ padding: "0.75rem 2rem" }}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Active Sessions Card */}
              <Card padding="0">
                <div
                  style={{
                    padding: "1.5rem",
                    borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: COLORS.TEXT_MAIN,
                      marginBottom: "0.25rem",
                    }}
                  >
                    Active Sessions
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: COLORS.TEXT_SECONDARY,
                    }}
                  >
                    Manage devices currently logged into your account.
                  </p>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                          backgroundColor: "#F9FAFB",
                        }}
                      >
                        <th style={headerStyle}>Device</th>
                        <th style={headerStyle}>Location</th>
                        <th style={headerStyle}>IP Address</th>
                        <th style={headerStyle}>Status</th>
                        <th style={{ ...headerStyle, textAlign: "right" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {SESSIONS.map((session) => (
                        <tr
                          key={session.id}
                          style={{
                            borderBottom: `1px solid ${COLORS.BORDER_MAIN}`,
                          }}
                        >
                          <td style={cellStyle}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <div style={{ color: "#6B7280" }}>
                                <session.icon size={20} />
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: COLORS.TEXT_MAIN,
                                  }}
                                >
                                  {session.device}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: COLORS.TEXT_SECONDARY,
                                  }}
                                >
                                  {session.browser}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td style={cellStyle}>
                            <span
                              style={{
                                fontSize: "0.85rem",
                                color: COLORS.TEXT_MAIN,
                              }}
                            >
                              {session.location}
                            </span>
                          </td>
                          <td style={cellStyle}>
                            <span
                              style={{
                                fontSize: "0.85rem",
                                color: COLORS.TEXT_MAIN,
                              }}
                            >
                              {session.ip}
                            </span>
                          </td>
                          <td style={cellStyle}>
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: session.statusColor,
                                fontWeight: 600,
                              }}
                            >
                              {session.status}
                            </span>
                          </td>
                          <td style={{ ...cellStyle, textAlign: "right" }}>
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                color:
                                  session.action === "Logout"
                                    ? "#6B7280"
                                    : "#EF4444",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {session.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            <Card padding="2rem">
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <h3 style={{ color: COLORS.TEXT_MAIN }}>
                  {activeTab} Settings
                </h3>
                <p style={{ color: COLORS.TEXT_SECONDARY }}>
                  The {activeTab} section is currently under development.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: `1px solid ${COLORS.BORDER_MAIN}`,
  fontSize: "0.9rem",
  outline: "none",
  color: COLORS.TEXT_MAIN,
};

const headerStyle: React.CSSProperties = {
  padding: "1rem 1.5rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: COLORS.TEXT_SECONDARY,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const cellStyle: React.CSSProperties = {
  padding: "1.25rem 1.5rem",
  verticalAlign: "middle",
};

function AlertCircle({
  size,
  style,
}: {
  size: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
