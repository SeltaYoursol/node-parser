const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const userAgent = require('user-agents');

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const puppeteer = require('puppeteer');

const csvWriter = createCsvWriter({
    path: "out.csv",
    header: [
        { id: "name", title: "Name" },
        { id: "title", title: "Title" },
        { id: "price", title: "Price" },
        { id: "district", title: "District" },
        { id: "link", title: "Link" },
    ],
});

const data = [];

axios.defaults.headers.common["User-Agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36";

axios.defaults.headers.common["Accept-Agent"] = "ru";

const queryRU = "миникюр";
const URL =
    "https://www.avito.ru/volgograd/predlozheniya_uslug/krasota_zdorove-ASgBAgICAUSYC6qfAQ?q=";
let formatedURL = `${URL}${encodeURI(queryRU)}`;

const parse = async () => {
    let data = [];
    const getHTML = async (url) => {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    };
    const $ = await getHTML(formatedURL);
    const pagesCount = $("span.pagination-item-1WyVp[data-marker]")
        .eq(-2)
        .text();

    for (i = 1; i <= 2; i++) {
        const selector = await getHTML(`${formatedURL}&p=${i}`);
        selector(".iva-item-root-G3n7v").each((i, element) => {
            const title = selector(element).find("h3.title-root-395AQ").text();
            const district = selector(element)
                .find(".geo-georeferences-3or5Q")
                .find("span")
                .text();
            const price = selector(element)
                .find("span.price-text-1HrJ_")
                .text();
            const link = selector(element)
                .find("a.link-link-39EVK")
                .attr("href");

            data.push({
                title: title,
                district: district,
                price: price,
                link: link,
            });
        });
    }
    const csvWriter = createCsvWriter({
        path: "out.csv",
        header: [
            { id: "title", title: "Title" },
            { id: "district", title: "District" },
            { id: "price", title: "Price" },
            { id: "link", title: "Link" },
        ],
    });
    csvWriter
        .writeRecords(data)
        .then(() => console.log("The CSV file was written successfully"));
};

parse();
