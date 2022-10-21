SELECT
    event_day, repo_id, total
FROM (
    SELECT
        DATE(created_at) AS event_day,
        repo_id,
        COUNT(actor_login) OVER(ORDER BY DATE(created_at)) AS total,
        ROW_NUMBER() OVER(PARTITION BY DATE(created_at)) AS row_num
    FROM github_events
    WHERE
        type = 'WatchEvent'
        AND repo_id = 41986369
    ORDER BY event_day
) acc
WHERE row_num = 1
ORDER BY event_day
;