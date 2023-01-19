var datass = '';
var DataArr = [];
PDFJS.workerSrc = '';

//extraccion del pdf
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
            document.getElementById("output").innerHTML = "";
            let arr = (pagesText);
            srtPdf = (arr.toString());
            parceoDatos(srtPdf);                                    //imprime las funciones
            var outputStr = "";
            for (var pageNum = 0; pageNum < pagesText.length; pageNum++) {
                outputStr = "";
                outputStr = "<br/><br/>Page " + (pageNum + 1) + " contents <br/> <br/>";
                var div = document.getElementById('output');
                //div.innerHTML += (outputStr + pagesText[pageNum]);//esta linea de codigo se encarga de imprimir el contenido del archivo 
                outputStr = "";
                outputStr = "<br/><br/>Page " + (pageNum + 1) + " contents <br/> <br/>";
                var div = document.getElementById('output');
                //div.innerHTML += ("");//esta linea de codigo se encarga de imprimir el contenido del archivo 
            }
        });
    }, function (reason) {
        console.error(reason);
    });
}

//terimina extraccion del pdf

function parceoDatos(string) {
    separaDatos = string.split(" ");
    //console.log(separaDatos);
    extraeRFC(separaDatos)//extrae RFC
    extraeRaSo(separaDatos)//extrae razon social
    extraeCodPos(separaDatos)//extrae codigo postal
    extraeNomVia(separaDatos)//extrae nombre de vialidad
    extraeNumExt(separaDatos)//extrae numero exterior 
    extraeNumInt(separaDatos)//extrae numero interior
    extraeNomCol(separaDatos) //extrae nombre de la colonia
    extraeReg(separaDatos)//extrae regimen
}

function extraeRFC(string) { //funcion que extrae el pdf 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    for (i = 0; i < arrInfo.length; i++) { //recorrido del arreglo
        if (arrInfo[i]=="RFC:") { //cuando el indice i del arreglo seo igual a rfc
            //console.log(arrInfo[i + 1]);  //imprime el contenido del indice+1 para obtener el rfc en consola
            var div = document.getElementById('output'); //variable para despues mandar el contenido que obtuvimos
            div.innerHTML += ("<br/>" + arrInfo[i + 1] + "<br/>"); //imprime el contenido del arreglo el que se encuentra en la posicion i+1
            break //salimos del bucle
        }
    }
}

function extraeRaSo(string) { //funcion que extrae la razon social 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae razon social ") //imprime el nombre de la funcion en consola 
    var guardaRaSo = []; //declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Contribuyentes"));//busqueda el indice de la palabra
    //console.log(arrInfo.indexOf("Nombre,"));//busqueda el indice de la palabra
    if (arrInfo.includes("Contribuyentes") == true) { //si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion 
        //console.log("estoy en el if y soy true") //verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Contribuyentes") + 1; i <= arrInfo.indexOf("Nombre,") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
            guardaRaSo.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i 
        } 
    } else {
        var div = document.getElementById('output');
        div.innerHTML += ("<br/> 'EL PDF NO ES UNA CONSTANCIA FISCAL'");//valida que el pdf sea una constancia fiscal y lo imprime en la pagina web 
    }    
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaRaSo.join(' ') + "<br/>");//imprime el contenido en la pagina web
}

function extraeCodPos(string) { //funcion que extrae el codigo postal 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo  
    //console.log("estoy en la funcion extrae codigo postal ")//imprime el nombre de la funcion en consola 
    var guardaCodPos = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Postal:"));//busqueda el indice de la palabra
    //console.log(arrInfo.indexOf("Tipo"));//busqueda el indice de la palabra
    if (arrInfo.includes("Postal:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Postal:") + 1; i <= arrInfo.indexOf("Tipo") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            guardaCodPos.push(arrInfo[i]);//guarda en el arreglo guardaCodPos el contenido del indice del arreglo arrInfo en la posicion i
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaCodPos.join(' ') + "<br/>"); //imprime el contenido en la pagina web
}

function extraeNomVia(string) { //funcion que extrae nombre de vialidad
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae nombre vialidad")//imprime el nombre de la funcion en consola 
    var guardaNomVia = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Exterior:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Exterior:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Exterior:")-2; i >= arrInfo.indexOf("Vialidad:"); i--) { //recorrido para encontrar la informacion que necesitamos 
            if (arrInfo[i] == "Vialidad:") {//si encontramos que el idice de la posicion arrInfo[i] es igual a Vialidad: termina el recorrido 
                break
            }
            guardaNomVia.push(arrInfo[i]);//guarda en el arreglo guardaNomVia el contenido del indice del arreglo arrInfo en la posicion i
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
        }
    }
    //console.log(guardaNomVia.reverse());//invierte el contenido del arreglo guardaNomVia
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaNomVia.join(' ') + "<br/>");//imprime el contenido en la pagina web
}

