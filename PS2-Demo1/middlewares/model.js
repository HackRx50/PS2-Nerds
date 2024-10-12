const modelcall = async  (imagepath)=>{
    const data = await fetch("http://127.0.0.1:5000/process_image", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            image_path: imagepath

        }) 
    })
    let resu =await data.json();
 

    if(typeof(resu) == 'string')  
    resu = await JSON.parse(resu);
    resu = convertKeysToUppercase(resu);
    return resu;
}
const convertKeysToUppercase = (obj) => {
    // Create a new object to hold the modified key-value pairs
    console.log('convert keys to uppercase ')
    let newobj = {};

    // Iterate over each key in the input object
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Convert the key to uppercase and assign the value to newobj
            newobj[key.toUpperCase()] = obj[key];
        }
    }

    // Return the new object with uppercase keys
    return newobj;
};

module.exports = modelcall
