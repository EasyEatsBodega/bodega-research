import { Resend } from "resend";

// Lazy initialize Resend client to avoid build-time errors when API key is not set
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface LeadNotificationData {
  name: string;
  email: string;
  projectLink?: string;
  telegramUsername?: string;
  preferredContact?: string;
  preferredContactOther?: string;
  message?: string;
}

export async function sendLeadNotification(lead: LeadNotificationData) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not configured, skipping notification");
    return null;
  }

  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not configured, skipping notification");
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Bodega Research <notifications@resend.dev>", // Use your verified domain in production
      to: adminEmail,
      subject: `New Review Inquiry: ${lead.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Courier New', monospace; background-color: #0A0A0A; color: #FAFAFA; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #141414; border: 1px solid #262626; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(90deg, #F0A202, #F18805); padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #0A0A0A; font-size: 18px; letter-spacing: 2px;">BODEGA RESEARCH</h1>
              <p style="margin: 5px 0 0; color: #0A0A0A; font-size: 12px;">NEW REVIEW INQUIRY</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <div style="margin-bottom: 20px;">
                <p style="color: #A3A3A3; font-size: 10px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 1px;">From</p>
                <p style="color: #FAFAFA; font-size: 16px; margin: 0; font-weight: bold;">${lead.name}</p>
              </div>

              <div style="margin-bottom: 20px;">
                <p style="color: #A3A3A3; font-size: 10px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
                <a href="mailto:${lead.email}" style="color: #F0A202; font-size: 14px; text-decoration: none;">${lead.email}</a>
              </div>

              ${
                lead.telegramUsername
                  ? `
              <div style="margin-bottom: 20px;">
                <p style="color: #A3A3A3; font-size: 10px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 1px;">Telegram</p>
                <p style="color: #FAFAFA; font-size: 14px; margin: 0;">${lead.telegramUsername}</p>
              </div>
              `
                  : ""
              }

              <div style="margin-bottom: 20px;">
                <p style="color: #A3A3A3; font-size: 10px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 1px;">Preferred Contact</p>
                <p style="color: #FAFAFA; font-size: 14px; margin: 0;">${
                  lead.preferredContact === "other"
                    ? lead.preferredContactOther || "Other"
                    : lead.preferredContact === "x_dms"
                      ? "X DMs"
                      : lead.preferredContact === "telegram"
                        ? "Telegram"
                        : "Email"
                }</p>
              </div>

              ${
                lead.projectLink
                  ? `
              <div style="margin-bottom: 20px;">
                <p style="color: #A3A3A3; font-size: 10px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 1px;">Project Link</p>
                <a href="${lead.projectLink}" style="color: #F0A202; font-size: 14px; text-decoration: none; word-break: break-all;">${lead.projectLink}</a>
              </div>
              `
                  : ""
              }

              ${
                lead.message
                  ? `
              <div style="margin-bottom: 20px;">
                <p style="color: #A3A3A3; font-size: 10px; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                <p style="color: #FAFAFA; font-size: 14px; margin: 0; line-height: 1.6; background-color: #1A1A1A; padding: 15px; border-radius: 8px; border-left: 3px solid #F0A202;">${lead.message}</p>
              </div>
              `
                  : ""
              }

              <!-- CTA -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${lead.email}" style="display: inline-block; background-color: #F0A202; color: #0A0A0A; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 1px; border-radius: 8px; text-transform: uppercase;">REPLY TO LEAD</a>
              </div>
            </div>

            <!-- Footer -->
            <div style="padding: 20px; text-align: center; border-top: 1px solid #262626;">
              <p style="color: #666; font-size: 10px; margin: 0;">This is an automated notification from Bodega Research POS</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Review Inquiry at Bodega Research

From: ${lead.name}
Email: ${lead.email}
${lead.telegramUsername ? `Telegram: ${lead.telegramUsername}` : ""}
Preferred Contact: ${
        lead.preferredContact === "other"
          ? lead.preferredContactOther || "Other"
          : lead.preferredContact === "x_dms"
            ? "X DMs"
            : lead.preferredContact === "telegram"
              ? "Telegram"
              : "Email"
      }
${lead.projectLink ? `Project Link: ${lead.projectLink}` : ""}
${lead.message ? `Message: ${lead.message}` : ""}

Reply to this lead at ${lead.email}
      `.trim(),
    });

    if (error) {
      console.error("Failed to send notification:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    return null;
  }
}
