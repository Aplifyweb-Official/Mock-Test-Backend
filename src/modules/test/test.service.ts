import Test from "./test.model.ts";

export const createTest = async (data: any) => {
  const test = await Test.create(data);
  return test;
};

export const getAllTests = async () => {
  return Test.find();
};

export const getTestById = async (id: string) => {
  return Test.findById(id);
};