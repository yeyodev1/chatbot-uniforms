const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheets");

const googleSheet = new GoogleSheetService(
  "1qzZWNa0mh-jnuOptoUWPN8DgE50smFEndvrt_a1mpQ4"
);

const buyItem = addKeyword(EVENTS.ACTION).addAnswer('Yeyo es gay')


const flowShowUniforms = addKeyword("1")
  .addAnswer("Te envío el catalogo")
  .addAnswer("Mira lo siguiente", {
    media:
      "http://bibliotecadigital.ilce.edu.mx/Colecciones/ObrasClasicas/_docs/ElPrincipito.pdf",
  })
  .addAnswer(
    ["Por favor proporciona el codigo al lado del nombre de la prenda"],
    { capture: true },
    async (ctx, { fallBack, flowDynamic }) => {
      const formatCode = /^[A-Za-z]-\d+$/;
      const targetCode = ctx.body;
      if (!formatCode.test(targetCode)) {
        fallBack(
          "El codigo proporcionado esta mal escrito, por favor resísalo y escríbelo tal como dice el catálogo 😄"
        );
        return;
      }
      try {
        const getProduct = await googleSheet.showUniformData(targetCode);
        console.log(getProduct);
        if (getProduct === null) {
          fallBack();
        }
        flowDynamic([
          `¡Excelente 😆! Estos son los detalles de tu pedido...`,
          `Nombre: ${getProduct.NAME}`,
          `Categoría: ${getProduct.CATEGORY}`,
          `Precio: ${getProduct.PRICE}`,
        ]);
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAnswer(
    "¿Deseas ordenar? *SI* para continuar, *NO* para menu principal",
    { capture: true },
    async (ctx, { gotoFlow, endFlow }) => {
      if (["si", "SI", "sí", "sI", "Si"].includes(ctx.body)) {
        gotoFlow(buyItem);
      }
      if (["no", "NO", "nO", "n0", "No" ].includes(ctx.body)) {
        endFlow("Nos vemos");
      }
    },
    [buyItem]
  );

module.exports = flowShowUniforms; 