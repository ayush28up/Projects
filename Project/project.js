const pup=require("puppeteer");
let tab;
async function main(){
    try{
    const browser = await pup.launch({headless:false});
    let pages = await browser.pages();
    tab=pages[0];
    await tab.setViewport({width:1288,height:800});
    await tab.goto("https://www.google.com/", {waitUntil: 'domcontentloaded'});

    await tab.type(".gLFyf.gsfi","math addition problems");
    await tab.waitForSelector("input.gNO89b",{visible:true});
    await tab.waitForTimeout(4000);
    await tab.click("input.gNO89b")
   
    await tab.waitForSelector("div.yuRUbf a");
    await tab.waitForTimeout(4000);
    let tags = await tab.$$("div.yuRUbf a");
    let allurl = [];
    for(let i of tags){
        let temp = await  tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },i);
        allurl.push(temp);
    }
    
  
  await tab.goto(" " + allurl[16], {waitUntil: 'domcontentloaded'});

  await tab.waitForSelector("div.clear a",{visible:true});
  await tab.waitForTimeout(4000);
  let diff = await tab.$$("div.clear a");
  let difficultylevelurls = [];
  for(let i of diff){
    let temp = await  tab.evaluate(function(ele){
        return ele.getAttribute("href");
    },i);
    difficultylevelurls.push(temp);
}


await tab.goto("https://www.mathsisfun.com/worksheets/" + difficultylevelurls[12]);

 await tab.waitForSelector("#ansBtn",{visible:true});
 await tab.waitForTimeout(5000);
 await tab.click("#ansBtn");
}
 catch{
     console.error();
 }
 
 
}
main();