function extraeNumExt(string) { //funcion que extrae el numero exterior
    arrInfo = Object.values(string)  //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae numero exterior")//imprime el nombre de la funcion en consola 
    var guardaNunExt = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Exterior:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Exterior:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Exterior:") + 1; i <= arrInfo.length; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            guardaNunExt.push(arrInfo[i]);//guarda en el arreglo guardaNumExt el contenido del indice del arreglo arrInfo en la posicion i
            break
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaNunExt.join(' ') + "<br/>");//imprime el contenido en la pagina web
}

function extraeNumInt(string) {//funcion que extrae el numero interior
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae numero interior")//imprime el nombre de la funcion en consola 
    var guardaNunInt = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Interior:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Interior:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Interior:") + 1; i <= arrInfo.indexOf("Colonia:")-4; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            guardaNunInt.push(arrInfo[i]);//guarda en el arreglo guardaNumInt el contenido del indice del arreglo arrInfo en la posicion i
        }
    }
    if (guardaNunInt.length == 0) {//si la longitud del arreglo es igual a cero 
        //console.log("SN") //linea de apoyo se visualiza en consola 
        var div = document.getElementById('output');
        div.innerHTML += ("<br/> NULL <br/>");//imprime el contenido de que la constancia fiscal no tiene numero interior en la pagina web
    } else { //si no se cumple lo anterior entonces 
        var div = document.getElementById('output');
        div.innerHTML += ("<br/>" + guardaNunInt.join(' ') + "<br/>");//imprime el contenido en la pagina web
    }
}

function extraeNomCol(string) {//funcion que extrae la colonia
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae numero interior")//imprime el nombre de la funcion en consola 
    var guardaNomCol = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Colonia:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Colonia:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Colonia:") + 1; i <= arrInfo.indexOf("Localidad:") - 4; i++) { //recorrido de indices para obtener la informacion necesaria 
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            guardaNomCol.push(arrInfo[i]);//guarda en el arreglo guardaNomCol el contenido del indice del arreglo arrInfo en la posicion i
        }
    }
    if (guardaNomCol.length == 0) {//si la longitud del arreglo es igual a cero 
        //console.log("SN")
        var div = document.getElementById('output');
        div.innerHTML += ("<br/> NULL <br/>");//imprime sin nombre de colonia en la pagina web 
    } else {//si no se cumple lo anterior entonces
        var div = document.getElementById('output');
        div.innerHTML += ("<br/>" + guardaNomCol.join(' ') + "<br/>");//imprime el contenido del arreglo guardaNomCol en la pagina web
    }
}

function extraeReg(string) {//funcion que extrae el regimen 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae codigo postal ")//imprime el nombre de la funcion en consola 
    var guardaReg = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Regímenes:"));//busqueda el indice de la palabra
    //console.log(arrInfo.indexOf("Obligaciones:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Regímenes:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Regímenes:") + 8 ; i <= arrInfo.indexOf("Obligaciones:") - 2; i++) {
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            guardaReg.push(arrInfo[i]);//guarda en el arreglo guardaReg el contenido del indice del arreglo arrInfo en la posicion i
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaReg.join(' ') + "<br/>");//imprime el contenido del arreglo guardaReg en la pagina web
}

window.document.title = 'CSF-Query-ALHEL';//nombre de la pestaña


//pruebas del drag and drop
const contenedor = document.querySelector('#contenedor');
const input = contenedor.querySelector('#file-id');
const dragText = contenedor.querySelector('h1');

contenedor.addEventListener("change", (e) => {
    file = this.files;
})

contenedor.addEventListener('dragenter', e => {
    console.log('Drag Enter');
});
contenedor.addEventListener('dragleave', e => {
    console.log('Drag Leave');
    dragText.textContent = "Arrastra y suelta archivo"
});
contenedor.addEventListener('dragover', e => {
    e.preventDefault();
    console.log('Drag Over');
    dragText.textContent = "Suelta para subir el archivo";
});

contenedor.addEventListener('drop', e => {
    file = this.files;
    e.preventDefault();
    console.log('Drop');
    dragText.textContent = "Arrastra y suelta archivo"
});
