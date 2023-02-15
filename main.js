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
var guardaCtaConta1 = ""; //guarda cuenta contable
var guardaCtaConta2 = ""; //guarda cuenta contable
var guardaCtaAnt1 = ""; //guarda cunenta anticipo
var guardaCtaAnt2 = ""; //guarda cunenta anticipo 
var queryCtas = "";
var queryAnt = "";

alert("Llenar primero los datos bancarios")
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
    //extraeRFC(separaDatos); 
    guardaRFC = extraeRFC(separaDatos);//guarda RFC
    guardaRaSo = extraeRaSo(separaDatos);    //extraeRaSo(separaDatos);//guarda razon social
    guardaCodPos = extraeCodPos(separaDatos);    //extraeCodPos(separaDatos);//guarda codigo postal
    guardaNomVia = extraeNomVia(separaDatos);    //extraeNomVia(separaDatos);//guarda nombre de vialidad
    guardaNumExt = extraeNumExt(separaDatos);    //extraeNumExt(separaDatos);//guarda numero exterior
    guardaNumInt = extraeNumInt(separaDatos);    //extraeNumInt(separaDatos);//guarda numero interior
    guardaNomCol = extraeNomCol(separaDatos);    //extraeNomCol(separaDatos);//guarda nombre de la colonia
    guardaDemTer = extraeDemTer(separaDatos);    //extraeDemTer(separaDatos);//guarda demarcacion territorial o municipio
    guardaReg = extraeReg(separaDatos);   //extraeReg(separaDatos);//guarda regimen
    guradaGenCod = creaGenCod(extraeRaSoAux(separaDatos), extraeRFCAux(separaDatos));//generacion y guardado del codigo
    guardaPersonaMoral = personaMoral(extraeRFCAux(separaDatos));//determina 1 o 0 para campo personaMoral
    guardaBancoSat = bancoSat(guardaBanco);//este es la Clave que da el SAT
    guardaIdBancoSat = idBancoSat(guardaBanco);//este es de nuestro catalogo
    guardaPersonaFisNom = personaFisNom(separaDatos, extraeRFCAux(separaDatos));//nombre para persona fisica 
    gaurdaPersonaFisApPa = personaFisApPa(separaDatos, extraeRFCAux(separaDatos));//primer apellido para persona fisica 
    gaurdaPersonaFisApMa = personaFisApMa(separaDatos, extraeRFCAux(separaDatos));//segundo apellido para persona fisica 
    guardaIdCiudad = idCiudad(extraeCodPosAux(separaDatos)); //genera id cidad
    guardaTipoOracion = descripcionTipOracion(gaurdaPersonaFisApPa, gaurdaPersonaFisApMa, guardaPersonaFisNom, guardaRaSo, guardaRFC)//tipo oracion
    //query="set identity_insert InmobiliariaCaboBallena.dbo.AcProveedores on insert into InmobiliariaCaboBallena.dbo.AcProveedores(idProveedor, Codigo, RazonSocial, idGiro, idTipoProveedor, Rfc, idCiudad, Direccion, Colonia, CodPost, Delegacion, Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT)values   (9999, 'CISMEDMIGUMXN', 'extraeRaSo', NULL, 2, 'CIMM6909298U9', idCiudad, '5 DE FEBRERO, MANZANA 129, LOTE 13', 'RICARDO FLORES MAGON', '39700', 'ACAPULCO DE JUAREZ', Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT) set identity_insert InmobiliariaCaboBallena.dbo.AcProveedores off";

    //generando el query                                                   //idProveedor, Codigo, RazonSocial, idGiro, idTipoProveedor, Rfc, idCiudad, Direccion, Colonia, CodPost, Delegacion, Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT, TipoDeCuentaCASH, ConceptoCIECASH, ReferenciaCIECASH, ConvenioCIECASH, NumRegIdFiscal, PlazaBanxico, IdPais, IdClaveTransferencia, Nacionalidad, Sucursal, IdCuentaPagoEnEspecie, IdCuentaOtrasRetenciones

    guardaQueryCtas = querysCtas(extraeRFCAux(separaDatos), guardaTipoOracion , guardaCtaConta1, guardaCtaConta2, guardaCtaAnt1, guardaCtaAnt2, guardaRaSo);
    query = "\n" + queryCtas + "\n" + queryAnt + "\n set identity_insert AcProveedores on \n insert into AcProveedores(idProveedor, Codigo, RazonSocial, idGiro, idTipoProveedor, Rfc, idCiudad, Direccion, Colonia, CodPost, Delegacion, Telefono, Fax, Mail, LimiteCredito, DiasCredito, DiasEntrega, CalifPuntualidad, CalifCalidad, Contacto, NombreJefe, PuestoJefe, Observaciones, RegistroPatronal, RegistroCamara, Infonavit, TipoFiscal, idTipoMoneda, Nombre, ApellidoPaterno, ApellidoMaterno, Celular, PaginaWeb, CondicionesPago, PersonaMoral, CURP, PersonasAtiendenPedidos, Suspendido, IdCuentaProveedor, IdCuentaAnticipo, IdCuentaFonGar, IdCuentaDeudor, ConPagoElectronico, CLABE, Banco, IdTipoTerceros, IdTipoOperacion, GastosFinancieros, ClaveCliente, CodigoSAP, IdAgaCatAcreedor, PermitirExentoIVA, CuentaBancaria, IdBancoSAT, MonedaSATDefault, BancoSAT, TipoDeCuentaCASH, ConceptoCIECASH, ReferenciaCIECASH, ConvenioCIECASH, NumRegIdFiscal, PlazaBanxico, IdPais, IdClaveTransferencia, Nacionalidad, Sucursal, IdCuentaPagoEnEspecie, IdCuentaOtrasRetenciones) \n select 9999,'" + guradaGenCod + "','" + guardaRaSo + "',NULL,2,'" + guardaRFC + "','" + guardaIdCiudad + "','" + guardaNomVia + ", " + guardaNumExt + ", " + guardaNumInt + "','" + guardaNomCol + "','" + guardaCodPos + "','" + guardaDemTer + "'" + ",'NULL', 'NULL', 'NULL', 0, 0, 0, 0, 0, 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 6,'" + guardaPersonaFisNom + "','" + gaurdaPersonaFisApPa + "', '" + gaurdaPersonaFisApMa + "', 'NULL', 'NULL', 'NULL'," + guardaPersonaMoral + ", 'NULL', 'NULL', 0, " + guardaCtaConta1 + ", " + guardaCtaAnt1 + ", NULL, NULL, 0,'" + guardaClabe + "','" + guardaBanco + "', '1', '4', '0', 'NULL', 'NULL', NULL, 0, '" + guardaCtaBancaria + "'," + guardaIdBancoSat + ",'MXN','" + guardaBancoSat + "', '', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 6853, NULL, 'NULL', 'NULL', NULL, NULL \nwhere not exists (select Codigo from AcProveedores where Codigo='" + guradaGenCod + "') \n set identity_insert AcProveedores off  \n ";
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
                                    if (cadMaInf[i] != 'Y') {
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
        if ((arrAux.length) >= 4) {
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
        if ((arrAux.length) == 3) {
            if ((arrAux[0].length) == 2) {
                car3p = arrAux[0] + "?"
            } else {
                //tres primeras letras de la primer palabra
                car3p = arrAux[0].substring(0, 3);
                //console.log(car3p);
            }
            //primera letras de la segunda palabra
            car1s = arrAux[1].substring(0, 3);
            //console.log(car3s);
            //primera letra de la tercer palabra
            car1t = arrAux[2].substring(0, 4);
            //codigo listo
            codGen = (car3p + car1s + car1t  + "MXN");
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

const fecha = new Date();
fechaQuery = fecha.toLocaleDateString();
//console.log(fechaQuery);

// comineza la descarga
document.getElementById("dwn-btn").addEventListener("click", function () {
    var filename = fechaQuery + "_CtbCuentas,AcProveedores_" + guardaRFC + ".sql";
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
    var banco = document.getElementById("banco1").value;//guarda banco 
    //console.log(banco);
    guardaBanco = banco;//pasa nombre del banco
    var clabe = document.getElementById("clabe").value;//guarda clabe
    //console.log(clabe);
    guardaClabe = clabe;
    var ctaBancaria = document.getElementById("ctaBancaria").value;//guarda cuenta bancaria 
    //console.log(ctaBancaria);
    guardaCtaBancaria = ctaBancaria;

    if ((clabe.length) < 18) {//Verificacion de la clabe
        alert("La longitud de la CLABE no puede tener menos de 18 digitos");
        document.getElementById("clabe").focus();
    } if ((clabe.length) > 18) {//verificacion de la clabe 
        alert("La longitud de la CLABE tiene que ser igual a 18 digitos");
        document.getElementById("clabe").focus();
    }if (banco == "") {//verifica que el campo banco no este vacio
        alert("Se requiere nombre del banco");
        document.getElementById("banco1").focus();
    } if (clabe == "") { //verifica que el campo clabe no este vacio
        alert("Se requiere CLABE bancaria");
        document.getElementById("clabe").focus();
    } if (ctaBancaria == "") {//verifica que el campo cuenta bancaria no este vacio
        alert("Se requiere cuenta bancaria");
        document.getElementById("ctaBancaria").focus();
    } if ((clabe.length) == 18 && banco != "" && clabe != "") {
        document.getElementById("banco1").value = "";
        document.getElementById("clabe").value = "";
        document.getElementById("ctaBancaria").value = "";
        alert("Datos bancarios guardados");
        alert("Llenar datos de cuentas contables y cuenta anticipo")
        
    }
}

function bancoSat(string) {//este es la Clave que da el SAT
    nomBanco = string;
    if (nomBanco == 'BANAMEX') { return '002' }
    if (nomBanco == 'BANCOMEXT') { return '006' }
    if (nomBanco == 'BANOBRAS') { return '009' }
    if (nomBanco == 'BBVA BANCOMER') { return '012' }
    if (nomBanco == 'SANTANDER') { return '014' }
    if (nomBanco == 'BANJERCITO') { return '019' }
    if (nomBanco == 'HSBC') { return '021' }
    if (nomBanco == 'BAJIO') { return '030' }
    if (nomBanco == 'IXE') { return '032' }
    if (nomBanco == 'INBURSA') { return '036' }
    if (nomBanco == 'INTERACCIONES') { return '037' }
    if (nomBanco == 'MIFEL') { return '042' }
    if (nomBanco == 'SCOTIABANK') { return '044' }
    if (nomBanco == 'BANREGIO') { return '058' }
    if (nomBanco == 'INVEX') { return '059' }
    if (nomBanco == 'BANSI') { return '060' }
    if (nomBanco == 'AFIRME') { return '062' }
    if (nomBanco == 'BANORTE') { return '072' }
    if (nomBanco == 'THE ROYAL BANK') { return '102' }
    if (nomBanco == 'AMERICAN EXPRESS') { return '103' }
    if (nomBanco == 'BAMSA') { return '106' }
    if (nomBanco == 'TOKYO') { return '108' }
    if (nomBanco == 'JP MORGAN') { return '110' }
    if (nomBanco == 'BMONEX') { return '112' }
    if (nomBanco == 'VE POR MAS') { return '113' }
    if (nomBanco == 'ING') { return '116' }
    if (nomBanco == 'DEUTSCHE') { return '124' }
    if (nomBanco == 'CREDIT SUISSE') { return '126' }
    if (nomBanco == 'AZTECA') { return '127' }
    if (nomBanco == 'AUTOFIN') { return '128' }
    if (nomBanco == 'BARCLAYS') { return '129' }
    if (nomBanco == 'COMPARTAMOS') { return '130' }
    if (nomBanco == 'BANCO FAMSA') { return '131' }
    if (nomBanco == 'BMULTIVA') { return '132' }
    if (nomBanco == 'ACTINVER') { return '133' }
    if (nomBanco == 'WAL-MART') { return '134' }
    if (nomBanco == 'NAFIN') { return '135' }
    if (nomBanco == 'INTERBANCO') { return '136' }
    if (nomBanco == 'BANCOPPEL') { return '137' }
    if (nomBanco == 'ABC CAPITAL') { return '138' }
    if (nomBanco == 'UBS BANK') { return '139' }
    if (nomBanco == 'CONSUBANCO') { return '140' }
    if (nomBanco == 'VOLKSWAGEN') { return '141' }
    if (nomBanco == 'CIBANCO') { return '143' }
    if (nomBanco == 'BBASE') { return '145' }
    if (nomBanco == 'BANSEFI') { return '166' }
    if (nomBanco == 'HIPOTECARIA') { return '168' }
    if (nomBanco == 'MONEXCB') { return '600' }
    if (nomBanco == 'GBM') { return '601' }
    if (nomBanco == 'MASARI') { return '602' }
    if (nomBanco == 'VALUE') { return '605' }
    if (nomBanco == 'ESTRUCTURADORES') { return '606' }
    if (nomBanco == 'TIBER') { return '607' }
    if (nomBanco == 'VECTOR') { return '608' }
    if (nomBanco == 'B&B') { return '610' }
    if (nomBanco == 'ACCIVAL') { return '614' }
    if (nomBanco == 'MERRILL LYNCH') { return '615' }
    if (nomBanco == 'FINAMEX') { return '616' }
    if (nomBanco == 'VALMEX') { return '617' }
    if (nomBanco == 'UNICA') { return '618' }
    if (nomBanco == 'MAPFRE') { return '619' }
    if (nomBanco == 'PROFUTURO') { return '620' }
    if (nomBanco == 'CB ACTINVER') { return '621' }
    if (nomBanco == 'OACTIN') { return '622' }
    if (nomBanco == 'SKANDIA') { return '623' }
    if (nomBanco == 'CBDEUTSCHE') { return '626' }
    if (nomBanco == 'ZURICH') { return '627' }
    if (nomBanco == 'ZURICHVI') { return '628' }
    if (nomBanco == 'SU CASITA') { return '629' }
    if (nomBanco == 'CB INTERCAM') { return '630' }
    if (nomBanco == 'CI BOLSA') { return '631' }
    if (nomBanco == 'BULLTICK CB') { return '632' }
    if (nomBanco == 'STERLING') { return '633' }
    if (nomBanco == 'FINCOMUN') { return '634' }
    if (nomBanco == 'HDI SEGUROS') { return '636' }
    if (nomBanco == 'ORDER') { return '637' }
    if (nomBanco == 'AKALA') { return '638' }
    if (nomBanco == 'CB JPMORGAN') { return '640' }
    if (nomBanco == 'REFORMA') { return '642' }
    if (nomBanco == 'STP') { return '646' }
    if (nomBanco == 'TELECOMM') { return '647' }
    if (nomBanco == 'EVERCORE') { return '648' }
    if (nomBanco == 'SKANDIA') { return '649' }
    if (nomBanco == 'SEGMTY') { return '651' }
    if (nomBanco == 'ASEA') { return '652' }
    if (nomBanco == 'KUSPIT') { return '653' }
    if (nomBanco == 'SOFIEXPRESS') { return '655' }
    if (nomBanco == 'UNAGRA') { return '656' }
    if (nomBanco == 'OPCIONES EMPRESARIALES') { return '659' }
    if (nomBanco == 'CLS') { return '901' }
    if (nomBanco == 'INDEVAL') { return '902' }
    if (nomBanco == 'LIBERTAD') { return '670' }
    if (nomBanco == 'N/A') { return '999' }
}
function idBancoSat(string) {//este es nuestro id de la base de datos
    nomIdBancoSat = string;
    //console.log(nomIdBancoSat);
    if (nomIdBancoSat == 'BANAMEX') { return '1' }
    if (nomIdBancoSat == 'BANCOMEXT') { return '2' }
    if (nomIdBancoSat == 'BANOBRAS') { return '3' }
    if (nomIdBancoSat == 'BBVA BANCOMER') { return '4' }
    if (nomIdBancoSat == 'SANTANDER') { return '5' }
    if (nomIdBancoSat == 'BANJERCITO') { return '6' }
    if (nomIdBancoSat == 'HSBC') { return '7' }
    if (nomIdBancoSat == 'BAJIO') { return '8' }
    if (nomIdBancoSat == 'IXE') { return '9' }
    if (nomIdBancoSat == 'INBURSA') { return '10' }
    if (nomIdBancoSat == 'INTERACCIONES') { return '11' }
    if (nomIdBancoSat == 'MIFEL') { return '12' }
    if (nomIdBancoSat == 'SCOTIABANK') { return '13' }
    if (nomIdBancoSat == 'BANREGIO') { return '14' }
    if (nomIdBancoSat == 'INVEX') { return '15' }
    if (nomIdBancoSat == 'BANSI') { return '16' }
    if (nomIdBancoSat == 'AFIRME') { return '17' }
    if (nomIdBancoSat == 'BANORTE') { return '18' }
    if (nomIdBancoSat == 'THE ROYAL BANK') { return '19' }
    if (nomIdBancoSat == 'AMERICAN EXPRESS') { return '20' }
    if (nomIdBancoSat == 'BAMSA') { return '21' }
    if (nomIdBancoSat == 'TOKYO') { return '22' }
    if (nomIdBancoSat == 'JP MORGAN') { return '23' }
    if (nomIdBancoSat == 'BMONEX') { return '24' }
    if (nomIdBancoSat == 'VE POR MAS') { return '25' }
    if (nomIdBancoSat == 'ING') { return '26' }
    if (nomIdBancoSat == 'DEUTSCHE') { return '27' }
    if (nomIdBancoSat == 'CREDIT SUISSE') { return '28' }
    if (nomIdBancoSat == 'AZTECA') { return '29' }
    if (nomIdBancoSat == 'AUTOFIN') { return '30' }
    if (nomIdBancoSat == 'BARCLAYS') { return '31' }
    if (nomIdBancoSat == 'COMPARTAMOS') { return '32' }
    if (nomIdBancoSat == 'BANCO FAMSA') { return '33' }
    if (nomIdBancoSat == 'BMULTIVA') { return '34' }
    if (nomIdBancoSat == 'ACTINVER') { return '35' }
    if (nomIdBancoSat == 'WAL-MART') { return '36' }
    if (nomIdBancoSat == 'NAFIN') { return '37' }
    if (nomIdBancoSat == 'INTERBANCO') { return '38' }
    if (nomIdBancoSat == 'BANCOPPEL') { return '39' }
    if (nomIdBancoSat == 'ABC CAPITAL') { return '40' }
    if (nomIdBancoSat == 'UBS BANK') { return '41' }
    if (nomIdBancoSat == 'CONSUBANCO') { return '42' }
    if (nomIdBancoSat == 'VOLKSWAGEN') { return '43' }
    if (nomIdBancoSat == 'CIBANCO') { return '44' }
    if (nomIdBancoSat == 'BANSEFI') { return '45' }
    if (nomIdBancoSat == 'HIPOTECARIA FEDERAL') { return '46' }
    if (nomIdBancoSat == 'MONEXCB') { return '47' }
    if (nomIdBancoSat == 'GBM') { return '48' }
    if (nomIdBancoSat == 'MASARI') { return '49' }
    if (nomIdBancoSat == 'VALUE') { return '50' }
    if (nomIdBancoSat == 'ESTRUCTURADORES') { return '51' }
    if (nomIdBancoSat == 'TIBER') { return '52' }
    if (nomIdBancoSat == 'VECTOR') { return '53' }
    if (nomIdBancoSat == 'B&B') { return '54' }
    if (nomIdBancoSat == 'ACCIVAL') { return '55' }
    if (nomIdBancoSat == 'MERRILL LYNCH') { return '56' }
    if (nomIdBancoSat == 'FINAMEX') { return '57' }
    if (nomIdBancoSat == 'VALMEX') { return '58' }
    if (nomIdBancoSat == 'UNICA') { return '59' }
    if (nomIdBancoSat == 'MAPFRE') { return '60' }
    if (nomIdBancoSat == 'PROFUTURO') { return '61' }
    if (nomIdBancoSat == 'CB ACTINVER') { return '62' }
    if (nomIdBancoSat == 'OACTIN') { return '63' }
    if (nomIdBancoSat == 'SKANDIA') { return '64' }
    if (nomIdBancoSat == 'CBDEUTSCHE') { return '65' }
    if (nomIdBancoSat == 'ZURICH') { return '66' }
    if (nomIdBancoSat == 'ZURICHVI') { return '67' }
    if (nomIdBancoSat == 'SU CASITA') { return '68' }
    if (nomIdBancoSat == 'CB INTERCAM') { return '69' }
    if (nomIdBancoSat == 'CI BOLSA') { return '70' }
    if (nomIdBancoSat == 'BULLTICK CB') { return '71' }
    if (nomIdBancoSat == 'STERLING') { return '72' }
    if (nomIdBancoSat == 'FINCOMUN') { return '73' }
    if (nomIdBancoSat == 'HDI SEGUROS') { return '74' }
    if (nomIdBancoSat == 'ORDER') { return '75' }
    if (nomIdBancoSat == 'AKALA') { return '76' }
    if (nomIdBancoSat == 'CB JPMORGAN') { return '77' }
    if (nomIdBancoSat == 'REFORMA') { return '78' }
    if (nomIdBancoSat == 'CB BANORTE') { return '79' }
    if (nomIdBancoSat == 'STP') { return '80' }
    if (nomIdBancoSat == 'TELECOMM') { return '81' }
    if (nomIdBancoSat == 'EVERCORE') { return '82' }
    if (nomIdBancoSat == 'SKANDIA') { return '83' }
    if (nomIdBancoSat == 'SEGMTY') { return '84' }
    if (nomIdBancoSat == 'ASEA') { return '85' }
    if (nomIdBancoSat == 'SOFIEXPRESS') { return '86' }
    if (nomIdBancoSat == 'CLS') { return '87' }
    if (nomIdBancoSat == 'INDEVAL') { return '88' }
    if (nomIdBancoSat == 'BBASE') { return '264' }
    if (nomIdBancoSat == 'KUSPIT') { return '265' }
    if (nomIdBancoSat == 'UNAGRA') { return '266' }
    if (nomIdBancoSat == 'OPCIONES EMPRESARIALES DEL NOROESTE') { return '267' }
    if (nomIdBancoSat == 'LIBERTAD') { return '268' }
    if (nomIdBancoSat == 'N/A') { return '269' }
    if (nomIdBancoSat == 'SABADELL') { return '2130' } 
}

function personaMoral(string) {
    rfc = string;
    pm = "";
    if ((rfc.length) == 12) {//si es persona moral
        pm = '1';
    } if ((rfc.length) == 13) {//si es persona fisica
        pm = '0';
    }
    //console.log(pm); 
    return pm
}

function personaFisNom(string,stringRfc) {
    if ((stringRfc.length) == 13) {//si es persona fisica
        arrInfo = Object.values(string); //convertimos el contenido de la extracion en un arreglo
        //console.log("persona fisica nombre"); //imprime el nombre de la funcion en consola
        //console.log(string);
        var guardaNom = []; //declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
        //console.log(arrInfo.indexOf("(s):"));//busqueda el indice de la palabra
        //console.log(arrInfo.indexOf("Primer"));//busqueda el indice de la palabra
        if (arrInfo.includes("(s):") == true) { //si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
            //console.log("estoy en el if y soy true") //verificar que si se cumplio la condicion linea de apoyo 
            for (i = arrInfo.indexOf("(s):") + 1; i <= arrInfo.indexOf("Primer") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
                if (arrInfo[i] != '') {
                   // console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
                    guardaNom.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i
                }
            }
        }
    } else {
        return 'NULL'
    }
    //console.log(guardaNom.join(' '));
    return guardaNom.join(' ');
}

function personaFisApPa(string, stringRfc) {
    if ((stringRfc.length) == 13) {//si es persona fisica
        arrInfo = Object.values(string); //convertimos el contenido de la extracion en un arreglo
        //console.log("persona fisica nombre"); //imprime el nombre de la funcion en consola
        //console.log(string);
        var guardaApPa = []; //declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
        //console.log(arrInfo.indexOf("Apellido:"));//busqueda el indice de la palabra
        //console.log(arrInfo.indexOf("Segundo"));//busqueda el indice de la palabra
        if (arrInfo.includes("Apellido:") == true) { //si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
            //console.log("estoy en el if y soy true") //verificar que si se cumplio la condicion linea de apoyo 
            for (i = arrInfo.indexOf("Apellido:") + 1; i <= arrInfo.indexOf("Segundo") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
                if (arrInfo[i] != '') {
                    //console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
                    guardaApPa.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i
                }
            }
        } 
    } else {
        return 'NULL'
    }
    //console.log(guardaApPa.join(' '));
    return guardaApPa.join(' ');
}

function personaFisApMa(string, stringRfc) {
    if ((stringRfc.length) == 13) {//si es persona fisica
        arrInfo = Object.values(string); //convertimos el contenido de la extracion en un arreglo
        //console.log("persona fisica nombre"); //imprime el nombre de la funcion en consola
        //console.log(string);
        var guardaApMa = []; //declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
        //console.log(arrInfo.indexOf("Segundo"));//busqueda el indice de la palabra
        //console.log(arrInfo.indexOf("inicio"));//busqueda el indice de la palabra
        if ((arrInfo.length) != 0) {
            if (arrInfo.includes("Segundo") == true) { //si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
                //console.log("estoy en el if y soy true") //verificar que si se cumplio la condicion linea de apoyo 
                for (i = arrInfo.indexOf("Segundo") + 2; i <= arrInfo.indexOf("inicio") - 2; i++) {//recorrido de indices para obtener la informacion necesaria
                    if (arrInfo[i] != '') {
                        //console.log(arrInfo[i]); //ver en consola si el contenido es el esperado 
                        guardaApMa.push(arrInfo[i]); //guarda en el arreglo guardaRaSo el contenido del indice del arreglo arrInfo en la posicion i
                    }
                }
            }
        } else {
            return 'NULL'
        }
        //console.log(guardaApMa.join(' '));
        return guardaApMa.join(' ');
    }
    return 'NULL'
}

function extraeCodPosAux(string) { //funcion que extrae el codigo postal 
    arrInfo = Object.values(string) //convertimos el contenido de la extracion en un arreglo  
    var guardaCodPosAux = [];//declaramos un array vacio para llenarlo con la informacion necesaria del campo a buscar 
    if (arrInfo.includes("Postal:") == true) {//si la palabra se encuentra en el arreglo y el valor de este es verdadero entonces realiza la condicion
        for (i = arrInfo.indexOf("Postal:") + 1; i <= arrInfo.indexOf("Tipo") - 1; i++) {//recorrido de indices para obtener la informacion necesaria
            guardaCodPosAux.push(arrInfo[i]);//guarda en el arreglo guardaCodPos el contenido del indice del arreglo arrInfo en la posicion i
        }
    }
    return guardaCodPosAux;
}

function idCiudad(string) {
    //console.log(string);
    codPos = parseInt(string, 10);
    //console.log(codPos);//ver variable como numero 
    if (codPos >= 1000 && codPos <= 16900) { /*console.log("cdmx");*/ return '72' } //cdmx  
    if (codPos >= 31000 && codPos <= 33997) { /*console.log("chihuahua");*/ return '7' } //chihuahua
    if (codPos >= 20000 && codPos <= 20997) { /*console.log("aguascalientes");*/ return '2' } //aguascalientes 
    if (codPos >= 97000 && codPos <= 97990) { /*console.log("yucatan");*/ return '67' } //yucatan 
    if (codPos >= 21000 && codPos <= 20997) { /*console.log("baja california");*/ return '66' } //baja california 
    if (codPos >= 23000 && codPos <= 23997) { /*console.log("baja california sur");*/ return '4' } //baja california sur
    if (codPos >= 24000 && codPos <= 24940) { /*console.log("campeche");*/ return '' } //campeche ***********
    if (codPos >= 25000 && codPos <= 27997) { /*console.log("coahulia");*/ return '' } //coahulia ***********
    if (codPos >= 28000 && codPos <= 28989) { /*console.log("colima");*/ return '' } //colima ***********
    if (codPos >= 29000 && codPos <= 30997) { /*console.log("chiapas");*/ return '10' } //chiapas 
    if (codPos >= 34000 && codPos <= 35987) { /*console.log("durango");*/ return '' } //durango ***********
    if (codPos >= 39000 && codPos <= 41998) { /*console.log("guerrero");*/ return '1' } //guerrero 
    if (codPos >= 36000 && codPos <= 38997) { /*console.log("guanajuato");*/ return '9' } //guanajuato 
    if (codPos >= 42000 && codPos <= 43998) { /*console.log("hidalgo");*/ return '38' } //hidalgo 
    if (codPos >= 44100 && codPos <= 49996) { /*console.log("jalisco");*/ return '19' } //jalisco 
    if (codPos >= 50000 && codPos <= 57950) { /*console.log("edo mex o mex");*/ return '16' } //edo mex o mex 
    if (codPos >= 58000 && codPos <= 61998) { /*console.log("michoacan");*/ return '' } //michoacan ***********
    if (codPos >= 62000 && codPos <= 62996) { /*console.log("morelos");*/ return '14' } //morelos 
    if (codPos >= 63000 && codPos <= 63996) { /*console.log("nayarit");*/ return '12' } //nayarit 
    if (codPos >= 64000 && codPos <= 67996) { /*console.log("nuevo leon");*/ return '25' } //nuevo leon 
    if (codPos >= 68000 && codPos <= 71998) { /*console.log("oaxaca");*/ return '71' } //oaxaca 
    if (codPos >= 72000 && codPos <= 75997) { /*console.log("puebla");*/ return '28' } //puebla 
    if (codPos >= 77000 && codPos <= 77997) { /*console.log("quinta roo");*/ return '5' } //quinta roo 
    if (codPos >= 76000 && codPos <= 76998) { /*console.log("queretaro");*/ return '29' } //queretaro 
    if (codPos >= 80000 && codPos <= 82996) { /*console.log("sinaloa");*/ return '65' }  //sinaloa 
    if (codPos >= 78000 && codPos <= 79998) { /*console.log("san luis potosi");*/ return '32' } //san luis potosi  
    if (codPos >= 98000 && codPos <= 99998) { /*console.log("zacatecas");*/ return '' } //zacatecas ***********
    if (codPos >= 91000 && codPos <= 96998) { /*console.log("veracruz");*/ return '3' } //veracruz 
    if (codPos >= 90000 && codPos <= 90990) { /*console.log("tlaxcala");*/ return '41' } //tlaxcala 
    if (codPos >= 87000 && codPos <= 89970) { /*console.log("tamaulipas");*/ return '8' } //tamaulipas 
    if (codPos >= 86000 && codPos <= 86998) { /*console.log("tabasco");*/ return '' } //tabasco ***********
    if (codPos >= 83000 && codPos <= 85994) { /*console.log("sonora")*/; return '74' } //sonora 
    else { return 'NULL'}
}

function guardarCtc() {//guarda los datos introducidos en los inputs y verifica que no esten vacios
    var ctaConta1 = document.getElementById("ctaConta1").value;//guarda banco
    //console.log(ctaConta1);
    guardaCtaConta1 = ctaConta1;//pasa nombre del banco
    var ctaConta2 = document.getElementById("ctaConta2").value;//guarda banco
    //console.log(ctaConta2);
    guardaCtaConta2 = ctaConta2;//pasa nombre del banco
    var ctaAnt1 = document.getElementById("ctaAnt1").value;//guarda clabe
    //console.log(ctaAnt1);
    guardaCtaAnt1 = ctaAnt1;
    var ctaAnt2 = document.getElementById("ctaAnt2").value;//guarda clabe
    //console.log(ctaAnt2);
    guardaCtaAnt2 = ctaAnt2;

    if (ctaConta1 =="") {//Verificacion de la clabe
        alert("Se requiere IdCuenta Contable");
        document.getElementById("ctaConta1").focus();
    } if (ctaConta2 =="") {//verificacion de la clabe
        alert("Se requiere cuenta");
        document.getElementById("ctaConta2").focus();
    } if (ctaAnt1 == "") {//verifica que el campo banco no este vacio
        alert("Se requiere IdCuenta");
        document.getElementById("ctaAnt1").focus();
    } if (ctaAnt2 == "") { //verifica que el campo clabe no este vacio
        alert("Se requiere cuenta");
        document.getElementById("ctaAnt2").focus();
    } if ((ctaConta1 + 1) == ctaAnt1) {
        document.getElementById("ctaConta1").value = "";
        document.getElementById("ctaConta2").value = "";
        document.getElementById("ctaAnt1").value = "";
        document.getElementById("ctaAnt2").value = "";
        alert("Datos contables guardados");
    } if ((ctaAnt1 - 1) == ctaConta1) {
        document.getElementById("ctaConta1").value = "";
        document.getElementById("ctaConta2").value = "";
        document.getElementById("ctaAnt1").value = "";
        document.getElementById("ctaAnt2").value = "";
        alert("Datos contables guardados");
    } else {
        alert("Los IdCuenta tiene que ser consecutivos")
    }
}

function descripcionTipOracion(gaurdaPersonaFisApPa, gaurdaPersonaFisApMa, guardaPersonaFisNom, guardaRaSo, string) {
    rfc = string;
    var guardatipOracion = "";
    if ((rfc.length) == 13) {//si es persona fisica
        //console.log("persona fisica");
        var oracion = (gaurdaPersonaFisApPa+" " + gaurdaPersonaFisApMa+" " + guardaPersonaFisNom).toLowerCase();
        //console.log(oracion);
        let tipOracion = oracion.split(" ").map(tipOracion => {
            return tipOracion[0].toUpperCase() + tipOracion.slice(1)
        })
        //console.log(tipOracion)
        guardatipOracion = tipOracion.join(' ');
        
    } if ((rfc.length) == 12) {//si es persona moral
        //console.log("persona moral")
        var oracion = (guardaRaSo).toLowerCase();
        //console.log(oracion);
        let tipOracion = oracion.split(" ").map(tipOracion => {
            return tipOracion[0].toUpperCase() + tipOracion.slice(1)
        })
        //console.log(tipOracion)
        guardatipOracion= tipOracion.join(' ');
    }
    //console.log(guardatipOracion);
    return guardatipOracion;
}

function querysCtas(string, guardaTipoOracion, guardaCtaConta1, guardaCtaConta2, guardaCtaAnt1, guardaCtaAnt2) { 
    //console.log(guardaTipoOracion);
    rfc = string; //Esta funcion determina si es persona moral o persona fisica y en base a eso genera el query para persona fisica y moral 
    queryCtasContAnt = "";
    if ((rfc.length) == 12) {//si es persona moral
        queryCtas = "set identity_insert CtbCuentas on \n insert into CtbCuentas(idCuenta,Cuenta,Descripcion,idTipoCuenta,Acepta_Mov,EsProveedor,EsCliente,ToparChequeVsSaldo,EmisionCheque,idCuentaComplementaria,EsDolares,idTipoMoneda,PermitirDeposito,EsDeudor,SaldoLimiteDeudor,EsAcreedor,EsCuentaIVA,IdConceptoDIOT,PermitirProgramarPago,IdAgaCatIVA,IdCtaCostoTAC,IdAgrupadorSAT,Agrupador) \n values(" + guardaCtaConta1 + "," + guardaCtaConta2 + ",'" + guardaTipoOracion + "',1,1,0,0,1,0,NULL,0,6,0,0,0,0,0,NULL,0,NULL,NULL,NULL,'NULL') \n set identity_insert CtbCuentas off \n"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             //(9999, 'ROSHERJOSEMXN', 'JOSE ALFREDO ROSAS HERNANDEZ', NULL, 2, 'ROHA711201IJ7', 1, 'PUCCINI, 85 B, ALTOS 2 HAB', 'VALLEJO', '07870', 'GUSTAVO A MADERO', 'NULL', 'NULL', 'NULL', 0, 0, 0, 0, 0, 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 6, 'JOSE ALFREDO', 'ROSAS', 'HERNANDEZ', 'NULL', 'NULL', 'NULL', 0, 'NULL', 'NULL', 0, 31421, 31422, NULL, NULL, 0, '123456987562145962', 'BBVA BANCOMER',                                                                                                                                                                                                            '1', '4', '0', 'NULL', 'NULL', NULL, 0, '897698',                                                4, 'MXN', '012', '', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 6853, NULL, 'NULL', 'NULL', NULL, NULL)
        //console.log(queryCtas);
        queryAnt = "\n set identity_insert CtbCuentas on \n insert into CtbCuentas(idCuenta,Cuenta,Descripcion,idTipoCuenta,Acepta_Mov,EsProveedor,EsCliente,ToparChequeVsSaldo,EmisionCheque,idCuentaComplementaria,EsDolares,idTipoMoneda,PermitirDeposito,EsDeudor,SaldoLimiteDeudor,EsAcreedor,EsCuentaIVA,IdConceptoDIOT,PermitirProgramarPago,IdAgaCatIVA,IdCtaCostoTAC,IdAgrupadorSAT,Agrupador) \n values(" + guardaCtaAnt1 + "," + guardaCtaAnt2 + ",'" + guardaTipoOracion + "',4,1,1,0,0,1,NULL,0,6,0,0,0,0,0,NULL,0,NULL,NULL,NULL,'NULL') \n set identity_insert CtbCuentas off \n"
        //console.log(queryAnt);
        pm = queryCtas + queryAnt;
    } if ((rfc.length) == 13) {//si es persona fisica
        queryCtas = "set identity_insert CtbCuentas on \n insert into CtbCuentas(idCuenta,Cuenta,Descripcion,idTipoCuenta,Acepta_Mov,EsProveedor,EsCliente,ToparChequeVsSaldo,EmisionCheque,idCuentaComplementaria,EsDolares,idTipoMoneda,PermitirDeposito,EsDeudor,SaldoLimiteDeudor,EsAcreedor,EsCuentaIVA,IdConceptoDIOT,PermitirProgramarPago,IdAgaCatIVA,IdCtaCostoTAC,IdAgrupadorSAT,Agrupador) \n values(" + guardaCtaConta1 + "," + guardaCtaConta2 + ",'" + guardaTipoOracion + "',1,1,0,0,1,0,NULL,0,6,0,0,0,0,0,NULL,0,NULL,NULL,NULL,'NULL') \n set identity_insert CtbCuentas off \n"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             //(9999, 'ROSHERJOSEMXN', 'JOSE ALFREDO ROSAS HERNANDEZ', NULL, 2, 'ROHA711201IJ7', 1, 'PUCCINI, 85 B, ALTOS 2 HAB', 'VALLEJO', '07870', 'GUSTAVO A MADERO', 'NULL', 'NULL', 'NULL', 0, 0, 0, 0, 0, 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 6, 'JOSE ALFREDO', 'ROSAS', 'HERNANDEZ', 'NULL', 'NULL', 'NULL', 0, 'NULL', 'NULL', 0, 31421, 31422, NULL, NULL, 0, '123456987562145962', 'BBVA BANCOMER',                                                                                                                                                                                                            '1', '4', '0', 'NULL', 'NULL', NULL, 0, '897698',                                                4, 'MXN', '012', '', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 6853, NULL, 'NULL', 'NULL', NULL, NULL)
        //console.log(queryCtas);
        queryAnt = "\n set identity_insert CtbCuentas on \n insert into CtbCuentas(idCuenta,Cuenta,Descripcion,idTipoCuenta,Acepta_Mov,EsProveedor,EsCliente,ToparChequeVsSaldo,EmisionCheque,idCuentaComplementaria,EsDolares,idTipoMoneda,PermitirDeposito,EsDeudor,SaldoLimiteDeudor,EsAcreedor,EsCuentaIVA,IdConceptoDIOT,PermitirProgramarPago,IdAgaCatIVA,IdCtaCostoTAC,IdAgrupadorSAT,Agrupador) \n values(" + guardaCtaAnt1 + "," + guardaCtaAnt2 + ",'" + guardaTipoOracion + "',4,1,1,0,0,1,NULL,0,6,0,0,0,0,0,NULL,0,NULL,NULL,NULL,'NULL') \n set identity_insert CtbCuentas off \n"
        //console.log(queryAnt);
        queryCtasContAnt = queryCtas + queryAnt;
    }
    //console.log(queryCtasContAnt);
    return queryCtasContAnt
}

function activarDatBanc() {
    var check = document.getElementById(checkDatBan);
    document.getElementById("banco1").disable = false
    document.getElementById("clabe").disable = true
    document.getElementById("ctaBancaria").disable = true
    console.log(check);
    if (check == true) {
        var banco = 'NULL'//guarda banco 
        console.log(banco);
        guardaBanco = banco;//pasa nombre del banco
        var clabe = 'NULL';//guarda clabe
        console.log(clabe);
        guardaClabe = clabe;
        var ctaBancaria = 'NULL'//guarda cuenta bancaria 
        console.log(ctaBancaria);
        guardaCtaBancaria = ctaBancaria;
    }
}

window.document.title = 'CSF-QUERY-ALHEL';//nombre de la pestaña 