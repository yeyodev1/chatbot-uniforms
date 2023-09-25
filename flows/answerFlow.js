const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/inventory");

const googleSheet = new GoogleSheetService(
  "1qzZWNa0mh-jnuOptoUWPN8DgE50smFEndvrt_a1mpQ4"
);

const GLOBAL_STATE = [];

const flowWhatInstitution = addKeyword("2").addAnswer(
  ["Encantado de mostrarte lo que tenemos en stock!", 'Dime de que institucion necesitas'],
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


const flowShowUniforms = addKeyword("1").addAnswer(
  [
  "Encantado de mostrarte los uniformes disponibles",
],
  {capture: true},
  async (ctx, { fallBack }) => {
    const nameUniform = ctx.body
    try{
    const getProduct = await googleSheet.showStockList(nameUniform);
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

module.exports = flowWhatInstitution 
module.exports = flowShowUniforms 