const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheets");

const googleSheet = new GoogleSheetService(
  "1qzZWNa0mh-jnuOptoUWPN8DgE50smFEndvrt_a1mpQ4"
);

const buyItem = addKeyword("SI").addAnswer('Yeyo es gay')
const buyItem2 = addKeyword("NO").addAnswer('Yeyo es super gay')

const flowShowUniforms = addKeyword("1")
	.addAnswer("Te envío el catalogo")
	.addAnswer("Mira lo siguiente", {
		media: "http://bibliotecadigital.ilce.edu.mx/Colecciones/ObrasClasicas/_docs/ElPrincipito.pdf",
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
				const getProduct = await googleSheet.showUniformData(
					targetCode
				);
				console.log(getProduct);
				if (getProduct === null) {
					fallBack();
				}
        flowDynamic([`¡Excelente 😆! Estos son los detalles de tu pedido...`, `Nombre: ${getProduct.NAME}`, `Categoría: ${getProduct.CATEGORY}`, `Precio: ${getProduct.PRICE}`])
			} catch (error) {
				console.log(error);
			}
		},
	)
	.addAnswer('¿Deseas ordenar?', {capture: true}, null, [buyItem, buyItem2])


module.exports = flowShowUniforms 