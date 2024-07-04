import {
  createTableInputDefinition,
  getTableParamsDefinition,
  getTablesQueryDefinition,
  updateTableInputDefinition,
  updateTableParamsDefinition,
} from "@spin-spot/models";
import { Request, Response } from "express";
import { tableService } from "./service";

async function createTable(req: Request, res: Response) {
  const tableData = createTableInputDefinition.parse(req.body);
  const table = await tableService.createTable(tableData);
  res.status(200).json(table);
}

async function getTables(req: Request, res: Response) {
  const query = getTablesQueryDefinition.parse(req.query);
  const tables = await tableService.getTables(query);
  return res.status(200).json(tables);
}

async function getTable(req: Request, res: Response) {
  const params = getTableParamsDefinition.parse(req.params);
  const table = await tableService.getTable(params._id);
  return res.status(200).json(table);
}

async function updateTable(req: Request, res: Response) {
  const params = updateTableParamsDefinition.parse(req.params);
  const input = updateTableInputDefinition.parse(req.body);
  const table = await tableService.updateTable(params._id, input);
  return res.status(200).json(table);
}

export const tableController = {
  getTable,
  getTables,
  createTable,
  updateTable,
} as const;
