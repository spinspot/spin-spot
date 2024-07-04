import {
  ITable,
  TCreateTableInputDefinition,
  TUpdateTableInputDefinition,
  TUpdateTableParamsDefinition,
} from "@spin-spot/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";

export async function createTable(input: TCreateTableInputDefinition) {
  const res = await api.post("/tables", { body: input });
  const table: ITable = await res.json();
  return table;
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createTable"],
    mutationFn: createTable,

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["getTables"] });
    },
  });
}

export async function updateTable({
  _id,
  ...input
}: {
  _id: TUpdateTableParamsDefinition["_id"];
} & TUpdateTableInputDefinition) {
  const res = await api.put("/tables/" + encodeURIComponent(`${_id}`), {
    body: input,
  });
  const table: ITable = await res.json();
  return table;
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTable"],
    mutationFn: updateTable,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getTable", data._id] });
      queryClient.invalidateQueries({ queryKey: ["getTables"] });
    },
  });
}
