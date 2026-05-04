import { Schema, model, type InferSchemaType } from "mongoose";

const vehicleSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      default: null,
    },
    make: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type Vehicle = InferSchemaType<typeof vehicleSchema>;

export const VehicleModel = model("Vehicle", vehicleSchema);
