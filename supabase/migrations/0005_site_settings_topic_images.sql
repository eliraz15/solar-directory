-- Per-topic and SunWise-banner hero images for the homepage, editable from
-- admin so real photography can replace the placeholder gradients later
-- without another deploy.

alter table site_settings
  add column topic_production_image_url text,
  add column topic_maintenance_image_url text,
  add column topic_economics_image_url text,
  add column topic_troubleshooting_image_url text,
  add column sunwise_banner_image_url text;
