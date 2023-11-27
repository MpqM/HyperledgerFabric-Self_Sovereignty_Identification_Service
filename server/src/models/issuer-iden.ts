import { InferSchemaType, model, Schema } from "mongoose";

const iIdenSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String },
        age: { type: String },
        gender: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);

type IIden = InferSchemaType<typeof iIdenSchema>;

export default model<IIden>("IIden", iIdenSchema);
