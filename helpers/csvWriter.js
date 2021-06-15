const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

module.exports.csvWriter = function(data) {
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;

    const csvWriterHandler = createCsvWriter({
        path: "out.csv",
        header: [
            { id: "title", title: "Title" },
            { id: "district", title: "District" },
            { id: "price", title: "Price" },
            { id: "link", title: "Link" },
        ],
    });
    csvWriterHandler
        .writeRecords(data)
        .then(() => console.log("The CSV file was written successfully"));
}
