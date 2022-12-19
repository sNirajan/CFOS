
function menuItemErrorMsg(param) {
    let errorMsg = "";
    if(param) {
        let invalidFields = param.split("+");
        for(field of invalidFields) {
            if(field == "name") {
                errorMsg += "Name field is required.\n";
            }
            else if(field == "price") {
                errorMsg += "Price field is required and it must be a valid number.";
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
        if(error == "name") {
            invalidFields += sepChar[i] + "name";
            i = 1;
        }
        else if(error == "price"){
            invalidFields += sepChar[i] + "price";
            i = 1;
        }
    }
    return invalidFields;
}

module.exports = {
    menuItemErrorMsg,
    errorNameStr
}