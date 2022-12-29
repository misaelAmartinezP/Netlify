const dropArea = document.querySelector(".drop-area");
const dragText = dropArea.querySelector('h2');
const button = dropArea.querySelector('button');
const input = dropArea.querySelector('#input-file');


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

function processFile(file) {}