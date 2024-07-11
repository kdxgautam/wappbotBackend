import puppeteer from "puppeteer";
import {createWriteStream } from "fs";
import axios from "axios";

const sleep = (waitTimeInMs) =>
    new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

export default async function downlaodCaptcha (){
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://electoralsearch.eci.gov.in/");
  


  const imageUrl = await page.evaluate(() => {
    const imgElement = document.querySelector('img[style="border: 1px solid rgb(137, 137, 129);"]')
    return imgElement ? imgElement.src : null;
  });

  if (imageUrl) {
    // Download the image
    const response = await axios({
      url: imageUrl,
      responseType: 'stream',
    });

    // Save the image to the filesystem
    const writer = createWriteStream('./images/downloadedimage.jpg'); // Replace with desired file name and path
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('Image downloaded successfully.');
    });

    writer.on('error', (err) => {
      console.error('Error downloading the image:', err);
    });

  await browser.close();
}};
