const { addKeyword } = require("@bot-whatsapp/bot");

const GoogleSheetService = require("../services/sheets");

const googleSheet = new GoogleSheetService(
  "1qzZWNa0mh-jnuOptoUWPN8DgE50smFEndvrt_a1mpQ4"
);

const flowShowUniforms = addKeyword("1")
	.addAnswer("Te envío el catalogo")
	.addAnswer("Mira lo siguiente", {
		media: "http://bibliotecadigital.ilce.edu.mx/Colecciones/ObrasClasicas/_docs/ElPrincipito.pdf",
	})
	.addAnswer(
		["Por favor proporciona el codigo al lado del nombre de la prenda"],
		{ capture: true },
		async (ctx, { fallBack }) => {
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
				return getProduct;
			} catch (error) {
				console.log(error);
			}
		}
	);


module.exports = flowShowUniforms 