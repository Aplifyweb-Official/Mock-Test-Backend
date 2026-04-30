import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ITest
extends Document {

  title: string;

  description?: string;

  duration: number;

  totalMarks: number;

  negativeMarking: number;

  status:
    | "draft"
    | "published";

  startDate?: Date;

  endDate?: Date;

  instituteId:
    mongoose.Types.ObjectId;

  batchIds:
    mongoose.Types.ObjectId[];

  createdBy:
    mongoose.Types.ObjectId;
}

const testSchema =
new Schema<ITest>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    negativeMarking: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,

      enum: [
        "draft",
        "published",
      ],

      default: "draft",
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    instituteId: {
      type:
        Schema.Types.ObjectId,

      ref: "Institute",

      required: true,
    },

    batchIds: [
      {
        type:
          Schema.Types.ObjectId,

        ref: "Batch",
      },
    ],

    createdBy: {
      type:
        Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Test =
mongoose.model<ITest>(
  "Test",
  testSchema
);

export default Test;