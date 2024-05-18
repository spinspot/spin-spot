import { cn } from "@spin-spot/utils";
import React, { ChangeEvent } from "react";

interface TextInputIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  topLeftLabel?: string;
  topRightLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  svg?: "username" | "password" | "email"; // Nuevo atributo svg
}

export function TextInputIcon({
  type,
  className,
  placeholder,
  onChange,
  topLeftLabel,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  svg, // Nuevo atributo svg
}: TextInputIconProps) {
  const renderTopLabels = topLeftLabel || topRightLabel;
  const renderBottomLabels = bottomLeftLabel || bottomRightLabel;

  // Función para renderizar el SVG según el valor de svg
  const renderSVG = () => {
    switch (svg) {
      case "username":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
        );
      case "password":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "email":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <label className="form-control w-full max-w-xs">
      {renderTopLabels && (
        <div className="label">
          {topLeftLabel && (
            <span className="label-text text-base">{topLeftLabel}</span>
          )}
          {topRightLabel && (
            <span className="label-text-alt text-base">{topRightLabel}</span>
          )}
        </div>
      )}
      <label className="input input-bordered input-primary input-sm flex items-center gap-2">
        {renderSVG()} {/* Renderizar el SVG */}
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            "grow border-none outline-none focus:outline-none focus:ring-0",
            className,
          )}
          onChange={onChange}
        />
      </label>
      {renderBottomLabels && (
        <div className="label">
          {bottomLeftLabel && (
            <span className="label-text-alt">{bottomLeftLabel}</span>
          )}
          {bottomRightLabel && (
            <span className="label-text-alt">{bottomRightLabel}</span>
          )}
        </div>
      )}
    </label>
  );
}
