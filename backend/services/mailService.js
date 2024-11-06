const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Vérification de la connexion SMTP
transporter.verify((error, success) => {
  if (error) {
    console.log('Erreur de connexion SMTP:', error);
  } else {
    console.log('Connexion SMTP réussie et prête pour l\'envoi d\'emails');
  }
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Votre Application" <${process.env.SMTP_USER}>`,
    to: to,
    subject: subject,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info);
    return info;
  } catch (error) {
    console.error('Échec de l\'envoi de l\'email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
