import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "שקיפות ואודות",
  description: "כיצד אתר solar.org.il פועל, ואיך אנחנו בוחרים בעלי מקצוע מומלצים.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 text-muted">
        <h1 className="mb-6 text-2xl font-semibold text-foreground">שקיפות ואודות</h1>

        <p className="mb-4">
          solar.org.il הוא מדריך עצמאי למערכות סולאריות פוטו-וולטאיות בישראל. אנחנו
          כותבים מדריכי תוכן, ולצד זה מפעילים מדריך בעלי מקצוע ממומן.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-medium text-foreground">
          איך בעלי המקצוע נבחרים?
        </h2>
        <p className="mb-4">
          כל קטגוריית בעלי מקצוע (כגון מתקינים, חשמלאים, ניקוי ותחזוקה) מוגבלת
          לעד 3 בעלי מקצוע, שמשלמים עבור ההצגה במדריך. הופעה בקטגוריה אינה
          המלצה מקצועית בלעדית - מומלץ להשוות מספר הצעות לפני קבלת החלטה.
        </p>

        <h2 className="mb-2 mt-6 text-lg font-medium text-foreground">
          קטגוריית ניטור מערכות
        </h2>
        <p className="mb-4">
          קטגוריית &quot;ניטור&quot; באתר זה כוללת אך ורק את SUNWISE, שהיא חברה בבעלות
          מפעילי אתר זה. זה מסומן בבירור בכל מקום שבו השירות מוצג.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
