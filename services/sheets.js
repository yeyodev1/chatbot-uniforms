require("dotenv").config();
const { JWT } = require("google-auth-library");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

class GoogleSheetService {
	constructor(id) {
		if (!id) {
			throw new Error("ID_UNDEFINED");
		}

		this.jwtFromEnv = new JWT({
			email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
			scopes: SCOPES,
		});

		this.doc = new GoogleSpreadsheet(id, this.jwtFromEnv);
	}

	async showUniformData(targetCode) {
		try {
			await this.doc.loadInfo();
			const sheetIndices = [
				0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
			];
			for (const sheetIndex of sheetIndices) {
				const sheet = this.doc.sheetsByIndex[sheetIndex];
				if (!sheet) {
					console.warn(`Sheet at index ${sheetIndex} is undefined`);
					continue;
				}
				await sheet.loadCells("A1:F200");
				const rows = Math.min(sheet.rowCount, 200);
				console.log("Número de filas:", rows);
				for (let rowIndex = 1; rowIndex < rows; rowIndex++) {
					const numberCodeCell = sheet.getCell(rowIndex, 1);
					if (!numberCodeCell || !numberCodeCell.value) {
						continue;
					}
					console.log(
						"Comparando:",
						numberCodeCell.value,
						String(targetCode)
					);
					if (String(numberCodeCell.value) === String(targetCode)) {
						const item = {
							"NOMBRE DEL PRODUCTO": sheet.getCell(rowIndex, 0)
								.value,
							CODIGO: numberCodeCell,
							CATEGORIA: sheet.getCell(rowIndex, 2).value,
							CANTIDAD: sheet.getCell(rowIndex, 3).value,
							PRECIO: sheet.getCell(rowIndex, 4).value,
							TALLAS: sheet.getCell(rowIndex, 5).value,
						};
						console.log("Item encontrado:", item);
						return item;
					}
				}
			}
			console.log("Código no encontrado.");
			return null;
		} catch (err) {
			console.log(err);
			return undefined;
		}
	}

	// Guardar pedido
	async saveOrder(data) {
		await this.doc.loadInfo();
		const sheet = this.doc.sheetsByIndex[1]; // the first sheet

		const order = await sheet.addRow({
			fecha: data.fecha,
			telefono: data.telefono,
			nombre: data.nombre,
			pedido: data.pedido,
			observaciones: data.observaciones,
		});

		return order;
	}
}

module.exports = GoogleSheetService;