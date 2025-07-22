// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     // Parse JSON request body
//     const { recipientEmail, fileUrl } = await req.json();

//     if (!recipientEmail || !fileUrl) {
//       return new Response(JSON.stringify({ error: "Missing email or file URL" }), { status: 400 });
//     }

//     console.log("Sending email to:", recipientEmail, "with file URL:", fileUrl);

//     // Create a transporter using Gmail SMTP
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Your Gmail
//         pass: process.env.EMAIL_PASS, // Your Gmail App Password (use App Passwords, not normal password)
//       },
//     });

//     // Email content
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: recipientEmail,
//       subject: "Shared File Link",
//       html: `<p>Hello,</p>
//              <p>You have received a shared file. Click the link below to download:</p>
//              <a href="${fileUrl}" target="_blank">${fileUrl}</a>`,
//     };

//     // Send email
//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent:", info);

//     return new Response(JSON.stringify({ message: "Email sent successfully", info }), { status: 200 });

//   } catch (error) {
//     console.error("Email send error:", error);
//     return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500 });
//   }
// }

import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { recipientEmail, fileUrl, password, id } = await req.json();

    if (!recipientEmail || !fileUrl || !id || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    console.log("Sending email to:", recipientEmail, "with file URL:", fileUrl, "and password:", password);

    // ✅ Update the password in the Supabase doc table
    const { error: updateError } = await supabase
      .from("doc")
      .update({ password })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update password" }),
        { status: 500 }
      );
    }

    // ✅ Generate the correct access URL (Replace `/file/` with `/access/`)
    const accessUrl = `https://sharefile-three.vercel.app/access/${id}`;

    // ✅ Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: "SHARE FILE <process.env.EMAIL_USER>",
      to: recipientEmail,
      subject: "Secure File Shared with You",
      html: `
        <p>Hello,</p>
        <p>You have received a secure file. Click the link below to open it:</p>
        <p><a href="${accessUrl}" target="_blank">${accessUrl}</a></p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please keep this password safe and do not share it with others.</p>
      `,
    };

    // ✅ Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info);

    return new Response(JSON.stringify({ message: "Email sent successfully" }), { status: 200 });

  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      { status: 500 }
    );
  }
}
