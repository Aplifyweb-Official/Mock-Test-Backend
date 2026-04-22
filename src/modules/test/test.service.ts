import Test from "./test.model.js";
import { AppError } from "../../utils/AppError.js";

export const createTest = async (data: any) => {
  const test = await Test.create(data);
  return test;
};

export const getAllTests = async () => {
  const tests = await Test.find().sort({ createdAt: -1 });

  return tests;
};

export const getTestById = async (id: string) => {
  const test = await Test.findById(id);

  if (!test) {
    throw new AppError("Test not found", 404);
  }

  return test;
};