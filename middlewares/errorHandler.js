/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Nirajan Shah
 */
const express = require("express");
const session = require("express-session");
const path = require("path");

/**
 * handles errors and redirects to the proper error page.
 */
function handleError(res, code) {
    if(code === 404 ) {
        res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
    }
    else {
        res.status(500).sendFile(path.join(__dirname, "../public", "500.html"));
    } 
}

module.exports = {
    handleError
}