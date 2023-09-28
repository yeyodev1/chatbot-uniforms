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
							NAME: sheet.getCell(rowIndex, 0)
								.value,
							CODE: numberCodeCell,
							CATEGORY: sheet.getCell(rowIndex, 2).value,
							STOCK: sheet.getCell(rowIndex, 3).value,
							PRICE: sheet.getCell(rowIndex, 4).value,
							SIZE: sheet.getCell(rowIndex, 5).value,
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
    const sheet = this.doc.sheetsByIndex[0];
    console.log(sheet.title);
    try {
      const order = await sheet.addRow({
        Fecha: data.date,
        'Codigo del pedido': data.productCode,
				Nombre: data.name,
        Delivery: data.delivery,
				Ciudad: data.city,
        Direccion: data.direction,
        Numero: data.clientNumber,
        Observaciones: data.observation,
      });
      console.log("este es el order", order);
      return order;
    } catch (error) {
      throw error;
    }
  }
}


module.exports = GoogleSheetService;