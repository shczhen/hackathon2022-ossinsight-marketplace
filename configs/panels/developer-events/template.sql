SELECT
	SUBSTRING(type, 1, LENGTH(type)-5) AS type,
	COUNT(*) AS num
FROM
	github_events
WHERE
	actor_login = 'Icemap'
GROUP BY
	type;