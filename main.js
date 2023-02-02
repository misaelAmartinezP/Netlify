var datass = '';
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
var guardaBanco = "";//guarda nombre del banco
var guardaClabe = "";//guardaClabe bancaria
var guardaCtaBancaria = ""; //guarda cuenta bancaria
var guardaBancoSat = "";//gurada banco sat
var guardaMonedaSat = "";//guarda moneda sat
var guardaTipoCuenta = "";//guarda tipo de cuenta sat
var guardaConceptoCie = "";//guarda concepto de cie
var guardaConvenioCie = "";//guarda convenio de cie
var guardaReferencia = "";//guarda referenica
var guardaClaveTransferencia = "";//guarda clave de tranferencia

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
                //var div = document.getElementById('output');
                //div.innerHTML += (outputStr + pagesText[pageNum]);//esta linea de codigo se encarga de imprimir el contenido del archivo 
                outputStr = "";
                outputStr = "<br/><br/>Page " + (pageNum + 1) + " contents <br/> <br/>";
                //var div = document.getElementById('output');
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
    query = "set identity_insert AcProveedores on insert into AcProveedores(idProveedor, Codigo, RazonSocial, idGiro, idTipoProveedor, Rfc, idCiudad, Direccion, Colonia, CodPost, Delegacion, Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT) values(9999,'" + guradaGenCod + "','" + guardaRaSo + "',NULL,2,'" + guardaRFC + "',idCidad,'" + guardaNomVia + ", " + guardaNumExt + ", " + guardaNumInt + "','" + guardaNomCol + "','" + guardaCodPos + "','" + guardaDemTer + "'" + ",Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT) set identity_insert AcProveedores off";
    //console.log(query);
}
function creaGenCod(string, string1) {//funcion para generar el codigo 
    difPer = string1.length;//variable para diferenciar entre persona fisica y moral 
    //console.log(difPer);// ver si es persona fisica o moral
    cadMaInf = string.split(' ');//recibe el contenido que devulve extraeRaSoAux
    //console.log(cadMaInf);//ver contenido de cadMaInf
    arrAux = [];//arreglo auxiliar vacio para guardar las palabras de las razones sociales 
    if ((difPer) == 12) {//si es persona moral
        //console.log("persona moral");//recorrido de las palabras para discriminar los espacios vacios
        for (i = 0; i < cadMaInf.length; i++) {//recorrido para evitar los espacios en blanco 
            if (cadMaInf[i] != '') {//mientras que sea diferente a espacio en blanco lo imprimimos 
                if (cadMaInf[i] != 'DE') {//si la palabra es 'DE' se omite 
                    if (cadMaInf[i] != 'EL') {//si la palabra es 'EL' se omite 
                        if (cadMaInf[i] != 'LA') {//si la palabra es 'LA' se omite 
                            if (cadMaInf[i] != 'LOS') {//si la palabra es 'LOS' se omite 
                                if (cadMaInf[i] != 'LAS') {//si la palabra es 'LAS' se omite 
                                    //console.log("estamos en los if anidados");//comprobacion de funcionamiento de los ifs
                                    // console.log(cadMaInf[i]); //variable para ver el contenido de 
                                    //console.log(cadMaInf[i].substring(0, 3));//prueba para extraer solo 3 caracteres de la palabra
                                    arrAux.push(cadMaInf[i]);//manda todos los valores que hayan sido diferentes a los antes omitidos por los if y los guarda en arrAux
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if ((difPer) == 13) {//si es persona fisica
        //console.log("soy persona fisica");
        for (i = 0; i < cadMaInf.length; i++) {//recorrido de las palabras para discriminar los espacios vacios
            if (cadMaInf[i] != '') { //omite los espacios en blanco 
                // console.log(cadMaInf[i]); //variable para ver el contenido de 
                //console.log(cadMaInf[i].substring(0, 3));//prueba para extraer solo 3 caracteres de la palabra
                arrAux.push(cadMaInf[i]);//enviar los datos para guardarlos en el arrAux
                if (arrAux[i] == undefined) {//si hay un valor undefined termina el for 
                    break
                }
            }
        }
    }
    //console.log(arrAux);//ver el contenido de arrAux
    //arrCodigo.push(cadMaInf[i].substring(0, 3));//con esta extraemos las tres primeras letras de cada palabra
    if ((difPer) == 12) {//si es persona moral
        if ((arrAux.length) >= 3) {//contamos las paralabras que tiene arrAux y si este es 3 o mayor a tres se hara 
            car3p = arrAux[0].substring(0, 3);//variable que guarda y extrae las 3 primeras letras de la primer palabra
            //console.log(car3p);//ver el contenido de la variable car3p
            car3s = arrAux[1].substring(0, 3);//variable que guarda y extrae las 3 primeras letras de la segunda palabra
            //console.log(car3s);//ver el contenido de la variable car3p
            car4t = arrAux[2].substring(0, 4);//variable que guarda y extrae las 4 primeras letras de la tercer palabra
            //console.log(car4t);//ver el contenido de la variable car3p
            codGen = (car3p + car3s + car4t + "MXN");//codigo listo, generacion del codigo 
            //console.log(codGen);//imprime el codigo
        }
        if ((arrAux.length) == 2) {
            car3p = arrAux[0].substring(0, 3);//variable que guarda y extrae las 3 primeras letras de la primer palabra
            //console.log(car3p);//ver el contenido de la variable car3p
            car3s = arrAux[1].substring(0, 3);//variable que guarda y extrae las 3 primeras letras de la segunda palabra
            //console.log(car3s);//ver el contenido de la variable car3p
            codGen = (car3p + car3s + "????MXN");//codigo listo, generacion del codigo 
            //console.log(codGen);//imprime el codigo
        }
    }
    else if ((difPer) == 13) {//si es persona fisica 
        if ((arrAux.length) == 4) {//si la longitud de la palabra es igual a 4 
            car3Ap = arrAux[2].substring(0, 3);//apellido paterno 3 primeros caracteres 
            //console.log(car3Ap);//ver el contenido de la variable
            car3Am = arrAux[3].substring(0, 3); //apellido materno 3 primeros caracteres
            //console.log(car3Am);//ver el contenido de la variable
            car4N = arrAux[0].substring(0, 4);//nombre 4 primeros caracteres 
            //console.log(car4N);//ver el contenido de la variable
            codGen = (car3Ap + car3Am + car4N + "MXN");
            //console.log(codGen);//imprime el codigo
        }
        if ((arrAux.length) == 3) {//si la longitud de la palabra es igual a 3
            car3Ap = arrAux[1].substring(0, 3); //apellido paterno 3 primeros caracteres
            //console.log(car3Ap);//ver el contenido de la variable
            car3Am = arrAux[2].substring(0, 3);//apellido materno 3 primeros caracteres
            //console.log(car3Am);//ver el contenido de la variable
            car4N = arrAux[0].substring(0, 4);//nombre 4 primeros caracteres
            //console.log(car4N);//ver el contenido de la variable
            codGen = (car3Ap + car3Am + car4N + "MXN");//codigo lsito
            //console.log(codGen);//imprime el codigo
        }
        if ((arrAux.length) == 2) {//si la longitud de la palabra es igual a 2
            car3Ap = arrAux[1].substring(0, 3);//apellido paterno 3 primeros caracteres 
            //console.log(car3Ap);//ver el contenido de la variable
            car3Am = arrAux[0].substring(0, 3);//nombre 3 primeros caracteres
            //console.log(car3Am);//ver el contenido de la variable
            codGen = (car3Ap + car3Am + "????MXN");//codigo listo 
            //console.log(codGen);//imprime el codigo
        }
    }
    if ((codGen.length) == 13) {//verifica que el codigo sea de la longitud necesaria 
        return codGen //si es la longitud deseada regresa el codigo 
    } else {//si no 
        if ((arrAux.length) >= 3) {
            //tres primeras letras de la primer palabra
            car3p = arrAux[0].substring(0, 3);
            //console.log(car3p);
            //primera letras de la segunda palabra
            car1s = arrAux[1].substring(0, 1);
            //console.log(car3s);
            //primera letra de la tercer palabra
            car1t = arrAux[2].substring(0, 1);
            //console.log(car4t);
            //ultima lera de la cuarta palabra
            car1c = arrAux[3].substring(0, 1);
            //console.log(car4t);
            //codigo listo
            codGen = (car3p + car3s + car4t + car1c + "????MXN");
            //console.log(codGen);
            return codGen
        }
    }

}
function extraeRFC(string) { //funcion que extrae el pdf 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo 
    for (i = 0; i < arrInfo.length; i++) { //recorrido del arreglo
        if (arrInfo[i] == "RFC:") { //cuando el indice i del arreglo seo igual a rfc
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
            if (arrInfo[i] != '') {
                //console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
                //console.log(arrInfo[i].substring(0, 3)); //prueba para extraer los 3 primeros caracteres de cada palabra
                guardaRaSo.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i 
            }
        }
    } else {
        var div = document.getElementById('output');
        div.innerHTML += ("<br/> 'EL PDF NO ES UNA CONSTANCIA FISCAL'");//valida que el pdf sea una constancia fiscal y lo imprime en la pagina web 
    }
    var div = document.getElementById('output');
    div.innerHTML += ("<br/>" + guardaRaSo.join(' ') + "<br/>");//imprime el contenido en la pagina web
    return guardaRaSo.join(' ');
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
        for (i = arrInfo.indexOf("Exterior:") - 2; i >= arrInfo.indexOf("Vialidad:"); i--) { //recorrido para encontrar la informacion que necesitamos 
            if (arrInfo[i] == "Vialidad:") {//si encontramos que el idice de la posicion arrInfo[i] es igual a Vialidad: termina el recorrido 
                break
            }
            guardaNomVia.push(arrInfo[i]);//guarda en el arreglo guardaNomVia el contenido del indice del arreglo arrInfo en la posicion i
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
        }
    }
    guardaNomViaAux = (guardaNomVia.reverse());//invierte el contenido del arreglo guardaNomVia
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
        for (i = arrInfo.indexOf("Exterior:") + 1; i <= arrInfo.indexOf("Interior:") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]);//ver en consola si el contenido es el esperado
            if (arrInfo[i] == "Número") {//guarda en el arreglo guardaNumExt el contenido del indice del arreglo arrInfo en la posicion i
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
        for (i = arrInfo.indexOf("Interior:") + 1; i <= arrInfo.indexOf("Colonia:") - 4; i++) {//recorrido de indices para obtener la informacion necesaria
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
        for (i = arrInfo.indexOf("Regímenes:") + 8; i <= arrInfo.indexOf("Obligaciones:") - 2; i++) {
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
// comineza la descarga
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
    //console.log(arrInfo.indexOf("Contribuyentes"));//busqueda el indice de la palabra
    //console.log(arrInfo.indexOf("Nombre,"));//busqueda el indice de la palabra
    if (arrInfo.includes("Contribuyentes") == true) { //si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion 
        //console.log("estoy en el if y soy true") //verificar que si se cumplio la condicion linea de apoyo 
        for (i = arrInfo.indexOf("Contribuyentes") + 1; i <= arrInfo.indexOf("Nombre,") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
            //console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
            guardaRaSo.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i 
        }
    }
    return guardaRaSo.join(' ');
}


function guardar() {
    var banco = document.getElementById("banco").value;//guarda banco 
    //conso.log(banco);
    var clabe = document.getElementById("clabe").value;//guarda clabe
    //conso.log(clabe);
    var ctaBancaria = document.getElementById("ctaBancaria").value;//guarda cuenta bancaria 
    //conso.log(ctaBancaria);
    var bancoSat = document.getElementById("bancoSat").value;//guarda banco sat
    //conso.log(bancoSat);
    var monedaSat = document.getElementById("monedaSat").value;//guarda moneda SAT
    //conso.log(monedaSat);
    var tipoCuenta = document.getElementById("tipoCuenta").value;//guarda tipo de cuenta
    //conso.log(tipoCuenta);
    var conceptoCie = document.getElementById("conceptoCie").value;//guarda concepto CIE
    //conso.log(conceptoCie);
    var convenioCie = document.getElementById("convenioCie").value;//guarda convenio de CIE
    //conso.log(convenioCie);
    var referencia = document.getElementById("referencia").value;//guarda referencia 
    //conso.log(referencia);
    var claveTransferencia = document.getElementById("claveTransferencia").value;//guarda clave de tranferencia
    //conso.log(claveTransferencia);

    if (banco == "") {//verifica que el campo banco no este vacio
        alert("SE REQUIERE NOMBRE DEL BANCO");
        document.getElementById("banco").focus();
    } if (clabe == "") { //verifica que el campo clabe no este vacio
        alert("SE REQUIERE CLABE BANCARIA");
        document.getElementById("clabe").focus();
    } if (ctaBancaria == "") {//verifica que el campo cuenta bancaria no este vacio
        alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
    } if (bancoSat == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        //document.getElementById("ctaBancaria").focus();
        bancoSat='NULL'
    } if (monedaSat == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
        monedaSat = 'NULL'
    } if (tipoCuenta == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
        tipoCuenta = 'NULL'
    } if (conceptoCie == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
        conceptoCie = 'NULL'
    } if (convenioCie == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
        convenioCie = 'NULL'
    } if (referencia == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
        referencia = 'NULL'
    } if (claveTransferencia == "") {//verifica que el campo cuenta bancaria no este vacio
        //alert("SE REQUIERE CUENTA BANCARIA");
        document.getElementById("ctaBancaria").focus();
        claveTransferencia = 'NULL'
    }

    guardaBanco = banco;//pasa nombre del banco
    guardaClabe = clabe;//pasaClabe bancaria
    guardaCtaBancaria = ctaBancaria; //pasa cuenta bancaria
    guardaBancoSat = bancoSat;//gurada banco sat
    guardaMonedaSat = monedaSat;//pasa moneda sat
    guardaTipoCuenta = tipoCuenta;//pasa tipo de cuenta sat
    guardaConceptoCie = conceptoCie;//pasa concepto de cie
    guardaConvenioCie = convenioCie;//pasa convenio de cie
    guardaReferencia = referencia;//pasa referenica
    guardaClaveTransferencia = claveTransferencia;//pasa clave de tranferencia
    console.log("datos de variable globales")
    console.log(guardaBanco);
    console.log(guardaClabe);
    console.log(guardaCtaBancaria);
    console.log(guardaBancoSat);
    console.log(guardaMonedaSat);
    console.log(guardaTipoCuenta);
    console.log(guardaConceptoCie); 
    console.log(guardaConvenioCie);
    console.log(guardaReferencia);
    console.log(guardaClaveTransferencia);
}


window.document.title = 'CSF-QUERY-ALHEL';//nombre de la pestaña