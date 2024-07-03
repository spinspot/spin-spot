import { cn } from "@spin-spot/utils";
import { Button } from "../buttons";

interface CardProps {
  labelName?: string;
  label?: string;
  className?: string;
  classNameButton?: string;
  labelButton?: string | React.ReactNode;
  image?: boolean;
  onClick?: () => void;
}

export function Card({
  labelName,
  label,
  labelButton,
  onClick,
  className,
  classNameButton = "btn-primary",
  image = true,
}: CardProps) {
  return (
    <>
      <div className={cn("card w-72 break-all shadow-xl", className)}>
        {image && (
          <figure className="h-50">
            <img src="/tournamentBackGround.svg" alt="Shoes" />
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
