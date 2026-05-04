import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model('User', userSchema);
