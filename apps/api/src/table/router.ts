import { Router } from "express";
import { tableController } from "./controller";

const tableRouter = Router();

tableRouter.get("/", tableController.getTables);
tableRouter.get("/:_id", tableController.getTable);
tableRouter.post("/", tableController.createTable);
tableRouter.put("/:_id", tableController.updateTable);

export { tableRouter };
