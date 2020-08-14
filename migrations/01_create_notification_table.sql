CREATE TABLE IF NOT EXISTS notification (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  body VARCHAR(200) NOT NULL,
  click_action VARCHAR(1000) NOT NULL,
  icon VARCHAR(1000),
  image VARCHAR(1000),
  recipient JSON NOT NULL
);