/* eslint-disable no-console */
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Can pass a limited number of options to this to override (some) defaults. See https://github.com/typicode/json-server#api
const middlewares = jsonServer.defaults({
  // Display json-server's built in homepage when json-server starts.
  static: "public",
});

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser. Using JSON Server's bodyParser
server.use(jsonServer.bodyParser);

// Avoid CORS issue
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  next();
});

server.post("/events/", function (req, res, next) {
  console.log("req.body :", req.body);
  const error = validateCampaign(req.body);
  if (error) {
    res.status(400).send(error);
  } else {
    next();
  }
});

// Use default router
server.use(router);

// Start server
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

function validateCampaign(campagin) {
  if (!campagin.name) return "Name of campaign is required.";
  if (!campagin.region) return "Region of campaign is required.";
  if (!campagin.price) return "Price is required.";
  if (!campagin.date) return "Date of campaign is required.";
  if (!campagin.image_url) return "Image url is required.";
  return "";
}
