import { createTest, getAllTests, getTestById } from "./test.service.ts";

export const createTestController = async (req: any, res: any) => {
  try {
    const test = await createTest(req.body);

    res.status(201).json({
      success: true,
      test,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTestsController = async (req: any, res: any) => {
  const tests = await getAllTests();

  res.json({
    success: true,
    tests,
  });
};

export const getTestController = async (req: any, res: any) => {
  const test = await getTestById(req.params.id);

  res.json({
    success: true,
    test,
  });
};