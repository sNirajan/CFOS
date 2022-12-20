/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

/**
 * Splits a given string of error names seperated by ' ', and returns a detailed error message.
 * @param {String} param The string to be splited.
 * @returns A String of that contains detailed error messages.
 */
function menuItemErrorMsg(param) {
    let errorMsg = "";
    if(param) {
        let invalidFields = param.split(" ");
        for(field of invalidFields) {
            if(field == "name") {
                errorMsg += "Name field is required.\n";
            }
            else if(field == "price") {
                errorMsg += "Price field must be a valid number.\n";
            }
        }
    }
    return errorMsg;
}

/**
 * Splits a given string of error names seperated by ' ', and returns a detailed error message.
 * @param {String} param The string to be splited.
 * @returns A String of that contains detailed error messages.
 */
function employeeErrorMsg(param) {
    let errorMsg = "";
    if(param) {
        let invalidFields = param.split(" ");
        for(field of invalidFields) {
            if(field == "email") {
                errorMsg += "Email must be a valid email. ";
            }
            else if(field == "wage") {
                errorMsg += "Wage must be a valid number. ";
            }
            else if(field == "password") {
                errorMsg += "Password doesn't match. ";
            }
        }
    }
    return errorMsg;
}

/**
 * Converts an schema validation error object into string container error names seperated by '+'.
 * @param {String} err The error object.
 * @returns A String of that contains the error name sperated by '+'.
 */
function errorNameStr(err) {
    let invalidFields = "";
    let sepChar = ["", "+"];
    let i = 0;
    for(error in err.errors) {
        invalidFields += sepChar[i] + error;
        i = 1;
    }
    return invalidFields;
}

module.exports = {
    menuItemErrorMsg,
    errorNameStr,
    employeeErrorMsg
}