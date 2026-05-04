import type { Request, Response } from "express";
import { Types } from "mongoose";
import { UserModel } from "../models/User";
import { makeRequest } from "../helpers/makeRequest";

export async function createUser(req: Request, res: Response) {
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name || !email) {
    return res.status(400).json({ message: "name and email are required" });
  }

  try {
    const user = await UserModel.create({ name, email });

    const rabbitChannel = req.app.locals.rabbitChannel;
    if (rabbitChannel) {
      rabbitChannel.publish(
        "user.events",
        "user.created",
        Buffer.from(JSON.stringify({ id: user.id, email })),
      );
    }

    return res
      .status(201)
      .json({ message: "User has been created", statusCode: 201 });
  } catch (error) {
    return res.status(500).json({ message: "failed to create user", error });
  }
}

export async function getUsers(req: Request, res: Response) {
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const offset = Math.max(0, Number(req.query.offset) || 0);

  try {
    const [users, total] = await Promise.all([
      UserModel.find().skip(offset).limit(limit).lean(),
      UserModel.countDocuments(),
    ]);

    return res.status(200).json({
      items: users,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + users.length < total,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "failed to get users", error });
  }
}

export async function getUserById(req: Request, res: Response) {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid user id" });
  }

  try {
    const user = await UserModel.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const response = await makeRequest(
      JSON.stringify({ id }),
      req.app.locals.rabbitConnection,
      req.app.locals.rabbitChannel,
      "vehicle.get",
    );

    return res.status(200).json({
      user,
      vehicles: JSON.parse(response),
    });
  } catch (error) {
    return res.status(500).json({ message: "failed to get user", error });
  }
}

export async function updateUserById(req: Request, res: Response) {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const { name, email } = req.body as { name?: string; email?: string };

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid user id" });
  }

  if (!name && !email) {
    return res.status(400).json({ message: "name or email is required" });
  }

  const updateData: { name?: string; email?: string } = {};

  if (name) {
    updateData.name = name;
  }

  if (email) {
    updateData.email = email;
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "failed to update user", error });
  }
}

export async function deleteUserById(req: Request, res: Response) {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  if (!id || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "invalid user id" });
  }

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id).lean();

    if (!deletedUser) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ message: "user has been deleted" });
  } catch (error) {
    return res.status(500).json({ message: "failed to delete user", error });
  }
}
