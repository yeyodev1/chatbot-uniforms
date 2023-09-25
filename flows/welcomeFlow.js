const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const flowWhatInstitution= require ('./answerFlow')
const flowShowUniforms= require ('./answerFlow')

const flowWelcome = addKeyword(EVENTS.WELCOME)
  .addAnswer([
    "¡Hola! Bienvenido al servicio de atención al cliente de uniformes",
    "Seré tu asistente virtual y estoy aquí para ayudarte. ¿En qué te puedo asistir hoy?",
  ])
  .addAnswer(
    [
      "*MENU PRINCIPAL*",
      "1. Venta de uniformes ",
      "2. Llamar a un agente. 🙍🏻‍♂️",
      "",
      "Por favor escribe el *numero* de la opcion que necesites! 🙇🏻‍♂️",
    ],

    { capture: true, delay: 700 },

    async (ctx, { fallBack }) => {
      const clientAnswer = ctx.body;
      if (!["1", "2",].includes(clientAnswer)) {
        return fallBack("Whoops! no me has dado un numero que pertenezca a la lista! 😫");
      } 
    }, 
    [flowShowUniforms, flowWhatInstitution]
  )

module.exports = flowWelcome;