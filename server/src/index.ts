import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const generateData = (start: number, limit: number) => {
  const data = [];
  for (let i = start; i < start + limit; i++) {
    data.push({ id: i, sentence: "This is list" });
  }
  return data;
};
app.get("/api", (req: Request, res: Response) => {
  const { page = 1, limit = 5 } = req.query;
  const start = (parseInt(page as string) - 1) * parseInt(limit as string);
  const data = generateData(start + 1, parseInt(limit as string));
  res.json({ data });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
