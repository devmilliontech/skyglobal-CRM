import { COLORS } from "@/constants/Constant";
import { ChevronDown } from "lucide-react";
import React from "react";

const inputStyle: React.CSSProperties = {
  padding: "0.6rem",
  paddingRight: "2rem",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  appearance: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#374151",
  fontWeight: 500,
};

type OptionType =
  | string
  | {
      label: string;
      value: string | number;
    };

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: OptionType[];
  wrapperStyle?: React.CSSProperties;
  placeholder?: string;
}

const SelectField = ({
  label,
  options,
  wrapperStyle = {},
  placeholder = "Select option",
  ...props
}: SelectFieldProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
        width: "100%",
        ...wrapperStyle,
      }}
    >
      {label && <label style={labelStyle}>{label}</label>}

      <div style={{ position: "relative", width: "100%" }}>
        <select
          style={inputStyle}
          {...(props.value !== undefined ? {} : { defaultValue: "" })}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt, index) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const text = typeof opt === "string" ? opt : opt.label;

            return (
              <option key={index} value={value}>
                {text}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: COLORS.TEXT_MUTED,
          }}
        />
      </div>
    </div>
  );
};

export default SelectField;
