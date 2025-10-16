import dotenv from "dotenv";
dotenv.config();
import express, {NextFunction, Request, Response} from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ONLY use the router - no duplicate routes
app.use("/api/v1", userRouter);

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World!");
});

export { app };