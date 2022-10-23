SELECT
actor_login,
COUNT(*) AS comments
FROM
github_events
WHERE
repo_id = 41986369
AND actor_login NOT LIKE '%bot%'
AND type IN (
  'IssueCommentEvent',
  'PullRequestReviewCommentEvent'
)
GROUP BY
actor_login
ORDER BY
comments DESC
LIMIT
20
;
