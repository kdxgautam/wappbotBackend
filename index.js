


import puppeteer from 'puppeteer';

const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();


  await page.goto('https://electoralsearch.eci.gov.in/');

  const epicNo = 'asfasdfasf1243'
  await page.locator('#epicID').fill(epicNo)

  await page.select(".search-details-subbody-epic .form-select",'U02')

  await page.locator('button').click()
  await sleep(1000)








  // Type into search box

//   await browser.close();
})();


// data.js
import { readFileSync } from 'fs';



const State = "nct of delhi"
let setData = ""
let setValue = ""


function loadJSON() {
    try {
        const jsonString = readFileSync(new URL('./state.json', import.meta.url), 'utf8');
        const data = JSON.parse(jsonString);
     setData = data.state
        
    } catch (err) {
        console.error('Error reading the JSON file:', err);
    }
}

loadJSON();


for (const item of setData){
    if (State.toLocaleLowerCase() == item.text.toLocaleLowerCase()){
        setValue = item.value
    }
}

console.log(setValue)


