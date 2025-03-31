require("dotenv").config();
const { sendEmail } = require("./mailService");
const { User } = require("../models/postgres");

const sendRestockAlerts = async (product) => {
  try {
    const storeKeepers = await User.findAll({
      where: { role: "ROLE_STORE_KEEPER" },
    });

    if (!storeKeepers.length) {
      console.log("Aucun utilisateur avec le rôle ROLE_STORE_KEEPER trouvé.");
      return;
    }

    const emails = storeKeepers.map((user) => user.email).join(",");

    const subject = `Stock faible pour le produit ${product.name}`;
    const htmlContent = `
      <p>Bonjour,</p>
      <p>Le produit <strong>${product.name}</strong> a un stock faible (${product.stock} unités restantes).</p>
      <p>Merci de réapprovisionner ce produit dans les plus brefs délais.</p>
    `;

    await sendEmail(emails, subject, htmlContent);
    console.log("Alertes de réapprovisionnement envoyées aux magasiniers.");
  } catch (error) {
    console.error("Erreur lors de l'envoi des notifications de réapprovisionnement par email:", error);
  }
};

module.exports = {
  sendRestockAlerts,
};
