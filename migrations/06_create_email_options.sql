CREATE TABLE IF NOT EXISTS email_options (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  topic_ids JSON NOT NULL
);
