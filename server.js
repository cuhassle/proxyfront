import express from "express";
import puppeteer from "puppeteer";

const app = express();
const port = 3000;

let browser;

// Launch Puppeteer once
(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"]
  });
})();

// API endpoint to fetch rendered HTML
app.get("/browse", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing ?url");

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract the whole HTML
    const content = await page.content();

    await page.close();

    res.send(content);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error loading page");
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
