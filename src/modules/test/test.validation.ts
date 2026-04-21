export const validateTest = (req: any, res: any, next: any) => {
  const { title, duration, totalMarks, questions } = req.body;

  if (!title || !duration || !totalMarks) {
    return res.status(400).json({
      success: false,
      message: "Title, duration and totalMarks are required",
    });
  }

  if (!questions || questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one question is required",
    });
  }

  next();
};