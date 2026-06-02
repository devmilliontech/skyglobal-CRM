import React from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            <p
              onClick={() => {
                if (item.path) router.push(item.path);
              }}
              style={{
                fontSize: "0.75rem",
                color: "#6B7280",
                cursor: item.path ? "pointer" : "default",
                fontWeight: isLast ? 700 : 400,
              }}
            >
              {item.label}
            </p>
            {!isLast && <ChevronRight size={14} style={{ color: "#6B7280" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
