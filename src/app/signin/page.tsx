"use client";
import { COLORS } from "@/constants/Constant";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Car,
  BarChart3,
  Shield,
  Info,
  LifeBuoy,
  CarFront,
} from "lucide-react";
import { apiFetch } from "@/services/api/client";

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch<any>("/admin/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (res.data?.token) {
        localStorage.setItem("admin_token", res.data.token);
        if (res.data?.user) {
          localStorage.setItem("admin_user", JSON.stringify(res.data.user));
        }
        
        setTimeout(() => {
          router.push("/");
        }, 300);
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: COLORS.BG_CARD,
      }}
    >
      {/* Left Side: Branding */}
      {!isMobile && (
        <div
          style={{
            flex: 1.1,
            backgroundColor: COLORS.PRIMARY_MAIN,
            flexDirection: "column",
            padding: "3rem",
            color: COLORS.BG_CARD,
            position: "relative",
          }}
        >
          <div
            style={{
              marginTop: "6rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                marginTop: "1rem",
              }}
            >
              <CarFront size={40} style={{ marginBottom: "5px" }} />
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: "1",
                marginBottom: "10px",
              }}
            >
              iRent
            </h1>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: 0.8,
                fontWeight: 500,
              }}
            >
              Super Admin Portal
            </p>
          </div>

          <div style={{ maxWidth: "480px" }}>
            <h2
              style={{
                fontSize: "2.75rem",
                fontWeight: 700,
                marginRight: "1.5rem",
                lineHeight: 1.2,
                marginBottom: "1.5rem",
              }}
            >
              Complete Fleet Control
            </h2>
            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.6,
                opacity: 0.9,
                marginBottom: "4rem",
              }}
            >
              Manage vehicles, rentals, agreements, drivers, and platform
              finance from one control centre.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              <Car size={20} />
              Fleet Management
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              <BarChart3 size={20} />
              Analytics
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              <Shield size={20} />
              Security
            </div>
          </div>
        </div>
      )}

      {/* Right Side: Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "4rem",
          backgroundColor: COLORS.BG_CARD,
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "1rem",
            }}
          >
            Welcome Back
          </h2>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "2.5rem",
            }}
          >
            Sign in to the Super Admin Portal
          </h3>

          <form
            onSubmit={handleSignIn}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {error && (
              <div style={{ padding: "0.75rem", backgroundColor: "#FEF2F2", color: "#DC2626", borderRadius: "8px", fontSize: "0.9rem", border: "1px solid #F87171" }}>
                {error}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="email"
                  placeholder="admin@irent.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 3rem 0.85rem 1rem",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: COLORS.BG_CARD,
                    outline: "none",
                  }}
                />
                <Mail
                  style={{
                    position: "absolute",
                    right: "1rem",
                    color: "#9CA3AF",
                  }}
                  size={18}
                />
              </div>
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
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 3rem 0.85rem 1rem",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: COLORS.BG_CARD,
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "1rem",
                    color: "#9CA3AF",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "-0.5rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  color: "#4B5563",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" style={{ cursor: "pointer" }} />
                Remember me
              </label>
              <Link
                href="#"
                style={{
                  fontSize: "0.9rem",
                  color: COLORS.PRIMARY_MAIN,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-btn-hover"
              style={{
                width: "100%",
                padding: "0.9rem",
                backgroundColor: loading ? "#9CA3AF" : COLORS.PRIMARY_MAIN,
                color: COLORS.BG_CARD,
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "0.5rem",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              margin: "2rem 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#E5E7EB",
              }}
            ></div>
            <div
              style={{
                padding: "0 1rem",
                fontSize: "0.85rem",
                color: "#9CA3AF",
              }}
            >
              Or continue with
            </div>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#E5E7EB",
              }}
            ></div>
          </div>

          <button
            style={{
              width: "100%",
              padding: "0.9rem",
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#111827",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.64 2.34 30.18 0 24 0 14.62 0 6.51 5.48 2.56 13.44l8.04 6.24C12.58 13.06 17.83 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.68c-.55 2.96-2.2 5.47-4.68 7.17l7.2 5.6c4.2-3.87 6.3-9.57 6.3-17.02z"
              />
              <path
                fill="#FBBC05"
                d="M10.6 28.68A14.5 14.5 0 0 1 9.5 24c0-1.62.28-3.18.78-4.68l-8.04-6.24A24 24 0 0 0 0 24c0 3.86.92 7.5 2.56 10.56l8.04-6.24z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.6c-2 1.34-4.56 2.12-8.7 2.12-6.17 0-11.42-3.56-13.4-8.68l-8.04 6.24C6.51 42.52 14.62 48 24 48z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            marginTop: "3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
              }}
            >
              <Link
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  color: "#6B7280",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <LifeBuoy size={16} />
                Support
              </Link>
              <Link
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  color: "#6B7280",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <Shield size={16} />
                Security
              </Link>
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: "#9CA3AF",
              }}
            >
              Last login: Dec 15, 2024 10:30 AM
            </div>
          </div>

          <div
            style={{
              backgroundColor: COLORS.PRIMARY_LIGHT,
              border: "1px solid #DBEAFE",
              borderRadius: "8px",
              padding: "0.85rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <Info
              style={{ color: COLORS.PRIMARY_MAIN, flexShrink: 0 }}
              size={20}
            />
            <div
              style={{
                fontSize: "0.85rem",
                color: COLORS.INFO_DARK,
              }}
            >
              <strong
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "0.1rem",
                }}
              >
                Security Notice
              </strong>
              This is a secure admin portal. All activities are monitored.
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .login-btn-hover:hover {
          background-color: #1d4ed8 !important;
        }
      `}</style>
    </div>
  );
}
