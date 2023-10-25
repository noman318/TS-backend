import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("In router routes file");
});

router.get("/:id", (req: Request, res: Response) => {
  const params = req.params.id;
  // console.log("params", params);
  res.send("In router routes file");
});

router.post("/", (req: Request, res: Response) => {
  const params = req.params.id;
  // console.log("params", params);
  res.send("In router routes file");
});

router.put("/:id", (req: Request, res: Response) => {
  const params = req.params.id;
  // console.log("params", params);
  res.send("In router routes file");
});

router.delete("/:id", (req: Request, res: Response) => {
  const params = req.params.id;
  // console.log("params", params);
  res.send("In router routes file");
});

export default router;
