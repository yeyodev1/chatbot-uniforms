const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/index");

const googleSheet = new GoogleSheetService(
  "16-36L83cctMUzjJ8IJh1INEEstmRNKqbpG5_aJhQFs8"
);

const GLOBAL_STATE = [];

const flowVenta = addKeyword("1").addAnswer(
  "Encantado de mostrarte lo que tenemos en stock!",
  null,
  async (_, { flowDynamic }) => {
    try{
    const getList = await googleSheet.retriveStockList();
    for (const stockList of getList) {
      GLOBAL_STATE.push(stockList);
      await flowDynamic(stockList);
    }
  }
  catch(error){
    console.log(error)
  }
});


const flowPedidos3D = addKeyword("2").addAnswer(
  [
  "Encantado de mostrarte como va el pedido de las impresiones 3D!",
  "",
  "Cual es tu numero de pedido? ✌🏻😎"
],
  {capture: true},
  async (ctx, { flowDynamic, fallBack }) => {
    const targetCode = ctx.body
    try{
    const getProduct = await googleSheet.retrive3DList(targetCode);
    if(getProduct===null){
      fallBack()
    } 
    return getProduct
    console.log(getProduct)
  }
  catch(error){
    console.log(error)
  }
});

module.exports = flowVenta 
module.exports = flowPedidos3D 