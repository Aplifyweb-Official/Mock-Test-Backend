import app from "./app.js";
import { env } from "./config/env.config.js";
import connectDB from "./config/db.config.js";

connectDB();
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});
