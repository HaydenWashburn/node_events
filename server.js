// Complete Events Exercise
const { createServer } = require("http");
const { appendFile, readFile, createReadStream, read } = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const PORT = 5001;

const newsLetter = new EventEmitter();

const server = createServer((request, response) => {
  const { url, method } = request;

  request.on("error", (err) => {
    console.error(err);
    response.statusCode = 404;
    response.setHeader("Content-type", "application/json");
    response.write(JSON.stringify({ message: "Invalid Request, 404" }));
    response.end();
  });
  const chunks = [];

  request.on("data", (chunk) => {
    chunks.push(chunk);
    console.log(chunks);
  });
  request.on("end", () => {
    if (url === "/newsletter_signup" && method === "POST") {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      const signUp = `${body.contact}, ${body.newsLetter}\n`;
      newsLetter.emit("New News Letter!", signUp, response);
      response.setHeader("content-type", "application/json");
      response.write(
        JSON.stringify({ message: "Successfully added News Letter" })
      );
      response.end();
    } else if (url === "/newsletter_signup" && method === "GET") {
      response.setHeader("content-type", "text/html");
      const readStream = createReadStream(
        path(__dirname, "./public/index.html")
      );
      readStream.pipe(response);
    } else {
      response.statusCode = 400;
      response.setHeader("Content-type", "application/json");
      response.write(JSON.stringify({ message: "not a valid endpoint" }));
      response.end();
    }
  });
});
server.listen(PORT, () => console.log(`Server listening at ${PORT}`));

newsLetter.on("New News Letter!", (signUp, response) => {
  appendFile(path.join(__dirname, "./assets/newsLetter.csv"), signUp, (err) => {
    if (err) {
      newsLetter.emit("error", err, response);
      return;
    }
    console.log("The file was updated HOORAY");
  });
});

newsLetter.on("error", (err, response) => {
  console.error(err);
  response.statusCode = 500;
  response.setHeader("Content-Type", "application/json");
  response.write(
    JSON.stringify({ message: "there was an error in signing up" })
  );
  response.end();
});
