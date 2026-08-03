-- Lets an article link to one other related article (cross-linking between
-- guides), separate from related_category_id which links to a professional
-- category for the CTA box.

alter table articles
  add column related_article_id uuid references articles(id) on delete set null;
