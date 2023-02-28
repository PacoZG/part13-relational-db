-- Active: 1677503116687@@127.0.0.1@5432
/* Creating a tabler */
CREATE TABLE blogs (
  id UUID PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (
  id,
  author,
  url,
  title)
  VALUES (
    'e2a47919-71c4-4d0e-a744-8307d1f9f12b',
    'Dan Abrahov',
    'https://golden.com/wiki/Dan_Abramov_(software_engineer)-99B8RJM',
    'On let vs const'
    );

INSERT INTO blogs (
  id,
  author,
  url,
  title)
  VALUES (
    '16b06fd3-4b83-4773-9d92-2fa161144079',
    'Laurenz Albe',
    'https://github.com/laurenz',
    'Gaps in sequences in PostgreSQL'
    );

