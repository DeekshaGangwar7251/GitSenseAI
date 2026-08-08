import express from "express";
import cors from "cors";

import repositoryRoutes from "./routes/repository.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/repository", repositoryRoutes);

export default app;
