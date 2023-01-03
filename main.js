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

function leerArch(evento) {
    let archivo = evento.target.files[0];

    if (archivo) {
        let reader = new FileReader();

        reader.onload = function (e) {
            let contenico = e.target.result;
            document.getElementById('contenido').innerText = contenido;
        };
        reader.readAsText(archivo);
    } else {
        document.getElementById('mensajes').innerText = 'no se ha seleccioando ningun archivo'
    }
    window.addEventListener('load', () => {
        document.getElementById('file').addEventListener('change', leerArch)
    })
}