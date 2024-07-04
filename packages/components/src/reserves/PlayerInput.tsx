import { TextInput } from "../text-inputs";

interface PlayerInputProps {
  searchTexts: string[];
  suggestions: any[][];
  selectedUsers: (string | null)[];
  handleSearch: (_index: number, _text: string) => void;
  handleSelectUser: (_index: number, _user: any) => void;
}

export function PlayerInput({
  searchTexts,
  suggestions,
  selectedUsers,
  handleSearch,
  handleSelectUser,
}: PlayerInputProps) {
  return (
    <>
      {searchTexts.map((text, i) => (
        <div
          key={i}
          className="mt-2 flex w-full flex-col items-center justify-center"
        >
          <TextInput
            placeholder="Type here"
            topLeftLabel="Ingrese nombre del jugador:"
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
    </>
  );
}
