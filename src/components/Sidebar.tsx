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
  History,
  LogOut,
  ChevronRight,
  User,
  BarChart2,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Drivers", path: "/drivers", icon: UserCircle },
  { name: "Users", path: "/users", icon: Users },
  { name: "Rentals", path: "/rentals", icon: Key, hasSub: true },
  { name: "Vehicles", path: "/vehicles", icon: Car },
  { name: "Owners", path: "/owners", icon: User, hasSub: true },
  { name: "Agreements", path: "/agreements", icon: FileBox, hasSub: true },
  { name: "Finance", path: "/finance", icon: Wallet, hasSub: true },
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
                {item.hasSub && (
                  <ChevronRight size={14} className={styles.chevron} />
                )}
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
              <img
                src="https://ui-avatars.com/api/?name=Alex+Morrison&background=3B82F6&color=fff"
                alt="User"
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Alex Morrison</p>
              <p className={styles.userRole}>Super Admin</p>
            </div>
            <button className={styles.logoutBtn}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
