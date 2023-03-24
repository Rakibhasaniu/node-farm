const fs = require("fs");
const http = require("http");
const url = require("url");
///////////FILE
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log(textOut);

//non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", (err, data) => {
//     if (err) return console.log('ERRO');

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data) => {
//         console.log(data2);

//         fs.readFile(`./txt/final.txt`, `${data2}\n${data3}`, `utf-8`, err => {
//             console.log(data3);

//             fs.writeFile(`./txt/`)
//         })
//     })
// });
///////serveR
const replaceTemplate = (temp, product) => {
  // console.log(product);
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.FROM);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};
const tempOverview = fs.readFileSync(
  `./templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`./templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `./templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`./dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARD%}", cardsHtml);
    res.end(output);
    // console.log(cardsHtml);
    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //API PAGE
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    //NOT FOUND PAGE
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "fuck-you",
    });
    res.end("<h1>This page not found</h1>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
