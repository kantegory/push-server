CREATE TABLE IF NOT EXISTS user_devices (
  id BIGSERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  tokens JSON NOT NULL
);
