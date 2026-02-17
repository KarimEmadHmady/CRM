import nodemailer from "nodemailer";
import { EmailCampaign } from "../modles/emailCampaign.model.js";
import { Customer } from "../modles/customer.model.js";
import { Notification } from "../modles/notification.model.js";
import { EmailConfig } from "../modles/emailConfig.model.js";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config()

// Default email transporter setup (fallback)
const defaultTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Cache for active transporters
const transporterCache = new Map();

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Convert plain-text newlines → HTML <br> tags so content
 * stored as multi-line strings renders correctly in emails.
 */
function nl2br(str) {
    if (!str) return '';
    return String(str).replace(/\r\n|\r|\n/g, '<br>');
}

/**
 * Replace ALL occurrences of {{name}} (not just the first one).
 */
function injectName(content, name) {
    if (!content) return '';
    return content.replaceAll('{{name}}', name || '');
}

export class EmailService {

    // Get or create transporter for a specific configuration
    static async getTransporter(provider = null) {
        try {
            if (!provider) {
                const gmailConfig = await EmailConfig.findOne({ provider: 'gmail', isActive: true });
                if (gmailConfig) return this.getTransporterForConfig(gmailConfig);
                const smtpConfig = await EmailConfig.findOne({ provider: 'smtp', isActive: true });
                if (smtpConfig) return this.getTransporterForConfig(smtpConfig);
                return defaultTransporter;
            }
            const activeConfig = await EmailConfig.findOne({ provider, isActive: true });
            if (activeConfig) return this.getTransporterForConfig(activeConfig);
            return defaultTransporter;
        } catch (error) {
            console.error('Error getting transporter:', error);
            return defaultTransporter;
        }
    }

    static getTransporterForConfig(config) {
        const cacheKey = `${config.provider}_${config._id}`;
        if (transporterCache.has(cacheKey)) return transporterCache.get(cacheKey);
        const transporter = config.createTransporter();
        transporterCache.set(cacheKey, transporter);
        return transporter;
    }

    static async sendEmailWithConfig(config, { to, subject, text, template, html, metadata }) {
        try {
            const transporter = this.getTransporterForConfig(config);
            let finalHtml = html;
            if (template === 'welcome' && metadata) {
                finalHtml = this.generateTemplate(template, text, metadata, config.fromName);
            }

            const mailOptions = {
                from: { name: config.fromName || process.env.APP_NAME || 'System', address: config.fromEmail },
                to, subject, text,
                html: finalHtml || this.generateTemplate(template, text, metadata),
                list: {
                    help: `mailto:${config.fromEmail}`,
                    unsubscribe: `mailto:${config.fromEmail}?subject=Unsubscribe`
                },
                headers: {
                    'X-Priority': '1',
                    'X-Mailer': 'NodeMailer',
                    'X-MS-Exchange-Organization-SCL': '-1',
                    'X-Auto-Response-Suppress': 'All',
                    'X-Google-App-Id': config.fromEmail
                }
            };

            const result = await transporter.sendMail(mailOptions);
            config.statistics.totalSent += 1;
            config.statistics.lastUsed = new Date();
            await config.save();
            return result;
        } catch (error) {
            console.error('Email sending error:', error);
            config.statistics.totalFailed += 1;
            await config.save();
            throw error;
        }
    }

