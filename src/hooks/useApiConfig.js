const useApiConfig = ({ token }) => {
	return {
		apiKey: (key) => key === 'Authorization' && `token ${token}`,
	};
};

export default useApiConfig;
