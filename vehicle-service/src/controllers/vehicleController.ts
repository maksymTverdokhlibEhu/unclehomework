import { Request, Response } from "express";
import mongoose from "mongoose";
import { VehicleModel } from "../models/Vehicle.model";
import { AppError } from "../utils/appError";
import { vehicleService } from "../servicrs/vehicleService";

type GetVehiclesQuery = {
  page?: string;
  limit?: string;
  user_id?: string;
};

type UpdateVehicleBody = {
  user_id?: string;
  model?: string;
  year?: number;
  make?: string;
};

export const createVehicle = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  const { user_id, model, year, make } = req.body;

  // if (!user_id || !model || year === undefined || !make) {
  //   throw new AppError("user_id, model, year and make are required", 400, {
  //     fields: ["user_id", "model", "year", "make"],
  //   });
  // }

  // const vehicle = await VehicleModel.create({
  //   user_id,
  //   model,
  //   year,
  //   make,
  // });

  const vehicle = await vehicleService.createVehicle({
    user_id,
    model,
    year,
    make,
  });

  res.status(201).json(vehicle);
};

export const getVehicles = async (
  req: Request<unknown, unknown, unknown, GetVehiclesQuery>,
  res: Response,
): Promise<void> => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const userId = req.query.user_id;

  if (!Number.isInteger(page) || page < 1) {
    throw new AppError("page must be a positive integer", 400, {
      field: "page",
    });
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AppError("limit must be an integer between 1 and 100", 400, {
      field: "limit",
    });
  }

  const filter = userId ? { user_id: userId } : {};
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    VehicleModel.countDocuments(filter),
    VehicleModel.find(filter).skip(skip).limit(limit),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  res.status(200).json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

export const getVehicleById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const vehicle = await VehicleModel.findById(id);

  if (!vehicle) {
    throw new AppError("Vehicle not found", 404, {
      id,
    });
  }

  res.status(200).json(vehicle);
};

export const updateVehicleById = async (
  req: Request<{ id: string }, unknown, UpdateVehicleBody>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid vehicle id", 400, {
      field: "id",
    });
  }

  const allowedFields: Array<keyof UpdateVehicleBody> = [
    "user_id",
    "model",
    "year",
    "make",
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(
      ([key, value]) =>
        allowedFields.includes(key as keyof UpdateVehicleBody) &&
        value !== undefined,
    ),
  ) as UpdateVehicleBody;

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      "At least one of user_id, model, year or make must be provided",
      400,
      {
        fields: allowedFields,
      },
    );
  }

  const updatedVehicle = await VehicleModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedVehicle) {
    throw new AppError("Vehicle not found", 404, {
      id,
    });
  }

  res.status(200).json(updatedVehicle);
};

export const deleteVehicleById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid vehicle id", 400, {
      field: "id",
    });
  }

  const deletedVehicle = await VehicleModel.findByIdAndDelete(id);

  if (!deletedVehicle) {
    throw new AppError("Vehicle not found", 404, {
      id,
    });
  }

  res.status(200).json({
    message: "Vehicle deleted",
    id,
  });
};
