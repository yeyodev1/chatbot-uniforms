const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const { getDay } = require("date-fns");

const GoogleSheetService = require("../services/sheets");
const buyItem = require("./customerFlow");
const flowWelcome = require("./welcomeFlow");

const googleSheet = new GoogleSheetService(
  "1qzZWNa0mh-jnuOptoUWPN8DgE50smFEndvrt_a1mpQ4"
);

const flowShowUniforms = addKeyword("1")
  .addAnswer("Te envío el catalogo")
  .addAnswer("Mira lo siguiente", {
    media:
      "http://bibliotecadigital.ilce.edu.mx/Colecciones/ObrasClasicas/_docs/ElPrincipito.pdf",
  })
  .addAnswer(
    ["Por favor proporciona el codigo al lado del nombre de la prenda"],
    { capture: true },
    async (ctx, {state, fallBack, flowDynamic }) => {
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
        console.log("Aqui esta el getProduct", getProduct.CODE.formattedValue)
        state.update({productCode: getProduct.CODE.formattedValue})
        console.log(state.getMyState())
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
    async (ctx, {gotoFlow}) => {
      if (["si", "SI", "sí", "sI", "Si"].includes(ctx.body)) {
        gotoFlow(buyItem);
      }
      if (["no", "NO", "nO", "n0", "No" ].includes(ctx.body)) {
        console.log('Entre en donde no deberia entrar...')
        gotoFlow(flowWelcome);
      }
    },
  );

  const flowContactAgent = addKeyword("2", { sensitive: true })
  .addAnswer(
    "Un gusto darte el contacto de quien te atendera!",
    null,
    async (ctx, { provider }) => {
      // send a contact!
      const vcard =
        "BEGIN:VCARD\n" + // metadata of the contact card
        "VERSION:3.0\n" +
        "FN:Yeyo Reyes\n" + // full name
        "ORG:Programador de la Muerte;\n" + // the organization of the contact
        "TEL;type=CELL;type=VOICE;waid=593995254965:+593995254965\n" + // WhatsApp ID + phone number
        "END:VCARD";

      const id = ctx.key.remoteJid;
      const sock = await provider.getInstance();

      const sentMsg = await sock.sendMessage(id, {
        contacts: {
          displayName: "Yeyo",
          contacts: [{ vcard }],
        },
      });
    }
  )

  .addAnswer(
    [
      "Me encanto haberte ayudado!",
      "Escribe cualquier palabra para volver a ver al menu principal! 🥳",
    ],
    { delay: 500 },
    async (_, { endFlow }) => {
      endFlow();
    }
  );

module.exports = {flowShowUniforms, flowContactAgent}; 