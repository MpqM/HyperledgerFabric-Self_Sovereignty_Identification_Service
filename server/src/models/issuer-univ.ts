import { InferSchemaType, model, Schema } from "mongoose";

const iUnivSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String },
        age: { type: String },
        gender: { type: String },
        graduationDate: { type: String },
        major: { type: String },
        gpa: { type: String },
    },
    { timestamps: true }
);

type IUniv = InferSchemaType<typeof iUnivSchema>;

export default model<IUniv>("IUniv", iUnivSchema);
