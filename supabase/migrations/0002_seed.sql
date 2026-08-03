-- Initial categories, the SUNWISE house-brand listing, and one starter
-- article, so the site isn't empty on first deploy. Uses slug lookups
-- instead of hardcoded IDs so this is safe to replay/adapt.

insert into categories (slug, name, description, sort_order, is_exclusive) values
  ('matkinim', 'מתקיני מערכות פוטו-וולטאיות', 'מתקינים מוסמכים למערכות סולאריות ביתיות ועסקיות', 1, false),
  ('chashmalaim', 'חשמלאים מוסמכים לסולארי', 'חשמלאים עם ניסיון בחיבור מערכות סולאריות', 2, false),
  ('nikuy-tachzuka', 'ניקוי ותחזוקה', 'חברות תחזוקה וניקוי פאנלים סולאריים', 3, false),
  ('yiutz-energia', 'ייעוץ אנרגיה ומימון', 'יועצי אנרגיה, מימון והחזרי מס', 4, false),
  ('nitur', 'ניטור מערכות', 'שירותי ניטור וניתוח ביצועים למערכות סולאריות', 5, true);

insert into professionals (
  category_id, name, slug, description, website, is_active, is_house_brand, disclosure_text
)
select
  id,
  'SUNWISE',
  'sunwise',
  'שירות ניטור לביצועי מערכות סולאריות: מעקב ייצור בזמן אמת, התראות WhatsApp על תקלות, וסיכום ביצועים יומי.',
  'https://sunwise.co.il',
  true,
  true,
  'SUNWISE הוא שירות ניטור שבבעלות מפעילי אתר זה.'
from categories where slug = 'nitur';

insert into articles (
  slug, title, content, excerpt, meta_description, related_category_id, status, faq_items, published_at
)
select
  'madrich-bchirat-matkin',
  'איך בוחרים מתקין למערכת סולארית: 7 שאלות שחייבים לשאול',
  '<p>בחירת מתקין היא ההחלטה החשובה ביותר בתהליך התקנת מערכת סולארית — היא משפיעה על העלות, האמינות ומשך החיים של המערכת.</p>
   <h2>1. האם יש למתקין רישיון חשמלאי בתוקף?</h2>
   <p>כל התקנה סולארית מחייבת חיבור לחשמלאי מוסמך. בקשו לראות רישיון בתוקף לפני חתימה על חוזה.</p>
   <h2>2. כמה מערכות דומות בגודל שלכם הותקנו בשנה האחרונה?</h2>
   <p>ניסיון עדכני בגדלי מערכת דומים מפחית משמעותית את הסיכון לטעויות תכנון.</p>
   <h2>3. מה כלול באחריות, ולכמה זמן?</h2>
   <p>יש להבחין בין אחריות על הציוד (יצרן) לאחריות על העבודה (המתקין).</p>',
  'מדריך קצר לשאלות שחשוב לשאול כל מתקין סולארי לפני חתימה על חוזה.',
  'איך בוחרים מתקין סולארי? 7 שאלות מפתח שחשוב לשאול לפני חתימה על חוזה התקנה.',
  id,
  'published',
  '[
    {"question": "כמה זמן לוקחת התקנה סולארית ביתית טיפוסית?", "answer": "בדרך כלל בין יום עבודה אחד לשלושה, בהתאם לגודל המערכת ומורכבות הגג."},
    {"question": "האם צריך רישיון מיוחד להתקנת מערכת סולארית?", "answer": "ההתקנה עצמה מחייבת חשמלאי מוסמך, וחיבור לרשת מחייב אישור חברת החשמל."}
  ]'::jsonb,
  now()
from categories where slug = 'matkinim';
