# لولا دعاؤكم — lolaDuaakum

> قُلْ مَا يَعْبَأُ بِكُمْ رَبِّي لَوْلَا دُعَاؤُكُمْ — الفرقان: ٧٧

موقع تفاعلي للأدعية والأذكار مُستخلَص من كتاب **«لولا دعاؤكم»**

## 🌐 الموقع
[lolaDuaakum.github.io](https://MohanadOthman.github.io/lolaDuaakum)

## ✨ المحتوى

| القسم | الوصف |
|---|---|
| 📿 الأدعية | ١٢ تصنيف من القرآن والسنة مع شرح المعاني |
| 📖 الأذكار | أذكار مختارة مع سبحة إلكترونية ووضع التلاوة |
| 🗺️ خريطة الأذكار | رحلة تفاعلية بصرية لأذكار الصباح والمساء |
| 🕊️ آداب الدعاء | آداب الدعاء من الكتاب والسنة |
| ⏰ مواضع الإجابة | أوقات وأحوال تُستجاب فيها الدعوة |

## 📁 هيكل الملفات

```
lolaDuaakum/
├── index.html          ← الصفحة الرئيسية
├── kharita.html        ← خريطة الأذكار التفاعلية
├── data/
│   ├── duas.json           ← أدعية الكتاب مع الشرح
│   ├── adkar.json          ← الأذكار والتسبيح
│   ├── adab-mawadi3.json   ← آداب الدعاء ومواضع الإجابة
│   └── kharita-adkar.json  ← بيانات خريطة الأذكار
└── README.md
```

## 🛠️ التشغيل المحلي

```bash
# خادم بسيط بـ Python
python3 -m http.server 8000
# ثم افتح: http://localhost:8000
```

> ⚠️ يجب تشغيله عبر خادم HTTP (لا يعمل بفتح الملف مباشرة) بسبب fetch() لملفات JSON

## 📦 رفع على GitHub Pages

```bash
git init
git add .
git commit -m "🌙 أول إصدار - لولا دعاؤكم"
git branch -M main
git remote add origin https://github.com/MohanadOthman/lolaDuaakum.git
git push -u origin main
```

ثم من إعدادات الـ repository → Pages → اختر `main` branch → Save

## 📝 إضافة محتوى جديد

كل شيء في ملفات `data/` — افتح الملف المناسب وأضف الكائن بنفس الهيكل.

**مثال — إضافة دعاء جديد في `duas.json`:**
```json
{
  "text": "نص الدعاء",
  "label": "اسم الدعاء",
  "note": "شرح المعنى",
  "source": "المصدر",
  "target": 3
}
```

## 📖 المصدر

كتاب **«لولا دعاؤكم»** — وقف لله تعالى
📧 thebook77@gmail.com
