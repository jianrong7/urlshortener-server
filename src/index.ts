import cors from "cors";
import express from "express";

import prisma from "./prismaClient";
import apiRouter from "./routes/api";

async function main() {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  await prisma.$connect();

  app.use("/api", apiRouter);

  app.get("/:id", async (req, res) => {
    try {
      const url = await prisma.url.findUnique({
        where: {
          urlId: req.params.id,
        },
      });
      if (url) {
        await prisma.url.update({
          where: { urlId: req.params.id },
          data: {
            clicks: {
              increment: 1,
            },
          },
        });
        return res.redirect(url.origUrl);
      } else {
        res.status(404).json("Not found");
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  });

  app.get("/", (req, res) => {
    res.send("Hello World");
  });

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
