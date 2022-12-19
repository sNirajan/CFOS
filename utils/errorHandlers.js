const express = require("express");
const session = require("express-session");

function handleError(res, code) {
    if(code == 500) {
        res.status(500).sendFile(path.join(__dirname, "../public", "500.html"));
    }
}


module.exports = {
    handleError: handleError
}