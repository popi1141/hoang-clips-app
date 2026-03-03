import app from "./app";

const port = parseInt(process.env.PORT || "3852");
console.log(`Hoang Clips running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
