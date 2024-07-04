import {
  TCreateTableInputDefinition,
  TGetTablesQueryDefinition,
  TUpdateTableInputDefinition,
  TUpdateTableParamsDefinition,
  tableSchema,
} from "@spin-spot/models";
import { model } from "mongoose";

const Table = model("Table", tableSchema);

async function getTables(filter: TGetTablesQueryDefinition = {}) {
  const tables = await Table.find(filter);
  return tables;
}

async function getTable(_id: TGetTablesQueryDefinition["_id"]) {
  const table = await Table.findById(_id);
  return table;
}

async function createTable(data: TCreateTableInputDefinition) {
  const table = await Table.create(data);
  return table;
}

async function updateTable(
  _id: TUpdateTableParamsDefinition["_id"],
  data: TUpdateTableInputDefinition,
) {
  const table = await Table.findByIdAndUpdate(_id, data, { new: true });
  return table;
}

export const tableService = {
  getTables,
  getTable,
  createTable,
  updateTable,
} as const;
