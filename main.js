﻿var datass = '';
var DataArr = [];
var apellidoPa = '';
var apellidoMa = '';
var nombres = '';


var guardaRFC = ""; //guarda RFC
var guardaRaSo = "";//guarda razon social
var guardaCodPos = "";//guarda codigo postal
var guardaNomVia = "";//guarda nombre de vialidad
var guardaNumExt = "";//guarda numero exterior
var guardaNumInt = "";//guarda numero interior
var guardaNomCol = "";//guarda nombre de la colonia
var guardaDemTer = "";//guarda demarcacion territorial o municipio
var guardaReg = "";//guarda regimen
var query = ""; //guarda query 
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
            document.getElementById("output").innerHTML = ("DATOS PARA EL QUERY<br/>");
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
    //extraeRFC(separaDatos); //guarda RFC
    guardaRFC = extraeRFC(separaDatos);
    //extraeRaSo(separaDatos);//guarda razon social
    guardaRaSo = extraeRaSo(separaDatos);
    //extraeCodPos(separaDatos);//guarda codigo postal
    guardaCodPos = extraeCodPos(separaDatos);
    //extraeNomVia(separaDatos);//guarda nombre de vialidad
    guardaNomVia = extraeNomVia(separaDatos);
    //extraeNumExt(separaDatos);//guarda numero exterior
    guardaNumExt = extraeNumExt(separaDatos);
    //extraeNumInt(separaDatos);//guarda numero interior
    guardaNumInt = extraeNumInt(separaDatos);
    //extraeNomCol(separaDatos);//guarda nombre de la colonia
    guardaNomCol = extraeNomCol(separaDatos);
    //extraeDemTer(separaDatos);//guarda demarcacion territorial o municipio
    guardaDemTer = extraeDemTer(separaDatos);
    //extraeReg(separaDatos);//guarda regimen
    guardaReg = extraeReg(separaDatos);

    guradaGenCod = creaGenCod(extraeRaSoAux(separaDatos), extraeRFCAux(separaDatos));//generacion y guardado del codigo

    //generando el query
    query = "set identity_insert AcProveedores on insert into AcProveedores(idProveedor, Codigo, RazonSocial, idGiro, idTipoProveedor, Rfc, idCiudad, Direccion, Colonia, CodPost, Delegacion, Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT) values(9999,'" + guradaGenCod + "','" + guardaRaSo + "',NULL,2,'" + guardaRFC + "',idCidad,'" + guardaNomVia + "," + guardaNumExt + "," + guardaNumInt + "','" + guardaNomCol + "','" + guardaCodPos + "','" + guardaDemTer + "'" + ",Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT) set identity_insert InmobiliariaCaboBallena.dbo.AcProveedores off";
    console.log(query);
}

