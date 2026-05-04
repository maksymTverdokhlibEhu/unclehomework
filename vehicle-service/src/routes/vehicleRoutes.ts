import { Router } from "express";
import {
	createVehicle,
	deleteVehicleById,
	getVehicleById,
	getVehicles,
	updateVehicleById,
} from "../controllers/vehicleController";

const userController = Router();

userController.post("/vehicle", createVehicle);
userController.get("/vehicles", getVehicles);
userController.get("/vehicles/:id", getVehicleById);
userController.put("/vehicles/:id", updateVehicleById);
userController.delete("/vehicles/:id", deleteVehicleById);

export default userController;
