/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const express = require("express");
const session = require("express-session");
const path = require("path");

function handleError(res, code) {
    if(code === 500) {
        res.status(500).sendFile(path.join(__dirname, "../public", "500.html"));
    } 
    else if(code === 404 ) {
        res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
    }
}

module.exports = {
    handleError
}