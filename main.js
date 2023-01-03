const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector('h2');
const button = dropArea.querySelector('button');
const input = dropArea.querySelector('#input-file');

import * as fs from "fs";


button.addEventListener('click', (e) => {
    input.click();
});

input.addEventListener("change", (e) => {
    file = this.files;
    dropArea.classList.add("active");
    showFile(files);
    dropArea.classList.remove("active");
})

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Suelta para subir los archivos";
});

dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropArea.classList.remove("active");
    dragText.textContent="Arrastra y suelta archivo"
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    files = e.dataTransfer.files;
    showFiles(files)
    dropArea.classList.remove("active");
    dragText.textContent = "Arrastra y suelta archivo"
});

function showFiles(files) {
    if (files.length == undefined) {
        processFile(files);
    }
    else {
        for (const file of files) {
            processFile(file)
        }
    }
}

function processFile(file) {
    const docType = file.type;
    const validExtensions = ('application/pdf');

    if (validExtensions.includes(docType)) {
        //archivo valido
    } else {
        alert('El archivo tiene que ser un pdf');
    }
}

function readImage(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        img.src = event.target.result;
    });
    reader.readAsDataURL(file);
}
const wordsApi = new WordsApi("####-####-####-####-####", "##################");

const doc = fs.createReadStream("CSF_ACO9911198U0_16032022.pdf");
const request = new model.ConvertDocumentRequest({
    document: doc,
    format: "pdf"
});

const convert = wordsApi.convertDocument(request)
    .then((convertDocumentResult) => {
        console.log("Result of ConvertDocument: ", convertDocumentResult);
    });