
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