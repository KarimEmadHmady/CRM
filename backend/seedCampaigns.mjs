// seedCampaigns.mjs
// Run: node seedCampaigns.mjs

const BASE_URL = "http://localhost:5000/api/email-campaigns";
const CREATED_BY = "admin";

const campaigns = [

  // ══════════════════════════════════════════════════
  //  1. WELCOME — GYM
  // ══════════════════════════════════════════════════
  {
    name: "رسالة الترحيب — نادي رياضي (Gym Welcome)",
    subject: "🏋️ أهلاً بك في نظام إدارة الجيم! | Welcome to GymCore!",
    template: "welcome",
    content: `عزيزي {{name}}،

مرحباً بك في نظام GymCore لإدارة الأندية الرياضية! يسعدنا انضمامك إلى منظومتنا المتكاملة.

مع النظام ستتمكن من:
- إدارة اشتراكات الأعضاء ومتابعة تواريخ التجديد
- استقبال المدفوعات وإصدار الفواتير تلقائياً
- الاطلاع على تقارير مالية وإحصائية شاملة
- إرسال إشعارات تلقائية للأعضاء
- التحكم الكامل من لوحة تحكم احترافية

ابدأ الآن على: https://gymcore-system.netlify.app

Dear {{name}},

Welcome to GymCore — your all-in-one gym management system! We're thrilled to have you onboard.

With GymCore you can:
- Manage memberships & track renewal dates effortlessly
- Accept payments and auto-generate invoices
- Access full financial & performance reports
- Send automated renewal reminders to members
- Control everything from a professional dashboard, anywhere

Get started at: https://gymcore-system.netlify.app`,
    targetAudience: "all",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "قالب الترحيب لعملاء الجيم — يُرسل تلقائياً عند إضافة عميل جديد من فئة gym"
  },

  // ══════════════════════════════════════════════════
  //  2. WELCOME — RESTAURANT
  // ══════════════════════════════════════════════════
  {
    name: "رسالة الترحيب — مطعم (Restaurant Welcome)",
    subject: "🍽️ أهلاً بك في نظام إدارة المطعم! | Welcome to QRx Menu!",
    template: "welcome",
    content: `عزيزي {{name}}،

مرحباً بك في نظام QRx Menu لإدارة المطاعم! يسعدنا انضمامك إلى منصتنا الذكية.

مع النظام ستحصل على:
- منيو رقمي تفاعلي يعمل بمسح QR Code
- استقبال الطلبات أونلاين مع إشعارات فورية
- تتبع المناديب والطلبات الخارجية لحظة بلحظة
- تقارير مبيعات تفصيلية لكل وجبة وكل يوم
- تخصيص كامل للمنيو بالصور والأسعار والتصنيفات

سجّل الدخول الآن على: https://qrx-menu.vercel.app

Dear {{name}},

Welcome to QRx Menu — your smart restaurant management platform! We're excited to have you on board.

With QRx Menu you get:
- Interactive digital menu powered by QR Code scanning
- Real-time online order receiving with instant notifications
- Live delivery tracking for every rider & order
- Detailed sales reports per item, per day, per category
- Fully customizable menu with photos, prices & categories

Log in now at: https://qrx-menu.vercel.app`,
    targetAudience: "all",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "قالب الترحيب لعملاء المطاعم — يُرسل تلقائياً عند إضافة عميل جديد من فئة restaurant"
  },

  // ══════════════════════════════════════════════════
  //  3. EXPIRY REMINDER — 7 DAYS
  // ══════════════════════════════════════════════════
  {
    name: "تذكير انتهاء الاشتراك — 7 أيام (Expiry Reminder 7 Days)",
    subject: "⏰ اشتراكك ينتهي خلال 7 أيام! | Your Subscription Expires in 7 Days!",
    template: "expiry_reminder",
    content: `عزيزي {{name}}،

تنبيه مهم: اشتراكك سينتهي خلال 7 أيام فقط.

لتجنب انقطاع الخدمة وفقدان الوصول إلى النظام، يرجى تجديد اشتراكك في أقرب وقت ممكن.

تواصل معنا الآن للتجديد وضمان استمرارية خدمتك بدون أي انقطاع.

Dear {{name}},

Important notice: Your subscription expires in only 7 days.

To avoid service interruption and losing access to the system, please renew your subscription as soon as possible.

Contact us now to renew and ensure continuity of your service without any interruption.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل تلقائياً قبل 7 أيام من انتهاء الاشتراك"
  },

  // ══════════════════════════════════════════════════
  //  4. EXPIRY REMINDER — 3 DAYS
  // ══════════════════════════════════════════════════
  {
    name: "تذكير انتهاء الاشتراك — 3 أيام (Expiry Reminder 3 Days)",
    subject: "🚨 اشتراكك ينتهي خلال 3 أيام فقط! | Only 3 Days Left on Your Subscription!",
    template: "expiry_reminder",
    content: `عزيزي {{name}}،

تنبيه عاجل: لم يتبق على انتهاء اشتراكك سوى 3 أيام فقط!

إذا لم تقم بالتجديد، سيتوقف وصولك إلى النظام بشكل كامل. جدد الآن لتتجنب أي انقطاع في الخدمة.

تواصل مع فريقنا فوراً لإتمام التجديد.

Dear {{name}},

Urgent notice: Only 3 days remaining on your subscription!

If you don't renew, your access to the system will be completely suspended. Renew now to avoid any service interruption.

Contact our team immediately to complete the renewal.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل تلقائياً قبل 3 أيام من انتهاء الاشتراك — نبرة أكثر إلحاحاً"
  },

  // ══════════════════════════════════════════════════
  //  5. EXPIRY REMINDER — EXPIRED (1 DAY AFTER)
  // ══════════════════════════════════════════════════
  {
    name: "اشتراك منتهي — استعادة العميل (Subscription Expired)",
    subject: "❌ انتهى اشتراكك — جدد الآن لاستعادة الوصول | Subscription Expired — Renew to Restore Access",
    template: "expiry_reminder",
    content: `عزيزي {{name}}،

للأسف، انتهى اشتراكك وتم تعليق وصولك إلى النظام.

لا تقلق! يمكنك استعادة وصولك الكامل فوراً بمجرد تجديد اشتراكك. كل بياناتك محفوظة وستعود إليها بنفس اللحظة.

تواصل معنا الآن ولا تدع فرصة الاستمرار تفوتك.

Dear {{name}},

Unfortunately, your subscription has expired and your access to the system has been suspended.

Don't worry! You can restore your full access immediately by renewing your subscription. All your data is saved and will be available to you right away.

Contact us now and don't miss the chance to continue.`,
    targetAudience: "expired",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل للعملاء بعد انتهاء اشتراكهم مباشرة — هدفه استعادة العميل"
  },

  // ══════════════════════════════════════════════════
  //  6. PAYMENT REMINDER — PENDING
  // ══════════════════════════════════════════════════
  {
    name: "تذكير بالدفع المعلق (Payment Reminder — Pending)",
    subject: "💳 تذكير: يوجد دفع معلق على حسابك | Reminder: Pending Payment on Your Account",
    template: "payment_reminder",
    content: `عزيزي {{name}}،

هذا تذكير بأن دفع اشتراكك لا يزال معلقاً حتى الآن.

لتجنب تعليق الخدمة، يرجى إكمال الدفع في أقرب وقت ممكن. تواصل مع فريقنا لأي استفسار بخصوص طرق الدفع المتاحة.

نقدر تعاملك معنا ونسعى دائماً لتقديم أفضل خدمة.

Dear {{name}},

This is a reminder that your subscription payment is still pending.

To avoid service suspension, please complete your payment as soon as possible. Contact our team for any inquiries about available payment methods.

We appreciate your business and always strive to provide the best service.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل للعملاء الذين لم يكملوا الدفع بعد — يُكرر كل 7 أيام"
  },

  // ══════════════════════════════════════════════════
  //  7. PAYMENT REMINDER — OVERDUE
  // ══════════════════════════════════════════════════
  {
    name: "تذكير الدفع المتأخر (Overdue Payment Reminder)",
    subject: "🔴 تنبيه عاجل: دفعة متأخرة على حسابك | Urgent: Overdue Payment on Your Account",
    template: "payment_reminder",
    content: `عزيزي {{name}}،

تنبيه عاجل: مدفوعاتك متأخرة ولم يتم تسوية حسابك حتى الآن.

إذا لم يتم إكمال الدفع خلال الأيام القليلة القادمة، سيتم تعليق خدمتك تلقائياً. يرجى التواصل معنا فوراً لتسوية وضعك.

نحن هنا لمساعدتك وإيجاد الحل المناسب.

Dear {{name}},

Urgent notice: Your payments are overdue and your account has not been settled yet.

If payment is not completed within the next few days, your service will be automatically suspended. Please contact us immediately to settle your account.

We are here to help you find the right solution.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل عند تأخر الدفع أكثر من 14 يوم — نبرة أكثر جدية"
  },

  // ══════════════════════════════════════════════════
  //  8. PROMOTION — GYM DISCOUNT
  // ══════════════════════════════════════════════════
  {
    name: "عرض ترويجي — خصم على الجيم (Gym Promotion)",
    subject: "🎁 عرض حصري: خصم 25% على اشتراكات الجيم! | Exclusive: 25% Off Gym Subscriptions!",
    template: "promotion",
    content: `عزيزي {{name}}،

عرض لفترة محدودة! احصل على خصم 25% على جميع اشتراكات نظام إدارة الجيم.

هذا العرض هو فرصتك لرفع مستوى إدارة ناديك الرياضي بتكلفة أقل. لا تفوّت هذه الفرصة الرائعة!

تواصل معنا الآن للاستفادة من العرض قبل انتهائه.

Dear {{name}},

Limited time offer! Get 25% off all GymCore management system subscriptions.

This offer is your chance to upgrade your gym management at a lower cost. Don't miss this amazing opportunity!

Contact us now to take advantage of the offer before it expires.`,
    targetAudience: "interested",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "عرض ترويجي للعملاء المحتملين من فئة الجيم"
  },

  // ══════════════════════════════════════════════════
  //  9. PROMOTION — RESTAURANT DISCOUNT
  // ══════════════════════════════════════════════════
  {
    name: "عرض ترويجي — خصم على المطعم (Restaurant Promotion)",
    subject: "🍽️ عرض خاص: خصم 20% على نظام إدارة المطعم! | Special Offer: 20% Off Restaurant System!",
    template: "promotion",
    content: `عزيزي {{name}}،

عرض استثنائي! خصم 20% على اشتراك نظام QRx Menu لإدارة المطاعم.

حوّل طريقة إدارة مطعمك اليوم بمنيو رقمي احترافي وطلبات أونلاين وتتبع مناديب — كل ذلك بسعر أقل!

سارع بالتواصل معنا الآن لا تدع هذا العرض يفوتك.

Dear {{name}},

Exceptional offer! 20% off QRx Menu restaurant management system subscription.

Transform how you manage your restaurant today with a professional digital menu, online orders, and delivery tracking — all at a lower price!

Contact us now and don't let this offer pass you by.`,
    targetAudience: "interested",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "عرض ترويجي للعملاء المحتملين من فئة المطاعم"
  },

  // ══════════════════════════════════════════════════
  //  10. PROMOTION — RENEWAL DISCOUNT
  // ══════════════════════════════════════════════════
  {
    name: "عرض تجديد الاشتراك (Renewal Discount Promotion)",
    subject: "🔄 جدد اشتراكك واحصل على خصم 15% | Renew Your Subscription & Get 15% Off!",
    template: "promotion",
    content: `عزيزي {{name}}،

شكراً لولائك! كهدية منا لك، نقدم لك خصم 15% عند تجديد اشتراكك خلال الأسبوع القادم.

جدد الآن واستمر في الاستفادة من كامل مميزات النظام بسعر مخفض.

تواصل مع فريقنا وأذكر هذا العرض عند التجديد.

Dear {{name}},

Thank you for your loyalty! As a gift from us, we're offering you 15% off when you renew your subscription within the next week.

Renew now and continue enjoying all system features at a discounted price.

Contact our team and mention this offer when renewing.`,
    targetAudience: "expired",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يستهدف العملاء المنتهية اشتراكاتهم لاستعادتهم بخصم على التجديد"
  },

  // ══════════════════════════════════════════════════
  //  11. NEWSLETTER — MONTHLY
  // ══════════════════════════════════════════════════
  {
    name: "النشرة الشهرية (Monthly Newsletter)",
    subject: "📰 نشرتنا الشهرية — أحدث التحديثات والمميزات الجديدة | Monthly Newsletter",
    template: "newsletter",
    content: `عزيزي {{name}}،

إليك أحدث أخبار وتحديثات الشهر:

✅ تحديثات النظام: أضفنا تقارير متقدمة جديدة وحسّنّا أداء لوحة التحكم.
🆕 مميزات جديدة: الآن يمكنك تصدير التقارير بصيغة PDF و Excel.
💡 نصائح الشهر: استخدم ميزة الإشعارات التلقائية لتقليل حالات الانقطاع.
📊 إحصائيات: عملاؤنا وفّروا في المتوسط 40% من وقت الإدارة اليدوية.

Dear {{name}},

Here are the latest news and updates for this month:

✅ System Updates: We added new advanced reports and improved dashboard performance.
🆕 New Features: You can now export reports in PDF and Excel formats.
💡 Tip of the Month: Use the automated notifications feature to reduce service interruptions.
📊 Statistics: Our clients saved an average of 40% of manual management time.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل شهرياً لجميع المشتركين النشطين"
  },

  // ══════════════════════════════════════════════════
  //  12. ANNOUNCEMENT — SYSTEM UPDATE
  // ══════════════════════════════════════════════════
  {
    name: "إعلان: تحديث النظام (System Update Announcement)",
    subject: "📢 إعلان هام: تحديث النظام قادم | Important: System Update Incoming",
    template: "announcement",
    content: `عزيزي {{name}}،

نود إعلامك بأننا سنجري تحديثاً مهماً على النظام قريباً.

تفاصيل الصيانة:
- الوقت: الجمعة من 2:00 صباحاً حتى 6:00 صباحاً
- المدة المتوقعة: 4 ساعات
- التأثير: لن يكون بإمكانك الدخول على النظام خلال هذه الفترة

بعد التحديث ستستمتع بأداء أسرع ومميزات جديدة. نعتذر عن أي إزعاج.

Dear {{name}},

We would like to inform you that we will be performing an important system update soon.

Maintenance Details:
- Time: Friday from 2:00 AM to 6:00 AM
- Expected Duration: 4 hours
- Impact: System will be inaccessible during this period

After the update you'll enjoy faster performance and new features. We apologize for any inconvenience.`,
    targetAudience: "all",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل قبل 48 ساعة من أي صيانة أو تحديث مجدول"
  },

  // ══════════════════════════════════════════════════
  //  13. ANNOUNCEMENT — NEW FEATURE
  // ══════════════════════════════════════════════════
  {
    name: "إعلان: ميزة جديدة (New Feature Announcement)",
    subject: "🆕 ميزة جديدة: جرّبها الآن مجاناً! | New Feature: Try It Now for Free!",
    template: "announcement",
    content: `عزيزي {{name}}،

يسعدنا الإعلان عن إطلاق ميزة جديدة مثيرة في النظام!

الميزة الجديدة: تقارير الأداء المتقدمة
- تحليل مفصّل لأداء عملك يومياً وأسبوعياً وشهرياً
- رسوم بيانية تفاعلية لمتابعة النمو
- تصدير التقارير بصيغة PDF أو Excel بنقرة واحدة
- مقارنة الأداء مع الفترات السابقة

الميزة متاحة الآن لجميع المشتركين — جرّبها اليوم!

Dear {{name}},

We're excited to announce the launch of an exciting new feature in the system!

New Feature: Advanced Performance Reports
- Detailed analysis of your business performance daily, weekly, and monthly
- Interactive charts to track growth
- Export reports as PDF or Excel with one click
- Compare performance with previous periods

The feature is now available to all subscribers — try it today!`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل عند إطلاق ميزة جديدة في النظام"
  },

  // ══════════════════════════════════════════════════
  //  14. INVITATION — WEBINAR
  // ══════════════════════════════════════════════════
  {
    name: "دعوة: ندوة تدريبية (Training Webinar Invitation)",
    subject: "✉️ دعوة خاصة: ندوة مجانية لتعلم أسرار النظام | Special Invite: Free Training Webinar",
    template: "invitation",
    content: `عزيزي {{name}}،

يشرفنا دعوتك للمشاركة في ندوتنا التدريبية المجانية!

تفاصيل الحدث:
- الموضوع: كيف تحقق أقصى استفادة من نظام الإدارة
- التاريخ: السبت القادم
- الوقت: 7:00 مساءً
- المكان: أونلاين (رابط سيُرسل عند التسجيل)
- المدة: ساعة واحدة

ما ستتعلمه:
✅ إعداد النظام بشكل صحيح من البداية
✅ أهم الميزات التي يغفلها معظم المستخدمين
✅ كيف تقرأ التقارير وتتخذ قرارات ذكية
✅ جلسة أسئلة وأجوبة مباشرة

Dear {{name}},

We are honoured to invite you to our free training webinar!

Event Details:
- Topic: How to get the most out of the management system
- Date: Next Saturday
- Time: 7:00 PM
- Location: Online (link will be sent upon registration)
- Duration: One hour

What you'll learn:
✅ Setting up the system correctly from the start
✅ Key features most users overlook
✅ How to read reports and make smart decisions
✅ Live Q&A session`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "دعوة لندوة تدريبية مجانية — يُرسل قبل أسبوع من الحدث"
  },

  // ══════════════════════════════════════════════════
  //  15. INVITATION — REFERRAL PROGRAM
  // ══════════════════════════════════════════════════
  {
    name: "دعوة: برنامج الإحالة (Referral Program Invitation)",
    subject: "🎯 انضم لبرنامج الإحالة واكسب مكافآت! | Join Our Referral Program & Earn Rewards!",
    template: "invitation",
    content: `عزيزي {{name}}،

لأنك عميل مميز، ندعوك للانضمام إلى برنامج الإحالة الخاص بنا!

كيف يعمل البرنامج؟
1. شارك رابط الإحالة الخاص بك مع أصحاب الأعمال
2. عند اشتراك أي شخص عبر رابطك، تحصل على شهر مجاني
3. لا يوجد حد أقصى للمكافآت — كلما أحلت أكثر، كسبت أكثر!

This is an exclusive invitation for our valued customers!

How the program works:
1. Share your unique referral link with business owners
2. When anyone subscribes through your link, you get one free month
3. No limit on rewards — the more you refer, the more you earn!`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "دعوة للمشتركين النشطين للانضمام لبرنامج الإحالة"
  },

  // ══════════════════════════════════════════════════
  //  16. SURVEY — SATISFACTION
  // ══════════════════════════════════════════════════
  {
    name: "استبيان: رضا العملاء (Customer Satisfaction Survey)",
    subject: "📝 رأيك يهمنا — استبيان قصير (دقيقتان فقط) | Your Opinion Matters — Quick Survey (2 mins)",
    template: "survey",
    content: `عزيزي {{name}}،

نسعى دائماً لتحسين خدماتنا، ورأيك هو البوصلة التي تقودنا.

هل يمكنك تخصيص دقيقتين فقط للإجابة على استبيان قصير؟

ما الذي سنسألك عنه؟
- مدى رضاك عن النظام وسهولة الاستخدام
- المميزات التي تجدها مفيدة أكثر
- ما الذي تودّ أن نحسّنه أو نضيفه

مشاركتك ستساعدنا مباشرة في تطوير النظام لخدمتك بشكل أفضل.

Dear {{name}},

We always strive to improve our services, and your opinion is the compass that guides us.

Can you spare just 2 minutes to answer a short survey?

What we'll ask about:
- Your satisfaction with the system and ease of use
- Features you find most useful
- What you'd like us to improve or add

Your participation will directly help us develop the system to serve you better.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل كل 3 أشهر للمشتركين النشطين لقياس رضاهم"
  },

  // ══════════════════════════════════════════════════
  //  17. SURVEY — POST ONBOARDING
  // ══════════════════════════════════════════════════
  {
    name: "استبيان: بعد بداية الاستخدام (Post-Onboarding Survey)",
    subject: "🌟 كيف كانت تجربتك الأولى مع النظام؟ | How Was Your First Experience?",
    template: "survey",
    content: `عزيزي {{name}}،

مضى الآن أسبوع على انضمامك إلى نظامنا، ونودّ معرفة كيف سارت تجربتك الأولى.

أسئلة قصيرة تساعدنا على فهم تجربتك:
- هل وجدت صعوبة في البدء والإعداد؟
- هل تحتاج إلى مساعدة أو تدريب إضافي؟
- هل هناك أي شيء غير واضح تريد شرحه؟

نحن هنا لمساعدتك في كل خطوة.

Dear {{name}},

It's been a week since you joined our system, and we'd like to know how your first experience went.

Short questions to help us understand your experience:
- Did you find it difficult to get started and set up?
- Do you need additional help or training?
- Is there anything unclear that you'd like explained?

We are here to help you every step of the way.`,
    targetAudience: "all",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل بعد أسبوع من بدء استخدام النظام لأول مرة"
  },

  // ══════════════════════════════════════════════════
  //  18. CUSTOM — WIN BACK
  // ══════════════════════════════════════════════════
  {
    name: "استعادة العميل المنقطع (Win-Back Campaign)",
    subject: "💔 نفتقدك! عد إلينا واحصل على عرض خاص | We Miss You! Come Back & Get a Special Deal",
    template: "custom",
    content: `عزيزي {{name}}،

لاحظنا أنك لم تجدد اشتراكك منذ فترة، ونودّ أن نعرف كيف يمكننا مساعدتك.

هل واجهت أي مشكلة؟ هل كان هناك شيء لم يناسبك في النظام؟ نحن هنا للاستماع وتحسين تجربتك.

وكهدية لعودتك، نقدم لك خصم 20% على اشتراكك القادم. تواصل معنا الآن.

Dear {{name}},

We noticed you haven't renewed your subscription for a while, and we'd like to know how we can help you.

Did you face any problems? Was there something that didn't suit you in the system? We are here to listen and improve your experience.

As a gift for your return, we're offering you 20% off your next subscription. Contact us now.`,
    targetAudience: "expired",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يستهدف العملاء المنقطعين منذ أكثر من 30 يوم — هدفه إعادة التفاعل"
  },

  // ══════════════════════════════════════════════════
  //  19. CUSTOM — ONBOARDING TIPS
  // ══════════════════════════════════════════════════
  {
    name: "نصائح البدء السريع (Quick Start Tips)",
    subject: "🚀 ابدأ بقوة — أهم 5 خطوات لتفعيل نظامك بالكامل | Quick Start: 5 Steps to Fully Activate Your System",
    template: "custom",
    content: `عزيزي {{name}}،

مرحباً بك مجدداً! لمساعدتك على الاستفادة القصوى من النظام، إليك أهم 5 خطوات:

الخطوة 1: أكمل إعداد بيانات شركتك وشعارها في الإعدادات
الخطوة 2: أضف أول عميل أو عضو وجرّب إنشاء اشتراك
الخطوة 3: فعّل الإشعارات التلقائية لتذكيرات التجديد
الخطوة 4: استكشف قسم التقارير لمتابعة أداء عملك
الخطوة 5: تواصل مع فريق الدعم لأي مساعدة — نحن دائماً هنا!

Dear {{name}},

Welcome back! To help you get the most out of the system, here are the top 5 steps:

Step 1: Complete your company profile and logo setup in settings
Step 2: Add your first client or member and try creating a subscription
Step 3: Activate automated notifications for renewal reminders
Step 4: Explore the reports section to monitor your business performance
Step 5: Contact our support team for any help — we're always here!`,
    targetAudience: "all",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل بعد يومين من إنشاء الحساب لمساعدة العميل على البدء"
  },

  // ══════════════════════════════════════════════════
  //  20. CUSTOM — THANK YOU
  // ══════════════════════════════════════════════════
  {
    name: "شكراً على التجديد (Thank You for Renewal)",
    subject: "🙏 شكراً لتجديد اشتراكك — نقدر ثقتك! | Thank You for Renewing — We Appreciate Your Trust!",
    template: "custom",
    content: `عزيزي {{name}}،

شكراً جزيلاً على تجديد اشتراكك معنا! ثقتك بنا هي الدافع الأكبر لنا للاستمرار في التطوير والتحسين.

اشتراكك الجديد أصبح نشطاً الآن وبإمكانك الاستفادة من كافة مميزات النظام بالكامل.

إذا احتجت أي مساعدة أو كان لديك أي سؤال، فريقنا دائماً في خدمتك.

Dear {{name}},

Thank you so much for renewing your subscription with us! Your trust in us is our greatest motivation to continue developing and improving.

Your new subscription is now active and you can enjoy all system features in full.

If you need any help or have any questions, our team is always at your service.`,
    targetAudience: "subscribed",
    settings: { trackOpens: true, trackClicks: true, sendImmediately: false },
    createdBy: CREATED_BY,
    notes: "يُرسل تلقائياً بعد إتمام عملية تجديد الاشتراك"
  }
];

