-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name)
VALUES ('testuser1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User1'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User2');

INSERT INTO teas (title, brand, description, category, review, country_of_origin, organic, img_URL, brew_time, brew_temp)
VALUES (
    'English Black Tea',
    'PG TIPS',
    'Fine English tea made from a reputable company.',
    'Black',
    'I have been drinking this tea for years now and I love it.',
    'England',
    'FALSE',
    'https://images.heb.com/is/image/HEBGrocery/000441976',
    '3',
    '100'),
    ('American Black Tea',
    'Lipton',
    'Classic American tea. Come and have a glass!',
    'Black',
    'We usually use this brand when making our southern ice cold sweet tea. Great!',
    'United States of America',
    'FALSE',
    'https://m.media-amazon.com/images/I/8187SPdp+IL._SL1500_.jpg',
    '3',
    '100');

INSERT INTO saved_teas (user_id, tea_id, is_my_tea, is_on_wish_list)
VALUES (1, 1, TRUE, FALSE), (2, 2, FALSE, TRUE);