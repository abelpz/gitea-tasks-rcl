import { IssueApi } from 'dcs-js';

import useApiConfig from './useApiConfig';

/**
 * Uses DCS issues API.
 * @param {string} token - Token needed to make secure requests.
 */
const useIssuesApi = ({ authentication }) => {
	const { token, config } = authentication;
	const apiConfig = useApiConfig({ token: token.sha1 });
	const issueClient = new IssueApi(apiConfig, config.server + '/api/v1' || undefined)
	return issueClient;
};

export default useIssuesApi;
