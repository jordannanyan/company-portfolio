CREATE TABLE IF NOT EXISTS leads (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  whatsapp    VARCHAR(20)   NOT NULL,
  email       VARCHAR(150)  NULL,
  service     VARCHAR(50)   NOT NULL,
  deadline    DATE          NULL,
  message     TEXT          NOT NULL,
  status      ENUM('baru','dihubungi','deal','batal') NOT NULL DEFAULT 'baru',
  ip          VARCHAR(45)   NULL,
  user_agent  VARCHAR(255)  NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