// ═══════════════════════════════════════════════════════
//  MAIN RUNNER
// ═══════════════════════════════════════════════════════
async function seed() {
  console.log("🚀 Starting email campaign seed...\n");
  console.log(`📡 Target: ${BASE_URL}`);
  console.log(`📦 Total campaigns to insert: ${campaigns.length}\n`);
  console.log("─".repeat(60));

  let success = 0;
  let failed  = 0;
  const errors = [];

  for (let i = 0; i < campaigns.length; i++) {
    const campaign = campaigns[i];
    const index = String(i + 1).padStart(2, "0");

    try {
      const response = await fetch(BASE_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(campaign)
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status} — ${errBody}`);
      }

      const data = await response.json();
      console.log(`✅ [${index}/${campaigns.length}] ${campaign.name}`);
      console.log(`        ID: ${data._id || data.id || "N/A"}`);
      success++;

    } catch (err) {
      console.error(`❌ [${index}/${campaigns.length}] ${campaign.name}`);
      console.error(`        Error: ${err.message}`);
      failed++;
      errors.push({ name: campaign.name, error: err.message });
    }

    // Small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 150));
  }

  console.log("\n" + "═".repeat(60));
  console.log("📊 SEED SUMMARY");
  console.log("═".repeat(60));
  console.log(`✅ Success : ${success}`);
  console.log(`❌ Failed  : ${failed}`);
  console.log(`📦 Total   : ${campaigns.length}`);

  if (errors.length > 0) {
    console.log("\n⚠️  Failed campaigns:");
    errors.forEach(e => console.log(`   • ${e.name}\n     → ${e.error}`));
  }

  console.log("\n✨ Seed complete!");
}

seed().catch(err => {
  console.error("💥 Fatal error:", err.message);
  process.exit(1);
});
