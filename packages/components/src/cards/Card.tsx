import { cn } from "@spin-spot/utils";
import { Button } from "../buttons";

interface CardProps {
  labelName?: string;
  label?: string;
  className?: string;
  classNameButton?: string;
  labelButton?: string | React.ReactNode;
  image?: boolean;
  imageSrc?: string;
  onClick?: () => void;
}

export function Card({
  labelName,
  label,
  labelButton,
  onClick,
  className,
  classNameButton = "btn-primary",
  image = false,
  imageSrc,
}: CardProps) {
  return (
    <>
      <div className={cn("card break-all shadow-xl", className)}>
        {image && (
          <figure className="h-50">
            <img src={imageSrc} alt="Img" />
          </figure>
        )}
        <div className="card-body p-5">
          <h2 className="card-title text-2xl font-semibold">{labelName}</h2>
          <p>{label}</p>
          <div className="card-actions justify-start">
            <Button
              className={cn("btn-md", classNameButton)}
              label={labelButton}
              labelSize="text-md"
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}
