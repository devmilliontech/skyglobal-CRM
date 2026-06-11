"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Key,
  Car,
  Wallet,
  FileBox,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  User,
  BarChart2,
  TicketPercent,
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useEffect, useState } from "react";
import { profileApi } from "@/services/api/profile";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Drivers", path: "/drivers", icon: UserCircle },
  { name: "Users", path: "/users", icon: Users },
  { name: "Rentals", path: "/rentals", icon: Key, hasSub: true },
  { name: "Vehicles", path: "/vehicles", icon: Car },
  { name: "Owners", path: "/owners", icon: User, hasSub: true },
  { name: "Agreements", path: "/agreements", icon: FileBox, hasSub: true },
  { name: "Finance", path: "/finance", icon: Wallet, hasSub: true },
  { name: "Promo Codes", path: "/promo-codes", icon: TicketPercent },
  { name: "Reports", path: "/reports", icon: BarChart2 },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Admin Settings", path: "/admin-settings", icon: Settings },
];

const bottomItems = [
  { name: "Help / Support", path: "/support", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [liveUserName, setLiveUserName] = useState<string>("Admin");
  const [liveUserAvatar, setLiveUserAvatar] = useState<string>(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuoiVnnWu_QbtFist_W7Hbz2V4drhwXDVyiw&s",
  );

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      try {
        const response = await profileApi.getProfile();
        if (response?.data) {
          const data = response.data;

          // Construct Full Name if present
          if (data.firstName) {
            setLiveUserName(`${data.firstName} ${data.lastName || ""}`.trim());
          }

          // Set dynamic avatar url fallback sequence
          const avatarUrl = data.profileImage || data.avatar;
          if (avatarUrl) {
            setLiveUserAvatar(avatarUrl);
          }
        }
      } catch (error) {
        console.error("Failed to sync profile status to header:", error);
      }
    };

    fetchHeaderProfile();
  }, []);

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    ["admin_token", "admin_user", "token", "jwt"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    router.replace("/signin");
  };

  return (
    <aside className="sidebar-container">
      <div className={styles.sidebarContent}>
        <div className={styles.topSection}>
          <div className={styles.logoSection} onClick={() => router.push("/")}>
            <div className={styles.logoIcon}>ir</div>
            <div className={styles.logoText}>
              <h1>iRent</h1>
              <span>SUPER ADMIN PORTAL</span>
            </div>
          </div>

          <nav className={styles.navigation}>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`${styles.navLink} ${pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path)) ? styles.active : ""}`}
              >
                <item.icon size={18} className={styles.icon} />
                <span className={styles.navLabel}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.footer}>
          <div className={styles.divider} />

          <div className={styles.bottomNav}>
            {bottomItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`${styles.navLink} ${pathname === item.path ? styles.active : ""}`}
              >
                <item.icon size={18} />
                <span
                  className={styles.navLabel}
                  style={{ marginLeft: "10px" }}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          <div
            className={styles.userProfile}
            onClick={() => router.push("/settings/profile")}
          >
            <div className={styles.avatar}>
              <img src={liveUserAvatar} alt="User" />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{liveUserName}</p>
              <p className={styles.userRole}>Super Admin</p>
            </div>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