function creaGenCod(string, string1) {
    difPer = string1.length;
    //console.log(difPer);// ver si es persona fisica o moral
    cadMaInf = string.split(' ');
    //console.log(cadMaInf);//ver contenido de cadMaInf
    arrAux = [];
    if ((difPer) == 12) {//si es persona moral
        console.log("persona moral");//recorrido de las palabras para discriminar los espacios vacios
        for (i = 0; i < cadMaInf.length; i++) {//recorrido para evitar los espacios en blanco 
            if (cadMaInf[i] != '') {//mientras que sea diferente a espacio en blanco lo imprimimos 
                if (cadMaInf[i] != 'DE') {
                    if (cadMaInf[i] != 'EL') {
                        if (cadMaInf[i] != 'LA') {
                            if (cadMaInf[i] != 'LOS') {
                                if (cadMaInf[i] != 'LAS') {
                                    console.log("estamos en los if anidados");
                                    // console.log(cadMaInf[i]);
                                    //console.log(cadMaInf[i].substring(0, 3));
                                    arrAux.push(cadMaInf[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if ((difPer) == 13) {//si es persona fisica
        console.log("soy persona fisica");
        for (i = 0; i < cadMaInf.length; i++) {//recorrido de las palabras para discriminar los espacios vacios
            if (cadMaInf[i] != '') {
                //arrCodigo.push(cadMaInf[i].substring(0, 3));
                //console.log(cadMaInf[i]);
                arrAux.push(cadMaInf[i]);
                if (arrAux[i] == undefined) {
                    break
                }
            }
        }
    }
    console.log(arrAux);
    //arrCodigo.push(cadMaInf[i].substring(0, 3));//con esta extraemos las tres primeras letras de cada palabra
    if ((difPer) == 12) {//si es persona moral
        if ((arrAux.length) >= 3) {
            //tres primeras letras de la primer palabra
            car3p = arrAux[0].substring(0, 3);
            console.log(car3p);
            //tres primeras letras de la segunda palabra
            car3s = arrAux[1].substring(0, 3);
            console.log(car3s);
            // cuatro ultimas leras de la palabra
            car4t = arrAux[2].substring(0, 4);
            console.log(car4t);
            //codigo listo
            codGen = (car3p + car3s + car4t + "MXN");
            console.log(codGen);
        }
        if ((arrAux.length) == 2) {
            //tres primeras letras de la primer palabra
            car3p = arrAux[0].substring(0, 3);
            console.log(car3p);
            //tres primeras letras de la segunda palabra
            car3s = arrAux[1].substring(0, 3);
            console.log(car3s);
            //codigo lsito
            codGen = (car3p + car3s + "????MXN");
            console.log(codGen);
        }
    }
    else if ((difPer) == 13) {//si es persona fisica 
        if ((arrAux.length) == 4) {
            //apellido paterno 3 primeros caracteres 
            car3Ap = arrAux[2].substring(0, 3);
            console.log(car3Ap);
            //apellido materno 3 primeros caracteres 
            car3Am = arrAux[3].substring(0, 3);
            console.log(car3Am);
            //nombre 4 primeros caracteres 
            car4N = arrAux[0].substring(0, 4);
            console.log(car4N);
            codGen = (car3Ap + car3Am + car4N + "MXN");
            console.log(codGen);
        }
        if ((arrAux.length) == 3) {
            //apellido paterno 3 primeros caracteres 
            car3Ap = arrAux[1].substring(0, 3);
            console.log(car3Ap);
            //apellido materno 3 primeros caracteres 
            car3Am = arrAux[2].substring(0, 3);
            console.log(car3Am);
            //nombre 4 primeros caracteres 
            car4N = arrAux[0].substring(0, 4);
            console.log(car4N);
            //codigo lsito 
            codGen = (car3Ap + car3Am + car4N + "MXN");
            console.log(codGen);
        }
        if ((arrAux.length) == 2) {
            //apellido paterno 3 primeros caracteres 
            car3Ap = arrAux[1].substring(0, 3);
            console.log(car3Ap);
            //nombre 3 primeros caracteres
            car3Am = arrAux[0].substring(0, 3);
            console.log(car3Am)
            //codigo listo 
            codGen = (car3Ap + car3Am + "????MXN");
            console.log(codGen);
        }
    }
    return codGen
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
    return arrInfo[i + 1];
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
            //console.log(arrInfo[i].substring(0, 3)); //prueba para extraer los 3 primeros caracteres de cada palabra
            guardaRaSo.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i 
        } 
    } else {
        var div = document.getElementById('output');
        div.innerHTML += ("<br/> 'EL PDF NO ES UNA CONSTANCIA FISCAL'");//valida que el pdf sea una constancia fiscal y lo imprime en la pagina web 
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaRaSo.join(' ') + "<br/>");//imprime el contenido en la pagina web
    return guardaRaSo.join(' ').split(' ').join(' ');
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
    return guardaCodPos;
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
    guardaNomViaAux=(guardaNomVia.reverse());//invierte el contenido del arreglo guardaNomVia
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaNomViaAux.join(' ') + "<br/>");//imprime el contenido en la pagina web
    return guardaNomViaAux.join(' ');
}

function extraeNumExt(string) { //funcion que extrae el numero exterior
    arrInfo = Object.values(string)  //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae numero exterior")//imprime el nombre de la funcion en consola 
    var guardaNunExt = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Exterior:"));//busqueda el indice de la palabra
    //console.log(arrInfo.indexOf("Interior:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Exterior:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Exterior:") + 1; i <= arrInfo.indexOf("Interior:") - 1 ; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            if (arrInfo[i] == "Número"){//guarda en el arreglo guardaNumExt el contenido del indice del arreglo arrInfo en la posicion i
                break
            }
            guardaNunExt.push(arrInfo[i]);//guarda el numero exterior
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaNunExt.join(' ') + "<br/>");//imprime el contenido en la pagina web
    if ((guardaNunExt.length) == 2) {
        return guardaNunExt.join(' ');

    }
    else {
        return guardaNunExt;
    }
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
        return 'NULL';
    } else { //si no se cumple lo anterior entonces 
        var div = document.getElementById('output');
        div.innerHTML += ("<br/>" + guardaNunInt.join(' ') + "<br/>");//imprime el contenido en la pagina web
        if ((guardaNunInt.length) >= 2) {
            return guardaNunInt.join(' ');

        }
        else {
            return guardaNunInt;
        }
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
        return 'NULL';
    } else {//si no se cumple lo anterior entonces
        var div = document.getElementById('output');
        div.innerHTML += ("<br/>" + guardaNomCol.join(' ') + "<br/>");//imprime el contenido del arreglo guardaNomCol en la pagina web
        return guardaNomCol.join(' ');
    }
}

function extraeDemTer(string) {//funcion que extrae la demarcacion terriotorial o el municipio 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae codigo postal ")//imprime el nombre de la funcion en consola 
    var guardaDemTer = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    //console.log(arrInfo.indexOf("Territorial:"));//busqueda el indice de la palabra
    //console.log(arrInfo.indexOf("Federativa:"));//busqueda el indice de la palabra
    if (arrInfo.includes("Territorial:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        //console.log("estoy en el if y soy true")//verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Territorial:") + 1; i <= arrInfo.indexOf("Federativa:") - 5; i++) {
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            guardaDemTer.push(arrInfo[i]);//guarda en el arreglo guardaReg el contenido del indice del arreglo arrInfo en la posicion i
        }
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaDemTer.join(' ') + "<br/>");//imprime el contenido del arreglo guardaReg en la pagina web
    return guardaDemTer.join(' ');
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
    //return guardaReg;
}

//"set identity_insert InmobiliariaCaboBallena.dbo.AcProveedores on insert into InmobiliariaCaboBallena.dbo.AcProveedores(idProveedor, Codigo, RazonSocial, idGiro, idTipoProveedor, Rfc, idCiudad, Direccion, Colonia, CodPost, Delegacion, Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT)values(9999, 'CISMEDMIGUMXN', 'extraeRaSo', NULL, 2, 'CIMM6909298U9', idCiudad, '5 DE FEBRERO, MANZANA 129, LOTE 13', 'RICARDO FLORES MAGON', '39700', 'ACAPULCO DE JUAREZ', Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT) set identity_insert InmobiliariaCaboBallena.dbo.AcProveedores off";


//descarga .sql
function download(filename, query) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(query));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
// Start file download.
document.getElementById("dwn-btn").addEventListener("click", function () {
    var filename = "query.sql";
    download(filename, query);
}, false);


function extraeRFCAux(string) { //funcion que extrae el pdf 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    for (i = 0; i < arrInfo.length; i++) { //recorrido del arreglo
        if (arrInfo[i] == "RFC:") { //cuando el indice i del arreglo seo igual a rfc
            //console.log(arrInfo[i + 1]);  //imprime el contenido del indice+1 para obtener el rfc en consola
            break //salimos del bucle
        }
    }
    return arrInfo[i + 1];
}

function extraeRaSoAux(string) { //funcion que extrae la razon social 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    //console.log("estoy en la funcion extrae razon social ") //imprime el nombre de la funcion en consola 
    var guardaRaSo = []; //declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    console.log(arrInfo.indexOf("Contribuyentes"));//busqueda el indice de la palabra
    console.log(arrInfo.indexOf("Nombre,"));//busqueda el indice de la palabra
    if (arrInfo.includes("Contribuyentes") == true) { //si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion 
        //console.log("estoy en el if y soy true") //verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Contribuyentes") + 1; i <= arrInfo.indexOf("Nombre,") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
            guardaRaSo.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i 
        }
    }
    return guardaRaSo.join(' ');
}

window.document.title = 'CSF-QUERY-ALHEL';//nombre de la pestaña