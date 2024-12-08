require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Erreur de connexion SMTP:", error);
  } else {
    console.log("Connexion SMTP réussie et prête pour l'envoi d'emails");
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Votre Application" <matiss.haillouy@gmail.com>`,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès:", info);
    return info;
  } catch (error) {
    console.error("Échec de l'envoi de l'email:", error);
    if (error.response) {
      console.error(`Réponse du serveur SMTP: ${error.response}`);
    }
    throw error;
  }
};

module.exports = {
  sendEmail,
};
