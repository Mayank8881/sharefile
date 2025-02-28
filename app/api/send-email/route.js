import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // Parse JSON request body
    const { recipientEmail, fileUrl } = await req.json();

    if (!recipientEmail || !fileUrl) {
      return new Response(JSON.stringify({ error: "Missing email or file URL" }), { status: 400 });
    }

    console.log("Sending email to:", recipientEmail, "with file URL:", fileUrl);

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // Your Gmail App Password (use App Passwords, not normal password)
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Shared File Link",
      html: `<p>Hello,</p>
             <p>You have received a shared file. Click the link below to download:</p>
             <a href="${fileUrl}" target="_blank">${fileUrl}</a>`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info);

    return new Response(JSON.stringify({ message: "Email sent successfully", info }), { status: 200 });

  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
  }
}
