import { InferSchemaType, model, Schema } from "mongoose";

const iUserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        didId: { type: String, require:true, unique: true},
        password: { type: String, required: true, select: false },
    },
    { timestamps: true }
);

type IUser = InferSchemaType<typeof iUserSchema>;

export default model<IUser>("IUser", iUserSchema);
