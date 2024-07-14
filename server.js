import express from 'express';
import puppeteer from 'puppeteer';
import axios from 'axios';
import { createWriteStream, readFileSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Helper function for delay
const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

// Routes
app.get('/data', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const epicNo = req.body.epicID
    const State = req.body.state;
    let setData = "";
    let setValue = "";
    let fileName = "";
    let fileDownloaded = false;
    let updated_img = false;
    let code = false;
    let updated_code = false;
    let pollingStation = "";

    await page.goto("https://electoralsearch.eci.gov.in/");

    const imageUrl = await page.evaluate(() => {
      const imgElement = document.querySelector('img[style="border: 1px solid rgb(137, 137, 129);"]');
      return imgElement ? imgElement.src : null;
    });

    if (imageUrl) {
      try {
        // Download the image
        const response = await axios({
          url: imageUrl,
          responseType: "stream",
        });

        // Save the image to the filesystem
        fileName = "./captchas/downloadedimage.jpg";
        const writer = createWriteStream(fileName);
  
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        console.log("Image downloaded successfully.");
        fileDownloaded = true;
      } catch (err) {
        console.error("Error downloading the image:", err);
      }
    }

    while (!updated_img) {
      await sleep(100);
      if (fileDownloaded && fileName) {
        updated_img = true;

        const pythonProcess = spawn("python", ["normal.py", fileName]);

        pythonProcess.stdout.on("data", (data) => {
          try {
            const res = JSON.parse(data.toString().replace(/'/g, `"`));
            code = res.code;
          } catch (error) {
            console.error("Error parsing JSON from Python script:", error);
          }
        });
      }
    }

    while (!updated_code) {
      await sleep(100);
      if (code) {
        updated_code = true;
        console.log("The code is: " + code);
        await page.type('input[name="captcha"]', code, { delay: 200 });
      }
    }

    await page.type('#epicID', epicNo);

    const loadJSON = () => {
      try {
        const jsonString = readFileSync(
          new URL("./state.json", import.meta.url),
          "utf8"
        );
        const data = JSON.parse(jsonString);
        setData = data.state;
      } catch (err) {
        console.error("Error reading the JSON file:", err);
      }
    };

    loadJSON();

    for (const item of setData) {
      if (State.toLocaleLowerCase() === item.text.toLocaleLowerCase()) {
        setValue = item.value;
      }
    }

    await page.select(".search-details-subbody-epic .form-select", setValue);
    await page.click("button");

    // Fetch station
    await page.waitForSelector(".result-table");
    const productsHandles = await page.$$(".result-table > tbody > tr");

    for (const producthandle of productsHandles) {
      try {
        const title = await page.evaluate(
          (el) => el.querySelector("td:nth-child(10)").textContent,
          producthandle
        );
        pollingStation = title.replace(/\s+/g, " ");
        console.log(title);
      } catch (error) {
        console.log(error);
      }
    }

    console.log(pollingStation);
    res.json({ station: pollingStation });

    await browser.close();
  } catch (error) {
    console.log("Error occurred", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
