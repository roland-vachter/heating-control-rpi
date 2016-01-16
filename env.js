module.exports = {
	apiKeys: {
		registry: process.env.REGISTRY_API_KEY
	},
	registryAddress: process.env.REGISTRY_APP_ADDRESS,
	inDevMode: process.env.DEV_MODE_ON === "true" ? true : false,
	crypto: {
		key: process.env.CRYPTO_KEY
	},
	mongo: {
		uri: process.env.MONGO_URI
	}
};
