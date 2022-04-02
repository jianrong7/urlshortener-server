import { Router } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

const indexRouter = Router();

indexRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// indexRouter.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email
//       }
//     })
//     if (user) {
// bcrypt.compareSync("B4c0//", hash);
//       if (await argon2.verify(await argon2.hash(password), user.password)) {

//       }
//     }
//   }
// })

indexRouter.get("/:id", async (req, res) => {
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

indexRouter.get("/", (req, res) => {
  res.send("Hello World");
});

export default indexRouter;
