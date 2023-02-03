const cnx = require('./cnx');
const sql = require('mssql');
async function getQuery() {
	try {
		let pool = await sql.connect(cnx);
		let salida = await pool.request().query('select * from AcProveedores');
		console.log(salida.recordset);
	} catch (err) {
		console.log(err);
	}
}
getQuery();
module.exports = {
	getQuery: getQuery
}
