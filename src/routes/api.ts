import { Router } from "express";
import { nanoid } from "nanoid";
import prisma from "../prismaClient";
import { validateUrl } from "../utils";

const apiRouter = Router();

apiRouter.post("/short", async (req, res) => {
  const { origUrl } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid(8);

  if (validateUrl(origUrl)) {
    try {
      let url = await prisma.url.findUnique({
        where: {
          origUrl,
        },
      });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = `${base}/${urlId}`;
        let url = await prisma.url.create({
          data: {
            origUrl,
            shortUrl,
            urlId,
            clicks: 0,
            qrCode: `https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=${origUrl}`,
          },
        });

        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

apiRouter.put("/custom", async (req, res) => {
  const { origUrl, urlId } = req.body;
  const base = process.env.BASE;
  const shortUrl = base + "/" + urlId;

  if (validateUrl(origUrl)) {
    try {
      let url = await prisma.url.findUnique({
        where: {
          origUrl,
        },
      });
      if (url) {
        if (url.shortUrl === base + urlId) {
          res.json(url);
        } else {
          url = await prisma.url.update({
            where: { origUrl },
            data: {
              origUrl,
              urlId,
              shortUrl,
              clicks: 0,
              qrCode: `https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=${origUrl}`,
            },
          });
          res.json(url);
        }
      } else {
        let url = await prisma.url.create({
          data: {
            origUrl,
            urlId,
            shortUrl,
            clicks: 0,
            qrCode: `https://chart.googleapis.com/chart?chs=150x150&cht=qr&choe=UTF-8&chl=${origUrl}`,
          },
        });
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});

export default apiRouter;
