const singleImageInput = document.getElementById('single-image');
const imageFolderInput = document.getElementById('image-folder');
const preview = document.getElementById('preview');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const getTextButton = document.getElementById('get-text');
const saveChangesBtn = document.getElementById("save-obj");//const downloadDataBtn = document.getElementById("download-data-btn");
// if(document.getElementById("download-data-btn") != null){
//     document.getElementById("download-data-btn").addEventListener("click",()=>{
//         fetch("http://localhost:3000/api/download-excel",()=>{
//             method:"GET"
//         }).then((res)=>{ 
//             console.log(res)
//         })
//     })
// }
let issavebuttonpressed = false
let id = "";
let currentImageIndex = 0;
let images = [];
if(singleImageInput!= null){
    singleImageInput.addEventListener('change', handleImageUpload);
}
if(imageFolderInput){
    imageFolderInput.addEventListener('change', handleImageUpload);
}


function handleImageUpload(e) {
    console.log("changing image...")
    const files = e.target.files;
    images = Array.from(files).filter(file => file.type.startsWith('image/'));
    currentImageIndex = 0;
    updatePreview();
    getTextButton.disabled = false;
    saveChangesBtn.style.display = "none";
    callGetText();
}
if(prevButton != null){
    
prevButton.addEventListener('click', () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updatePreview();
        callGetText();
    }
});

}

if(nextButton != null){
    
nextButton.addEventListener('click', () => {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updatePreview();
        callGetText();
    }
});

}

if(getTextButton != null){
    
getTextButton.addEventListener('click', async () => {
    if (images.length > 0) {
        callGetText();
    }
});

}
async function callGetText(){
    console.log("called get text");
    const currentImage = images[currentImageIndex];
    const data = new FormData();
    data.append("image", currentImage);
    try {
        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: data
        });
        
        const responseData = await response.json();
        console.log(responseData)
        
        if (responseData) {
            console.log(responseData, "showing response");
            currentImageData = responseData;
            createFormFields(responseData);
            id = responseData._id;
            console.log(id , "id");
            // ldText.innerText = "";
            saveChangesBtn.style.display = "block";
        } else {
            console.error("Response data is undefined or null");
        }
    } catch (err) {
        console.error(err);
        ldText.innerText = "Error occurred while processing the image.";
    }
}
function createFormFields(data) {
    const form = document.getElementById('userDetailsForm');
    if(form == null) return;
    form.innerHTML = ''; // Clear existing fields

    Object.entries(flattenObject(data)).forEach(([key, value]) => {
        if (key !== "_id" && key !== "createdAt" && key !== "updatedAt" && key !== "__v" && value !== "" && value != null) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase()
                                  .replace(/\b\w/g, l => l.toLowerCase()) + ':';

            const input = document.createElement('input');
            input.type = 'text';
            input.id = key;
            input.name = key;
            input.value = value;

            formGroup.appendChild(label);
            formGroup.appendChild(input);
            form.appendChild(formGroup);
        }
    });
}

function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}

function updatePreview() {
    if (images.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(images[currentImageIndex]);

        prevButton.disabled = currentImageIndex === 0;
        nextButton.disabled = currentImageIndex === images.length - 1;
        getTextButton.disabled = false;
        saveChangesBtn.style.display = "none";
        if(document.getElementById('userDetailsForm') != null)document.getElementById('userDetailsForm').innerHTML = ''; // Clear form when changing images
    } else {
        preview.src = "";
        preview.style.display = 'none';
        prevButton.disabled = true;
        nextButton.disabled = true;
        getTextButton.disabled = true;
        saveChangesBtn.style.display = "none";
    }
}

saveChangesBtn.addEventListener('click', saveImageData);

async function saveImageData() {
    issavebuttonpressed = true;
    if (currentImageData) {
        const form = document.getElementById('userDetailsForm');
        if(form == null) return;
        const formData = new FormData(form);
        const updatedData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:3000/api/update-medicalreport', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    ...updatedData,
                    imagePath: currentImageData.IMAGEPATH 
                }) 
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            id = result._id
            console.log('Data saved successfully:', result);
            alert('Data saved successfully!');
        } catch (error) {   
            console.error('Error saving data:', error);
            alert('Error saving data. Please try again.');
        }
    } else {
        alert('No image data to save. Please process an image first.');
    }
}

async function searchICD() {
    const icdCode = document.getElementById('icdCode').value.trim(); // Trim to avoid leading/trailing spaces

    if (!icdCode) {
        alert("Please enter an ICD code!");
        return;
    }

    try {
        const response = await fetch(`https://icd10api.com/?code=${icdCode}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('ICD code not found');
        }

        const data = await response.json();
        console.log(data);

        // // Check if the necessary properties exist
        if (data && data.Name && data.Description) {
            // Redirect to the new page with ICD data as URL parameters
            document.getElementById('icdCode').value = "";
            const url = `showIDCData.html?code=${encodeURIComponent(data.Name)}&description=${encodeURIComponent(data.Description)}`;
            window.location.href = url;
        } else {
            alert("Invalid response from the API. Please try again.");
        }
    } catch (error) {
        console.error(error);
        alert(`Error: ${error.message}`);
    }
}





