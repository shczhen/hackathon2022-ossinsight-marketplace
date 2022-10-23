SELECT 
	event_month,
	SUM(additions) AS additions,
	SUM(deletions) AS deletions
FROM github_events
WHERE type = 'PullRequestEvent'
	AND repo_id = 41986369
GROUP BY event_month
