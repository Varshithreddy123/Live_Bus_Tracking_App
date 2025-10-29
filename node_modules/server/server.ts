import * as http from "http";
import { app } from "./app";

const port = Number(process.env.PORT) || 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});
