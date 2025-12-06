-- Script de datos iniciales para testing
-- Ejecutar después de create_tables.sql

-- Tipos de artículos
INSERT INTO ARTICLE_TYPES (type_name) VALUES
    ('dress'),
    ('shoes'),
    ('bag'),
    ('jacket');

-- Tallas
INSERT INTO SIZES (size_label, description) VALUES
    ('XS', 'Extra Small'),
    ('S', 'Small'),
    ('M', 'Medium'),
    ('L', 'Large'),
    ('XL', 'Extra Large');

SELECT setval('sizes_id_seq', (SELECT MAX(id) FROM SIZES));

-- Colores
INSERT INTO COLORS (color_name, hex_value) VALUES
    ('Champagne', '#F7E7CE'),
    ('Black', '#000000'),
    ('Floral', '#FFB6C1'),
    ('Burgundy', '#800020');

-- Artículos con talla específica (cada combinación style+color+size es un artículo)
-- Silk Evening Gown (Champagne) en diferentes tallas
INSERT INTO ARTICLES (article_type_id, size_id, color_id, style, price_for_day, stock, image_url, description) VALUES
    (1, 1, 1, 'Silk Evening Gown', 79.00, 1, '/images/dresses/1.jpeg', 'Luxurious silk gown with flattering silhouette.'),
    (1, 2, 1, 'Silk Evening Gown', 79.00, 1, '/images/dresses/1.jpeg', 'Luxurious silk gown with flattering silhouette.'),
    (1, 3, 1, 'Silk Evening Gown', 79.00, 1, '/images/dresses/1.jpeg', 'Luxurious silk gown with flattering silhouette.'),
    (1, 4, 1, 'Silk Evening Gown', 79.00, 1, '/images/dresses/1.jpeg', 'Luxurious silk gown with flattering silhouette.');

-- Black Tie Dress (Black) en diferentes tallas
INSERT INTO ARTICLES (article_type_id, size_id, color_id, style, price_for_day, stock, image_url, description) VALUES
    (1, 2, 2, 'Black Tie Dress', 99.00, 1, '/images/dresses/2.jpeg', 'Elegant black-tie dress for formal events.'),
    (1, 3, 2, 'Black Tie Dress', 99.00, 1, '/images/dresses/2.jpeg', 'Elegant black-tie dress for formal events.'),
    (1, 4, 2, 'Black Tie Dress', 99.00, 1, '/images/dresses/2.jpeg', 'Elegant black-tie dress for formal events.'),
    (1, 5, 2, 'Black Tie Dress', 99.00, 1, '/images/dresses/2.jpeg', 'Elegant black-tie dress for formal events.');

-- Floral Midi Dress (Floral) en diferentes tallas
INSERT INTO ARTICLES (article_type_id, size_id, color_id, style, price_for_day, stock, image_url, description) VALUES
    (1, 1, 3, 'Floral Midi Dress', 49.00, 1, '/images/dresses/3.jpeg', 'Bright floral midi for daytime events.'),
    (1, 2, 3, 'Floral Midi Dress', 49.00, 1, '/images/dresses/3.jpeg', 'Bright floral midi for daytime events.'),
    (1, 3, 3, 'Floral Midi Dress', 49.00, 1, '/images/dresses/3.jpeg', 'Bright floral midi for daytime events.');

-- Velvet Cocktail Dress (Burgundy) en diferentes tallas
INSERT INTO ARTICLES (article_type_id, size_id, color_id, style, price_for_day, stock, image_url, description) VALUES
    (1, 2, 4, 'Velvet Cocktail Dress', 59.00, 1, '/images/dresses/4.jpeg', 'Rich velvet cocktail dress in deep tones.'),
    (1, 3, 4, 'Velvet Cocktail Dress', 59.00, 1, '/images/dresses/4.jpeg', 'Rich velvet cocktail dress in deep tones.'),
    (1, 4, 4, 'Velvet Cocktail Dress', 59.00, 1, '/images/dresses/4.jpeg', 'Rich velvet cocktail dress in deep tones.');

-- Estados de órdenes
INSERT INTO ORDER_STATUSES (status_name, description) VALUES
    ('active', 'Order is active'),
    ('canceled', 'Order has been canceled'),
    ('completed', 'Order has been completed');

-- Resetear secuencia para que los próximos inserts empiecen desde 5
SELECT setval('articles_id_seq', 4, true);
