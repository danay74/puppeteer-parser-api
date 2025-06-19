const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/parser", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing ?url=" });

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

    const content = await page.evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: "Failed to parse page", detail: err.message });
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
