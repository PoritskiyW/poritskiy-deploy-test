import multer, { Multer } from "multer";
import e from "express";

const storageConfig = multer.diskStorage({
  destination: (req: e.Request, file: Express.Multer.File, cb: CallableFunction) => {
    cb(null, "public/images/uploads");
  },
});

export const multerMiddleware = multer({ storage: storageConfig }).array("files");
