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

  // Recuperar la lista de GoogleSheet
  async showStockList() {
    try {
      const stocklist = [];
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0]; // # de hoja del google sheet
      await sheet.loadCells("A1:G7");

      for (let rowIndex = 1; rowIndex <= 4; rowIndex++) {
        const item = {
          item: sheet.getCell(rowIndex, 0).value,
          category: sheet.getCell(rowIndex, 1).value,
          stock: sheet.getCell(rowIndex, 2).value,
          price: sheet.getCell(rowIndex, 3).value,
          size: sheet.getCell(rowIndex, 4).value,
        };
        stocklist.push(item);
        console.log(item);
      }
      console.log(nameItem)
      return stocklist;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  async showUniformData(nameUniform) {
    try {
      await this.doc.loadInfo();
      const sheet = this.doc.sheetsByIndex[0];
      await sheet.loadCells("A1:H2");


      for (let rowIndex = 1; rowIndex <= sheet.rowCount; rowIndex++) {
        const codigo = sheet.getCell(rowIndex, 1).value;
        if (codigo === nameUniform) {
          break;
        }
        const item = {
          name: sheet.getCell(rowIndex, 0).value,
          category: sheet.getCell(rowIndex, 2).value,
          cantidad: sheet.getCell(rowIndex, 3).value,
          price: sheet.getCell(rowIndex, 4).value,
          tallas: sheet.getCell(rowIndex, 5).value,
        };
        console.log(item)
        return item;
      }

    console.log('Código no encontrado.');
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