    static async sendEmail({ to, subject, text, template, html, metadata, provider }) {
        try {
            const transporter = await this.getTransporter(provider);
            const config = await this.getConfigForUpdate(provider);
            let finalHtml = html;
            if (template === 'welcome' && metadata) {
                finalHtml = this.generateTemplate(template, text, metadata);
            }

            const mailOptions = {
                from: { name: process.env.APP_NAME || 'System', address: process.env.EMAIL_USER },
                to, subject, text,
                html: finalHtml || this.generateTemplate(template, text, metadata),
                list: {
                    help: `mailto:${process.env.EMAIL_USER}`,
                    unsubscribe: `mailto:${process.env.EMAIL_USER}?subject=Unsubscribe`
                },
                headers: {
                    'X-Priority': '1',
                    'X-Mailer': 'NodeMailer',
                    'X-MS-Exchange-Organization-SCL': '-1',
                    'X-Auto-Response-Suppress': 'All',
                    'X-Google-App-Id': process.env.EMAIL_USER
                }
            };

            const result = await transporter.sendMail(mailOptions);
            console.log(result);
            if (config) {
                config.statistics.totalSent += 1;
                config.statistics.lastUsed = new Date();
                await config.save();
            }
            return result;
        } catch (error) {
            console.error('Email sending error:', error);
            const config = await this.getConfigForUpdate(provider);
            if (config) {
                config.statistics.totalFailed += 1;
                await config.save();
            }
            throw error;
        }
    }

    static async getConfigForUpdate(provider = null) {
        try {
            if (!provider) {
                const gmailConfig = await EmailConfig.findOne({ provider: 'gmail', isActive: true });
                if (gmailConfig) return gmailConfig;
                const smtpConfig = await EmailConfig.findOne({ provider: 'smtp', isActive: true });
                if (smtpConfig) return smtpConfig;
                return null;
            }
            const activeConfig = await EmailConfig.findOne({ provider, isActive: true });
            if (activeConfig) return activeConfig;
            return null;
        } catch (error) {
            console.error('Error getting config for update:', error);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  SHARED HELPER: base layout wrapper
    // ─────────────────────────────────────────────────────────────
    static _baseLayout({ accentColor, headerIcon, headerAr, headerEn, bodyAr, bodyEn, ctaHref, ctaLabelAr, ctaLabelEn, footerName, extraImages }) {
        const images = extraImages && extraImages.length
            ? extraImages.map(src => `<img src="${src}" alt="" style="max-width:100%;border-radius:10px;margin:8px 0;display:block;">`).join('')
            : '';

        return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerAr}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.10);">

          <!-- HEADER BAND -->
          <tr>
            <td style="background:linear-gradient(135deg,${accentColor} 0%,${accentColor}cc 100%);padding:36px 40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">${headerIcon}</div>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${headerAr}</h1>
              <p  style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${headerEn}</p>
            </td>
          </tr>

          <!-- ARABIC BODY -->
          <tr>
            <td style="padding:36px 40px 20px;text-align:right;direction:rtl;">
              <p style="margin:0 0 6px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;">بالعربية</p>
              <div style="font-size:15px;line-height:2;color:#444;">
                ${nl2br(bodyAr)}
              </div>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eee;margin:10px 0;">
            </td>
          </tr>

          <!-- ENGLISH BODY -->
          <tr>
            <td style="padding:20px 40px 28px;text-align:left;direction:ltr;">
              <p style="margin:0 0 6px;font-size:13px;color:#999;text-transform:uppercase;letter-spacing:1px;">In English</p>
              <div style="font-size:15px;line-height:2;color:#444;">
                ${nl2br(bodyEn)}
              </div>
            </td>
          </tr>

          ${images ? `
          <!-- EXTRA IMAGES -->
          <tr>
            <td style="padding:0 40px 28px;text-align:center;">
              ${images}
            </td>
          </tr>` : ''}

          ${ctaHref ? `
          <!-- CTA BUTTON -->
          <tr>
            <td style="padding:0 40px 36px;text-align:center;">
              <a href="${ctaHref}" style="display:inline-block;background:${accentColor};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                ${ctaLabelAr} &nbsp;|&nbsp; ${ctaLabelEn}
              </a>
            </td>
          </tr>` : ''}

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8f9fa;padding:22px 40px;text-align:center;border-top:1px solid #eee;">
              <p style="margin:0;font-size:13px;color:#aaa;">
                مع أطيب التحيات &nbsp;|&nbsp; Best regards<br>
                <strong style="color:#777;">${footerName}</strong>
              </p>
              <p style="margin:10px 0 0;font-size:11px;color:#ccc;">
                لإلغاء الاشتراك في هذه الرسائل، أرسل بريداً إلكترونياً إلى فريق الدعم<br>
                To unsubscribe, contact our support team.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }

