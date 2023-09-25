const { createBot, createProvider, createFlow} = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const QRPortalWeb = require('@bot-whatsapp/portal')
const MockAdapter = require('@bot-whatsapp/database/mock')

const welcomeFlow = require('./flows/welcomeFlow')



  const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([welcomeFlow])
    const adapterProvider = createProvider(BaileysProvider);
    
    
    createBot({
      flow:adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

  QRPortalWeb();
};

main();