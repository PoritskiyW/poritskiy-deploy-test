import e from "express";

export function checkJWTMiddleware(req: e.Request, res: e.Response, next: e.NextFunction) {
  if (req.path === "/authentication" || req.path === "/registration" || req.path === "/restore") {
    if (req.cookies) {
      if (req.cookies.jwt) {
        res.redirect("/");
      } else {
        next();
      }
    } else {
      next();
    }
  } else {
    if (req.cookies) {
      if (req.cookies.jwt) {
        next();
      } else {
        res.redirect("/authentication");
      }
    } else {
      res.redirect("/authentication");
    }
  }
}
