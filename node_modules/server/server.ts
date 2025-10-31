import * as http from "http";
import { app } from "./app";

const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || "0.0.0.0"; // Bind to all interfaces so emulator/phones can reach
const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});
