var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';

function ExtractText() {
    var input = document.getElementById("file-id");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    // console.log(input.files[0]);
    fReader.onloadend = function (event) {
        convertDataURIToBinary(event.target.result);
    }
}

var BASE64_MARKER = ';base64,';

function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    pdfAsArray(array)
}

function getPageText(pageNum, PDFDocumentInstance) {
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = "";
                    for (var i = 0; i < textItems.length; i++) {
                        var item = textItems[i];
                        finalString += item.str + " "; //separador
                    }
                    resolve(finalString);
                });
        });
    });
}

function pdfAsArray(pdfAsArray) {
    PDFJS.getDocument(pdfAsArray).then(function (pdf) {
        var pdfDocument = pdf;
        var pagesPromises = [];
        for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
            (function (pageNumber) {
                pagesPromises.push(getPageText(pageNumber, pdfDocument));
            })(i + 1);
        }
        Promise.all(pagesPromises).then(function (pagesText) {
            let arr = (pagesText);
            srtPdf = (arr.toString());
            parceoDatos(srtPdf);//imprime las funciones
            var outputStr = "";
            for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                outputStr = "";
                outputStr = "<br/><br/>Page " + (pageNum + 1) + " contents <br/> <br/>";
                var div = document.getElementById('output');
                //div.innerHTML += (outputStr + pagesText[pageNum]);//esta linea de codigo se encarga de imprimir el contenido del archivo 
            }
        });
    }, function (reason) {
        console.error(reason);
    });
}

function parceoDatos(string) {
    separaDatos = string.split(" ");
    console.log(separaDatos);
    extraeRFC(separaDatos)//extrae RFC
    extraeRaSo(separaDatos)//extrae razon social
    extraeCodPos(separaDatos)//extrae codigo postal
    extraeNomVia(separaDatos)//extrae nombre de vialidad
}

function extraeRFC(string) {
    arrInfo = Object.values(string)
    for (i = 0; i < arrInfo.length; i++) {
        if (arrInfo[i]=="RFC:") {
            console.log(arrInfo[i + 1]);
            var div = document.getElementById('output');
            div.innerHTML += ("<br/>" + arrInfo[i + 1] + "<br/>" );
        }
    }
}

function extraeRaSo(string) {
    arrInfo = Object.values(string)
    console.log("estoy en la funcion extrae razon social ")
    var guardaRaSo = [];
    console.log(arrInfo.indexOf("Contribuyentes"));
    console.log(arrInfo.indexOf("Nombre,"));
    if (arrInfo.includes("Contribuyentes") == true) {
        console.log("estoy en el if y soy true")
        for (i = arrInfo.indexOf("Contribuyentes")+1; i <= arrInfo.indexOf("Nombre,")-1; i++) {
            console.log(i);
            guardaRaSo.push(arrInfo[i]);
        } 
    } else {
        var div = document.getElementById('output');
        div.innerHTML += ("<br/> 'EL PDF NO ES UNA CONSTANCIA FISCAL'");
    }    
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaRaSo.join(' ')+"<br/>");
}

function extraeCodPos(string) {
    arrInfo = Object.values(string)
    console.log("estoy en la funcion extrae codigo postal ")
    var guardaCodPos = [];
    console.log(arrInfo.indexOf("Postal:"));
    console.log(arrInfo.indexOf("Tipo"));
    if (arrInfo.includes("Postal:") == true) {
        console.log("estoy en el if y soy true")
        for (i = arrInfo.indexOf("Postal:") + 1; i <= arrInfo.indexOf("Tipo") - 1; i++) {
            console.log(i);
            guardaCodPos.push(arrInfo[i]);
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaCodPos.join(' ') + "<br/>");
}

function extraeNomVia(string) {
    arrInfo = Object.values(string)
    console.log("estoy en la funcion extrae nombre vialidad")
    var guardaNomVia = [];
    console.log(arrInfo.indexOf("Vialidad:"));
    console.log(arrInfo.indexOf("Exterior:"));
    if (arrInfo.includes("Vialidad:") == true) {
        console.log("estoy en el if y soy true")
        for (i = arrInfo.indexOf("Vialidad:") + 1; i <= arrInfo.indexOf("Exterior:") - 2; i++) {
            if (arrInfo[i] == "Vialidad:") {
                console.log("estoy en el if que tiene que igualar el el indice contra vialidad")
                guardaNomVia.push(arrInfo[i+1]);
            } else if (arrInfo[i] =="Número") {
                break
            }
            console.log(i);
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaNomVia.join(' ') + "<br/>");
}