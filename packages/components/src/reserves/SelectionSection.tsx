import { Pagination } from "../paginations";

interface SelectionSectionProps {
  isAdmin: string | null;
  options: string[];
  optinosNo: string[];
  eventType: string | null;
  indumentary: string | null;
  setEventType: (_eventType: string | null) => void;
  setIndumentary: (_indumentary: string | null) => void;
  resetInputs: (_length: number) => void;
  initialActive?: number | null;
  initialIndumentary?: number | null;
}

export function SelectionSection({
  isAdmin,
  options,
  optinosNo,
  setEventType,
  setIndumentary,
  resetInputs,
  initialActive,
  initialIndumentary,
}: SelectionSectionProps) {
  return (
    <div>
      <div className="mt-6 flex flex-col items-center">
        <h3 className="mr-1 text-lg">Seleccione modalidad: </h3>
        <Pagination
          labels={options}
          initialActiveIndex={initialActive ?? null}
          size="sm"
          onPageChange={(label) => {
            setEventType(label ?? null);
            resetInputs(
              isAdmin !== null
                ? label === "1V1"
                  ? 2
                  : 4
                : label === "1V1"
                  ? 1
                  : 3,
            );
          }}
          className="btn-neutral mt-2 min-w-28 text-nowrap"
        />
      </div>
      <div className="mt-6 flex flex-col items-center">
        <h3 className="mr-1 text-lg">¿Necesitas Raquetas y Pelotas? </h3>
        <Pagination
          labels={optinosNo}
          initialActiveIndex={initialIndumentary ?? null}
          size="sm"
          onPageChange={(label) => setIndumentary(label ?? null)}
          className="btn-neutral mt-2 min-w-28 text-nowrap"
        />
      </div>
    </div>
  );
}
