module.exports = {
	apiKeys: {
		registry: process.env.REGISTRY_API_KEY,
		own: {
			readOnly: process.env.OWN_READ_ONLY_API_KEY
		}
	}
};