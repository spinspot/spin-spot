"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { TTeamDefinition, teamDefinition } from "@spin-spot/models";
import { cn } from "@spin-spot/utils";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../buttons";
import { Loader } from "../loaders";
import { TextInput } from "../text-inputs";

interface ModalProps {
  className?: string;
  teamName: string;
  setTeamName: (_name: string) => void;
  searchTexts: string[];
  suggestions: any[][];
  selectedUsers: (string | null)[];
  handleSearch: (_index: number, _text: string) => void;
  handleSelectUser: (_index: number, _user: any) => void;
  onClick: () => void;
  isPending?: boolean;
}

export function Modal({
  className,
  teamName,
  setTeamName,
  searchTexts,
  suggestions,
  selectedUsers,
  handleSearch,
  handleSelectUser,
  onClick,
  isPending,
}: ModalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useForm<TTeamDefinition>({
    resolver: zodResolver(teamDefinition),
    shouldFocusError: false,
    mode: "onBlur",
  });

  // Usamos watch para observar el valor del campo "name"
  const watchedTeamName = useWatch({
    control,
    name: "name",
    defaultValue: teamName,
  });

  // Actualizamos teamName cuando watchedTeamName cambie
  useEffect(() => {
    setTeamName(watchedTeamName);
  }, [watchedTeamName, setTeamName]);

  // Referencia al checkbox del modal
  const modalCheckboxRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = () => {
    onClick();
    if (modalCheckboxRef.current) {
      modalCheckboxRef.current.checked = false; // Cierra el modal
    }
  };

  return (
    <>
      {/* The button to open modal */}
      {isPending ? (
        <label htmlFor="my_modal_6" className="btn btn-disabled btn-lg w-72">
          <Loader />
          Inscribiendose...
        </label>
      ) : (
        <label htmlFor="my_modal_6" className="btn btn-primary btn-lg w-72">
          Inscribirse
        </label>
      )}

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="my_modal_6"
        className="modal-toggle"
        ref={modalCheckboxRef}
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="mb-3 text-2xl font-bold">Crea Tu Equipo!</h3>
          <TextInput
            placeholder="Nombre..."
            type="text"
            topRightLabel="Nombre del Equipo"
            className={`input-md ${errors.name ? "input-error" : "input-primary"}`}
            iconLeft={
              <UserGroupIcon className="text-primary dark:text-neutral h-6 w-6" />
            }
            bottomLeftLabel={errors.name?.message}
            {...register("name")}
          />
          {searchTexts.map((text, i) => (
            <div key={i} className="mt-2 flex w-full flex-col">
              <TextInput
                placeholder="Escribe aquí..."
                topLeftLabel="Ingrese nombre de su pareja"
                value={text || ""}
                onChange={(e) => handleSearch(i, e.target.value)}
                bottomLeftLabel={
                  selectedUsers[i] === null &&
                  (text?.length ?? 0) >= 1 &&
                  suggestions[i]?.length === 0
                    ? "No hay jugadores encontrados"
                    : ""
                }
              />
              {(text?.length ?? 0) >= 1 && suggestions[i]?.length !== 0 && (
                <ul className="bg-primary animate-slide-down mt-2 w-3/4 rounded-md">
                  {suggestions[i]?.map((user, index) => (
                    <li
                      key={index}
                      className="hover:bg-secondary cursor-pointer p-2 text-white"
                      onClick={() => handleSelectUser(i, user)}
                    >
                      {user.firstName} {user.lastName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <div className="modal-action flex gap-1">
            <label htmlFor="my_modal_6" className="btn btn-secondary btn-sm">
              Cerrar
            </label>
            <Button
              label="Unirse"
              className={cn("btn btn-primary btn-sm", className)}
              onClick={handleFormSubmit}
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
}
