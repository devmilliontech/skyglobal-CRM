import { COLORS } from "@/constants/Constant";
import React from "react";

const inputStyle: React.CSSProperties = {
  padding: "0.6rem 1rem",
  borderRadius: "8px",
  border: "1px solid #E5E7EB",
  background: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
  color: COLORS.TEXT_MAIN,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#374151",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  wrapperStyle?: React.CSSProperties;
  isTextArea?: boolean;
  infoIcon?: React.ReactNode;
}

const InputField = ({
  label,
  wrapperStyle = {},
  isTextArea = false,
  infoIcon,
  ...props
}: InputFieldProps) => {
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
      {label && (
        <label style={labelStyle}>
          {label}
          {infoIcon}
        </label>
      )}

      {isTextArea ? (
        <textarea
          style={{ ...inputStyle, minHeight: "100px", resize: "vertical" } as React.CSSProperties}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input style={inputStyle} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </div>
  );
};

export default InputField;
