import { cn } from "@spin-spot/utils";
import { forwardRef } from "react";

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  topLeftLabel?: string;
  topRightLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  options: string[]; // An array of labels, values will be generated automatically
  defaultOption?: string; // Default option label, value will be an empty string
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput(
    {
      className,
      topLeftLabel,
      topRightLabel,
      bottomLeftLabel,
      bottomRightLabel,
      options,
      defaultOption,
      ...props
    },
    ref,
  ) {
    const renderTopLabels = topLeftLabel || topRightLabel;
    const renderBottomLabels = bottomLeftLabel || bottomRightLabel;

    const generateValue = (label: any) => {
      return label.replace(/\s+/g, "-");
    };

    return (
      <label className="form-control w-full ">
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
        <div className="relative w-full">
          <select
            ref={ref}
            className={cn(
              "select select-bordered select-primary w-full ",
              className,
            )}
            defaultValue=""
            {...props}
          >
            {defaultOption && (
              <option value="" disabled>
                {defaultOption}
              </option>
            )}
            {options.map((label, index) => (
              <option key={index} value={generateValue(label)}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {renderBottomLabels && (
          <div className="label">
            {bottomLeftLabel && (
              <span className="label-text-alt text-error">
                {bottomLeftLabel}
              </span>
            )}
            {bottomRightLabel && (
              <span className="label-text-alt">{bottomRightLabel}</span>
            )}
          </div>
        )}
      </label>
    );
  },
);
