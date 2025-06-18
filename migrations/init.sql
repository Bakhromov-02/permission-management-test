CREATE TABLE IF NOT EXISTS permissions (
  api_key TEXT NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  PRIMARY KEY (api_key, module, action)
);
