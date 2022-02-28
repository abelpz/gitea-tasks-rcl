import { useState } from 'react';
import useSWR from 'swr';

import useIssuesApi from './useIssuesApi';

function useRepoIssues({ resource, authentication, args = {} }) {
	const issuesClient = useIssuesApi({ authentication })
	const [isLoading, setIsLoading] = useState(false);
	const { data, error /*,mutate*/ } = useSWR(
		!!resource && [resource.owner.username, resource.name],
		async (owner, repo) => {
			const {
				state,
				labels,
				q,
				type,
				milestones,
				since,
				before,
				createdBy,
				assignedBy,
				mentionedBy,
				page,
				limit,
				options,
			} = args;
			return await issuesClient
				.issueListIssues(
					owner,
					repo,
					state,
					labels,
					q,
					type,
					milestones,
					since,
					before,
					createdBy,
					assignedBy,
					mentionedBy,
					page,
					limit,
					options
				)
				.then(({ data }) => data);
		}
	);

	const setIssue = ({ title, owner, repo, closed = false, body = '' }) => {
		const issueBody = {
			title,
			closed,
			body,
		};
		setIsLoading(true);
		const issue = issuesClient.issueCreateIssue(owner, repo, issueBody).then(({ data }) => {
			setIsLoading(false);
			return data;
		});
		//TODO: mutate issues fetched by SWR
		return issue;
	};

	return {
		setIssue,
		issues: data,
		isLoading: (!error && !data && !!resource && !!authentication?.token?.sha1) || isLoading,
		isError: error,
	};
}

export default useRepoIssues;
