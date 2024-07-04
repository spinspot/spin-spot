import z from "zod";
import { baseModelDefinition } from "../definitions";

const tableDefinition = baseModelDefinition.extend({
  code: z
    .string()
    .nonempty("El código no puede estar vacío")
    .refine((val) => !isNaN(Number(val)), {
      message: "El código debe ser un número",
    }),
  isActive: z.boolean(),
});

export type ITable = z.infer<typeof tableDefinition>;

export const getTablesQueryDefinition = tableDefinition.partial();
export type TGetTablesQueryDefinition = z.infer<
  typeof getTablesQueryDefinition
>;

export const getTableParamsDefinition = tableDefinition.pick({ _id: true });
export type TGetTableParamsDefinition = z.infer<
  typeof getTableParamsDefinition
>;

export const createTableInputDefinition = tableDefinition.omit({ _id: true });
export type TCreateTableInputDefinition = z.infer<
  typeof createTableInputDefinition
>;

export const updateTableParamsDefinition = tableDefinition.pick({ _id: true });
export type TUpdateTableParamsDefinition = z.infer<
  typeof getTableParamsDefinition
>;

export const updateTableInputDefinition = tableDefinition.partial();
export type TUpdateTableInputDefinition = z.infer<
  typeof updateTableInputDefinition
>;
