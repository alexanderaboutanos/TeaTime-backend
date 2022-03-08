
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL
);

CREATE TABLE teas (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  review TEXT,
  country_of_origin TEXT,
  organic BOOLEAN,
  img_url TEXT,
  brew_time INTEGER,
  brew_temp INTEGER
);

CREATE TABLE saved_teas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  tea_id INTEGER
    REFERENCES teas ON DELETE CASCADE,
  is_my_tea BOOLEAN NOT NULL,
  is_on_wish_list BOOLEAN NOT NULL
);
