const multiFormHeader = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'multipart/form-data',
}

const jsonHeader = {
    // //Access-Control-Allow-Origin: https://localhost:3000
    // 'Access-Control-Allow-Origin': '*',
    // 'Content-Type': 'application/json',
    Authorization: `Beare ${localStorage.getItem("token")}`
}


module.export = { multiFormHeader, jsonHeader }