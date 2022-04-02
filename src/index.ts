import cors from "cors";
import express from "express";
import morgan from "morgan";

import prisma from "./prismaClient";
import apiRouter from "./routes/api";
import indexRouter from "./routes/index";

async function main() {
  const app = express();
  app.use(morgan("tiny"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  await prisma.$connect();

  app.use("/", indexRouter);
  app.use("/api", apiRouter);

  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