    // ─────────────────────────────────────────────────────────────
    //  TEMPLATE FACTORY
    // ─────────────────────────────────────────────────────────────
    static generateTemplate(template, content, metadata = {}, fromName = null) {
        const appName  = fromName || process.env.APP_NAME || 'System';
        const category = metadata?.category || 'default';

        // ── Smart content splitter ──────────────────────────────
        // Content is stored as plain text with \n\n separating
        // the Arabic block from the English block.
        // We split on the first "Dear " line to ensure the name
        // replacement and section break are always correct.
        const splitContent = (raw) => {
            if (!raw) return { ar: '', en: '' };
            // Split on blank line before "Dear " (English section start)
            const idx = raw.search(/\n\nDear /);
            if (idx !== -1) {
                return {
                    ar: raw.slice(0, idx).trim(),
                    en: raw.slice(idx).trim()
                };
            }
            // Fallback: split on double newline
            const parts = raw.split('\n\n');
            return {
                ar: parts[0]?.trim() || raw,
                en: parts.slice(1).join('\n\n').trim() || raw
            };
        };

        const { ar: rawAr, en: rawEn } = splitContent(content);
        // Apply nl2br so every \n becomes <br> in the email
        const arHtml = nl2br(rawAr);
        const enHtml = nl2br(rawEn);

        switch (template) {

            // ══════════════════════════════════════
            //  WELCOME — GYM
            // ══════════════════════════════════════
            case 'welcome': {
                if (category === 'gym') {
                    return this._baseLayout({
                        accentColor: '#1a1a2e',
                        headerIcon: '🏋️',
                        headerAr: 'أهلاً وسهلاً بك في نظام إدارة الجيم!',
                        headerEn: 'Welcome to the Gym Management System!',
                        bodyAr: `
                            <p>يسعدنا انضمامك إلى منظومتنا المتكاملة لإدارة الأندية الرياضية.</p>
                            <p>مع <strong>GymCore</strong>، ستتمكن من:</p>
                            <ul style="padding-right:20px;line-height:2;">
                                <li>📋 إدارة اشتراكات الأعضاء ومتابعة تواريخ التجديد</li>
                                <li>💰 استقبال المدفوعات وإصدار الفواتير تلقائياً</li>
                                <li>📊 تقارير مالية وإحصائية شاملة لمتابعة نمو نادیك</li>
                                <li>🔔 إشعارات تلقائية للأعضاء عند اقتراب موعد التجديد</li>
                                <li>📱 لوحة تحكم احترافية تعمل من أي جهاز في أي وقت</li>
                            </ul>
                            <p style="margin-top:20px;">ابدأ الآن وحوّل إدارة نادیك إلى تجربة سلسة ومثمرة.</p>
                        `,
                        bodyEn: `
                            <p>We're thrilled to have you onboard our all-in-one gym management platform.</p>
                            <p>With <strong>GymCore</strong>, you can:</p>
                            <ul style="padding-left:20px;line-height:2;">
                                <li>📋 Manage memberships & track renewal dates effortlessly</li>
                                <li>💰 Accept payments and auto-generate invoices</li>
                                <li>📊 Access full financial & performance reports</li>
                                <li>🔔 Send automated renewal reminders to members</li>
                                <li>📱 Control everything from a professional dashboard, anywhere</li>
                            </ul>
                            <p style="margin-top:20px;">Start now and transform how you run your gym.</p>
                        `,
                        ctaHref: metadata?.categorySpecificLink || 'https://gymcore-system.netlify.app',
                        ctaLabelAr: 'انتقل إلى لوحة التحكم',
                        ctaLabelEn: 'Go to Dashboard',
                        footerName: appName,
                        extraImages: [
                            metadata?.categorySpecificImage || 'https://gymcore-system.netlify.app/234345555.jpg'
                        ]
                    });
                }

                // ══════════════════════════════════════
                //  WELCOME — RESTAURANT
                // ══════════════════════════════════════
                if (category === 'restaurant') {
                    return this._baseLayout({
                        accentColor: '#b5451b',
                        headerIcon: '🍽️',
                        headerAr: 'أهلاً وسهلاً بك في نظام إدارة المطعم!',
                        headerEn: 'Welcome to the Restaurant Management System!',
                        bodyAr: `
                            <p>يسعدنا انضمامك إلى منصتنا الذكية لإدارة المطاعم.</p>
                            <p>مع نظام <strong>QRx Menu</strong>، ستحصل على:</p>
                            <ul style="padding-right:20px;line-height:2;">
                                <li>📱 منيو رقمي تفاعلي يعمل بمسح QR Code</li>
                                <li>🛒 استقبال الطلبات أونلاين مع إشعارات فورية</li>
                                <li>🛵 تتبع المناديب والطلبات الخارجية لحظة بلحظة</li>
                                <li>📊 تقارير مبيعات تفصيلية لكل وجبة وكل يوم</li>
                                <li>🎨 تخصيص كامل للمنيو بالصور والأسعار والتصنيفات</li>
                            </ul>
                            <p style="margin-top:20px;">قم بتسجيل الدخول الآن وارفع مستوى خدمة مطعمك.</p>
                        `,
                        bodyEn: `
                            <p>We're excited to have you on our smart restaurant management platform.</p>
                            <p>With <strong>QRx Menu</strong>, you get:</p>
                            <ul style="padding-left:20px;line-height:2;">
                                <li>📱 Interactive digital menu powered by QR Code scanning</li>
                                <li>🛒 Real-time online order receiving with instant notifications</li>
                                <li>🛵 Live delivery tracking for every rider & order</li>
                                <li>📊 Detailed sales reports per item, per day, per category</li>
                                <li>🎨 Fully customizable menu with photos, prices & categories</li>
                            </ul>
                            <p style="margin-top:20px;">Log in now and elevate your restaurant's service.</p>
                        `,
                        ctaHref: metadata?.categorySpecificLink || 'https://qrx-menu.vercel.app',
                        ctaLabelAr: 'افتح نظام المطعم',
                        ctaLabelEn: 'Open Restaurant System',
                        footerName: appName,
                        extraImages: [
                            metadata?.categorySpecificImage || 'https://qrx-menu.vercel.app/1.PNG'
                        ]
                    });
                }

                // ══════════════════════════════════════
                //  WELCOME — DEFAULT
                // ══════════════════════════════════════
                return this._baseLayout({
                    accentColor: '#2563eb',
                    headerIcon: '🎉',
                    headerAr: 'أهلاً وسهلاً بك معنا!',
                    headerEn: 'Welcome Aboard!',
                    bodyAr: arHtml,
                    bodyEn: enHtml,
                    ctaHref: null,
                    ctaLabelAr: '',
                    ctaLabelEn: '',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  EXPIRY REMINDER — GYM / RESTAURANT / DEFAULT
            // ══════════════════════════════════════
            case 'expiry_reminder':
            case 'subscription_expiry': {
                const days = metadata?.daysUntilExpiry ?? '';
                const isGym = category === 'gym';
                const isRestaurant = category === 'restaurant';

                const accentColor = isGym ? '#c0392b' : isRestaurant ? '#b5451b' : '#e74c3c';
                const ctaHref    = isGym
                    ? 'https://gymcore-system.netlify.app'
                    : isRestaurant ? 'https://qrx-menu.vercel.app' : null;

                return this._baseLayout({
                    accentColor,
                    headerIcon: '⏰',
                    headerAr: 'تنبيه: اشتراكك على وشك الانتهاء!',
                    headerEn: 'Alert: Your Subscription is Expiring Soon!',
                    bodyAr: `
                        ${arHtml}
                        ${days ? `<p style="background:#fff3cd;border-right:4px solid #ffc107;padding:12px 16px;border-radius:6px;margin:16px 0;"><strong>⏳ متبقي على انتهاء الاشتراك: ${days} أيام فقط</strong></p>` : ''}
                        <p>لتجنب انقطاع الخدمة، يرجى تجديد اشتراكك في أقرب وقت ممكن.</p>
                        ${isGym ? '<p>🏋️ استمر في إدارة نادیك بدون أي انقطاع — جدد الآن!</p>' : ''}
                        ${isRestaurant ? '<p>🍽️ لا تدع انتهاء الاشتراك يؤثر على خدمة مطعمك — جدد الآن!</p>' : ''}
                    `,
                    bodyEn: `
                        ${enHtml}
                        ${days ? `<p style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px 16px;border-radius:6px;margin:16px 0;"><strong>⏳ Only ${days} day(s) remaining on your subscription</strong></p>` : ''}
                        <p>To avoid any service interruption, please renew your subscription as soon as possible.</p>
                        ${isGym ? '<p>🏋️ Keep managing your gym without interruption — renew now!</p>' : ''}
                        ${isRestaurant ? '<p>🍽️ Don\'t let expiry affect your restaurant — renew now!</p>' : ''}
                    `,
                    ctaHref,
                    ctaLabelAr: 'جدد اشتراكك الآن',
                    ctaLabelEn: 'Renew Now',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  PAYMENT REMINDER
            // ══════════════════════════════════════
            case 'payment_reminder': {
                const amount  = metadata?.amount ? `${metadata.amount}` : null;
                const dueDate = metadata?.dueDate ? new Date(metadata.dueDate).toLocaleDateString('ar-EG') : null;
                const isGym   = category === 'gym';
                const isRest  = category === 'restaurant';
                const ctaHref = isGym
                    ? 'https://gymcore-system.netlify.app'
                    : isRest ? 'https://qrx-menu.vercel.app' : null;

                return this._baseLayout({
                    accentColor: '#d97706',
                    headerIcon: '💳',
                    headerAr: 'تذكير: يوجد دفع معلق على حسابك',
                    headerEn: 'Reminder: You Have a Pending Payment',
                    bodyAr: `
                        ${arHtml}
                        ${amount  ? `<p style="background:#fef3c7;border-right:4px solid #f59e0b;padding:12px 16px;border-radius:6px;margin:12px 0;"><strong>💰 المبلغ المستحق: ${amount}</strong></p>` : ''}
                        ${dueDate ? `<p style="background:#fef3c7;border-right:4px solid #f59e0b;padding:12px 16px;border-radius:6px;margin:12px 0;"><strong>📅 تاريخ الاستحقاق: ${dueDate}</strong></p>` : ''}
                        <p>يرجى إتمام الدفع في أقرب وقت لتفادي تعليق الخدمة.</p>
                    `,
                    bodyEn: `
                        ${enHtml}
                        ${amount  ? `<p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:6px;margin:12px 0;text-align:left;direction:ltr;"><strong>💰 Amount Due: ${amount}</strong></p>` : ''}
                        ${dueDate ? `<p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:6px;margin:12px 0;text-align:left;direction:ltr;"><strong>📅 Due Date: ${dueDate}</strong></p>` : ''}
                        <p>Please complete your payment promptly to avoid service suspension.</p>
                    `,
                    ctaHref,
                    ctaLabelAr: 'أكمل الدفع الآن',
                    ctaLabelEn: 'Complete Payment Now',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  NEWSLETTER
            // ══════════════════════════════════════
            case 'newsletter': {
                return this._baseLayout({
                    accentColor: '#0f766e',
                    headerIcon: '📰',
                    headerAr: 'نشرتنا الشهرية — كل جديد في مكان واحد',
                    headerEn: 'Monthly Newsletter — All Updates in One Place',
                    bodyAr: `
                        <p>عزيزي العميل، إليك أحدث أخبارنا وتحديثاتنا لهذا الشهر:</p>
                        <div style="background:#f0fdf4;border-right:4px solid #0f766e;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${arHtml}
                        </div>
                        <p>نقدر ثقتك بنا ونسعى دائماً لتحسين خدمتنا.</p>
                    `,
                    bodyEn: `
                        <p>Dear customer, here are our latest news and updates for this month:</p>
                        <div style="background:#f0fdf4;border-left:4px solid #0f766e;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${enHtml}
                        </div>
                        <p>We appreciate your trust and always strive to improve our service.</p>
                    `,
                    ctaHref: null,
                    ctaLabelAr: '',
                    ctaLabelEn: '',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  ANNOUNCEMENT
            // ══════════════════════════════════════
            case 'announcement': {
                return this._baseLayout({
                    accentColor: '#dc2626',
                    headerIcon: '📢',
                    headerAr: 'إعلان هام — يرجى الاطلاع',
                    headerEn: 'Important Announcement — Please Read',
                    bodyAr: `
                        <p>عزيزي العميل، نود إحاطتك علماً بما يلي:</p>
                        <div style="background:#fef2f2;border-right:4px solid #dc2626;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${arHtml}
                        </div>
                        <p>شكراً لاهتمامك واستمرار ثقتك بنا.</p>
                    `,
                    bodyEn: `
                        <p>Dear customer, we'd like to inform you of the following:</p>
                        <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${enHtml}
                        </div>
                        <p>Thank you for your attention and continued trust.</p>
                    `,
                    ctaHref: null,
                    ctaLabelAr: '',
                    ctaLabelEn: '',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  SURVEY
            // ══════════════════════════════════════
            case 'survey': {
                return this._baseLayout({
                    accentColor: '#7c3aed',
                    headerIcon: '📝',
                    headerAr: 'رأيك يهمنا — شاركنا تجربتك!',
                    headerEn: 'Your Opinion Matters — Share Your Experience!',
                    bodyAr: `
                        <p>عزيزي العميل، نقدر وقتك ونسعد باستقبال ملاحظاتك.</p>
                        <div style="background:#f5f3ff;border-right:4px solid #7c3aed;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${arHtml}
                        </div>
                        <p>ملاحظاتك القيّمة تساعدنا على تطوير خدماتنا بشكل مستمر.</p>
                    `,
                    bodyEn: `
                        <p>Dear customer, we value your time and welcome your feedback.</p>
                        <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${enHtml}
                        </div>
                        <p>Your valuable feedback helps us continuously improve our services.</p>
                    `,
                    ctaHref: metadata?.surveyLink || null,
                    ctaLabelAr: 'أجب على الاستبيان',
                    ctaLabelEn: 'Take the Survey',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  INVITATION
            // ══════════════════════════════════════
            case 'invitation': {
                return this._baseLayout({
                    accentColor: '#059669',
                    headerIcon: '✉️',
                    headerAr: 'دعوة خاصة لك — لا تفوّتها!',
                    headerEn: 'A Special Invitation Just for You!',
                    bodyAr: `
                        <p>يشرفنا دعوتك للانضمام إلى هذا الحدث المميز.</p>
                        <div style="background:#f0fdf4;border-right:4px solid #059669;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${arHtml}
                        </div>
                        <p>نتطلع إلى لقائك وتشرّفنا بحضورك.</p>
                    `,
                    bodyEn: `
                        <p>We are honoured to invite you to this special event.</p>
                        <div style="background:#f0fdf4;border-left:4px solid #059669;padding:16px 20px;border-radius:6px;margin:16px 0;">
                            ${enHtml}
                        </div>
                        <p>We look forward to seeing you and are honoured by your presence.</p>
                    `,
                    ctaHref: metadata?.eventLink || null,
                    ctaLabelAr: 'تأكيد الحضور',
                    ctaLabelEn: 'RSVP Now',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  PROMOTION
            // ══════════════════════════════════════
            case 'promotion': {
                const discount = metadata?.discount || null;
                const isGym    = category === 'gym';
                const isRest   = category === 'restaurant';
                const ctaHref  = isGym
                    ? 'https://gymcore-system.netlify.app'
                    : isRest ? 'https://qrx-menu.vercel.app' : null;

                return this._baseLayout({
                    accentColor: '#16a34a',
                    headerIcon: '🎁',
                    headerAr: 'عرض حصري لا تفوّته!',
                    headerEn: 'Exclusive Offer — Don\'t Miss Out!',
                    bodyAr: `
                        ${discount ? `<p style="background:#dcfce7;border-right:4px solid #16a34a;padding:14px 18px;border-radius:8px;font-size:18px;font-weight:bold;margin:0 0 16px;text-align:center;">🔥 خصم ${discount} لفترة محدودة!</p>` : ''}
                        ${arHtml}
                        <p>سارع باستغلال هذا العرض قبل انتهائه!</p>
                    `,
                    bodyEn: `
                        ${discount ? `<p style="background:#dcfce7;border-left:4px solid #16a34a;padding:14px 18px;border-radius:8px;font-size:18px;font-weight:bold;margin:0 0 16px;text-align:center;">🔥 ${discount} OFF — Limited Time!</p>` : ''}
                        ${enHtml}
                        <p>Hurry and take advantage of this offer before it ends!</p>
                    `,
                    ctaHref,
                    ctaLabelAr: 'احصل على العرض الآن',
                    ctaLabelEn: 'Claim Offer Now',
                    footerName: appName,
                    extraImages: []
                });
            }

            // ══════════════════════════════════════
            //  CUSTOM / DEFAULT
            // ══════════════════════════════════════
            default: {
                return this._baseLayout({
                    accentColor: '#475569',
                    headerIcon: '📬',
                    headerAr: 'رسالة من فريقنا',
                    headerEn: 'A Message from Our Team',
                    bodyAr: arHtml,
                    bodyEn: enHtml,
                    ctaHref: null,
                    ctaLabelAr: '',
                    ctaLabelEn: '',
                    footerName: appName,
                    extraImages: []
                });
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  CAMPAIGN SERVICES (UNCHANGED LOGIC)
    // ─────────────────────────────────────────────────────────────

    static async createEmailCampaignService({ name, subject, template, content, targetAudience, customRecipients, scheduledFor, settings, createdBy, notes }) {
        const id = uuid();
        return await EmailCampaign.create({ id, name, subject, template, content, targetAudience, customRecipients, scheduledFor, settings, createdBy, notes });
    }

    static async getAllEmailCampaignsService() {
        return await EmailCampaign.find().sort({ createdAt: -1 });
    }

    static async getEmailCampaignByIdService(id) {
        return await EmailCampaign.findById(id);
    }

    static async updateEmailCampaignService(id, { name, subject, template, content, targetAudience, customRecipients, scheduledFor, status, settings, notes }) {
        const updateData = { name, subject, template, content, targetAudience, customRecipients, scheduledFor, status, settings, notes };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        return await EmailCampaign.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    }

    static async deleteEmailCampaignService(id) {
        return await EmailCampaign.findByIdAndDelete(id);
    }

    static async getTargetRecipientsService(campaign) {
        let recipients = [];
        switch (campaign.targetAudience) {
            case 'all':        recipients = await Customer.find({});                              break;
            case 'subscribed': recipients = await Customer.find({ status: 'subscribed' });        break;
            case 'expired':    recipients = await Customer.find({ status: 'expired' });           break;
            case 'interested': recipients = await Customer.find({ status: 'interested' });        break;
            case 'custom':     recipients = await Customer.find({ _id: { $in: campaign.customRecipients } }); break;
        }
        return recipients;
    }

    static async launchEmailCampaignService(campaignId) {
        const campaign = await EmailCampaign.findById(campaignId);
        if (!campaign) throw new Error('Campaign not found');

        const recipients = await this.getTargetRecipientsService(campaign);
        campaign.statistics.totalRecipients = recipients.length;
        campaign.status = 'active';
        campaign.sentAt = new Date();
        await campaign.save();

        const results = { sent: 0, failed: 0, errors: [] };

        for (const recipient of recipients) {
            try {
                // Use injectName helper to replace ALL {{name}} occurrences
                const personalizedContent = injectName(campaign.content, recipient.name);

                await this.sendEmail({
                    to: recipient.email,
                    subject: campaign.subject,
                    text: personalizedContent,
                    template: campaign.template,
                    // Pass recipient category so templates can render category-specific content
                    metadata: { category: recipient.category || 'default' }
                });

                await Notification.create({
                    customer: recipient._id,
                    type: 'custom',
                    title: campaign.subject,
                    message: campaign.content,
                    status: 'sent',
                    sentAt: new Date(),
                    channel: 'email',
                    isAutomated: false,
                    metadata: { campaignId: campaign._id }
                });

                results.sent++;
            } catch (error) {
                results.failed++;
                results.errors.push({ email: recipient.email, error: error.message });

                await Notification.create({
                    customer: recipient._id,
                    type: 'custom',
                    title: campaign.subject,
                    message: campaign.content,
                    status: 'failed',
                    channel: 'email',
                    isAutomated: false,
                    metadata: { campaignId: campaign._id, error: error.message }
                });
            }
        }

        campaign.statistics.sentCount   = results.sent;
        campaign.statistics.failedCount = results.failed;
        campaign.status = 'completed';
        await campaign.save();

        return results;
    }

    static async scheduleEmailCampaignService(campaignId, scheduledFor) {
        return await EmailCampaign.findByIdAndUpdate(
            campaignId,
            { status: 'scheduled', scheduledFor },
            { returnDocument: 'after' }
        );
    }

    //     // Reuse campaign (create a copy with draft status)
    static async reuseEmailCampaignService(campaignId) {
        const originalCampaign = await EmailCampaign.findById(campaignId);
        if (!originalCampaign) throw new Error('Campaign not found');

        // Create a new campaign with same content but draft status
        const newCampaign = await EmailCampaign.create({
            name: `${originalCampaign.name} (Copy)`,
            subject: originalCampaign.subject,
            template: originalCampaign.template,
            content: originalCampaign.content,
            targetAudience: originalCampaign.targetAudience,
            customRecipients: originalCampaign.customRecipients,
            settings: originalCampaign.settings,
            notes: originalCampaign.notes,
            status: 'draft',
            createdBy: originalCampaign.createdBy,
            statistics: {
                sentCount: 0,
                failedCount: 0,
                totalRecipients: 0
            }
        });

        return newCampaign;
    }

    static async getCampaignStatsService(campaignId) {
        const campaign = await EmailCampaign.findById(campaignId);
        if (!campaign) throw new Error('Campaign not found');

        const notifications = await Notification.find({ 'metadata.campaignId': campaignId });
        return {
            ...campaign.statistics,
            openedCount:    notifications.filter(n => n.status === 'delivered').length,
            deliveredCount: notifications.filter(n => n.status === 'sent').length
        };
    }

    static async testEmailCampaignService({ campaignId, testEmails }) {
        if (!campaignId || !testEmails || testEmails.length === 0)
            throw new Error("Campaign ID and test emails are required");

        const campaign = await this.getEmailCampaignByIdService(campaignId);
        if (!campaign) throw new Error("Campaign not found");

        const results = [];
        for (const email of testEmails) {
            if (email.trim()) {
                const result = await this.testEmailService({
                    to: email.trim(),
                    subject: campaign.subject,
                    content: campaign.content,
                    template: campaign.template
                });
                results.push({ email: email.trim(), result });
            }
        }
        return results;
    }

    static async testEmailService({ to, subject, content, template }) {
        try {
            const result = await this.sendEmail({ to, subject: `[TEST] ${subject}`, text: content, template });
            return { success: true, messageId: result.messageId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}