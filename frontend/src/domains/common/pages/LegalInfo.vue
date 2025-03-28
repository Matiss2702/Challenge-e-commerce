<template>
  <div class="max-w-4xl p-8 mx-auto font-sans text-gray-800 bg-white border shadow-lg rounded-xl border-amber-100">
    <!-- En-tête -->
    <div class="mb-10 text-center">
      <h1 class="mb-4 text-4xl font-bold text-amber-700">
        <span class="inline-block transform rotate-3">🍹</span>
        Conditions Générales de Vente
        <span class="inline-block transform -rotate-3">🌴</span>
      </h1>
      <div class="flex items-center justify-between px-4 mb-6">
        <div class="px-3 py-1 text-sm rounded-full text-amber-600 bg-amber-50">
          <span class="font-medium">Troupicool</span> - Vente de boissons tropicales
        </div>
        <div class="text-sm text-amber-500">Dernière mise à jour : 15 Juillet 2024</div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="space-y-8">
      <!-- Section Entreprise -->
      <section class="p-6 border-l-4 rounded-lg bg-amber-50 border-amber-400">
        <h2 class="flex items-center mb-4 text-2xl font-semibold text-amber-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Troupicool
        </h2>
        <div class="grid gap-4 mt-4 md:grid-cols-2">
          <div class="p-4 bg-white rounded-lg shadow-sm">
            <h3 class="mb-2 font-medium text-amber-700">Coordonnées</h3>
            <ul class="space-y-2 text-amber-800">
              <li class="flex items-start">
                <span class="mr-2">🏢</span>
                <span>242 Rue du Faubourg Saint-Antoine, Paris</span>
              </li>
              <li class="flex items-start">
                <span class="mr-2">✉️</span>
                <a href="mailto:team.troupicool@outlook.fr" class="text-amber-600 hover:underline"
                  >team.troupicool@outlook.fr</a
                >
              </li>
              <li class="flex items-start">
                <span class="mr-2">📋</span>
                <span>N° SIRET : [Votre numéro SIRET]</span>
              </li>
            </ul>
          </div>
          <div class="p-4 bg-white rounded-lg shadow-sm">
            <h3 class="mb-2 font-medium text-amber-700">Représentant</h3>
            <div class="flex items-center text-amber-800">
              <span class="mr-2">👨‍💼</span>
              <span>Yvars Clement</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Articles des CGV -->
      <section
        v-for="(article, index) in articles"
        :key="index"
        class="p-6 border-l-4 rounded-lg bg-amber-50 border-amber-400"
      >
        <h2 class="flex items-center mb-4 text-2xl font-semibold text-amber-700">
          <span class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-amber-100 text-amber-700">
            {{ index + 1 }}
          </span>
          {{ article.title }}
        </h2>
        <div class="pl-2 space-y-3">
          <div v-for="(point, pointIndex) in article.points" :key="pointIndex" class="flex text-amber-800">
            <span class="mr-2 font-medium text-amber-600">
              {{ article.numbering ? `${index + 1}.${pointIndex + 1}` : "•" }}
            </span>
            <p>{{ point }}</p>
          </div>
        </div>
      </section>

      <!-- Signature -->
      <section class="p-6 border-l-4 rounded-lg bg-amber-50 border-amber-400">
        <div class="flex flex-col items-center justify-between md:flex-row">
          <div class="mb-4 md:mb-0">
            <div class="font-medium text-amber-700">Fait à PARIS, le Mardi 9 Juillet 2024</div>
            <div class="text-sm text-amber-600">Modification faite le 15 Juillet 2024</div>
          </div>
          <div class="flex space-x-3">
            <button
              @click="printCGV"
              class="flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-amber-600 hover:bg-amber-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Imprimer
            </button>
            <a
              href="mailto:team.troupicool@outlook.fr"
              class="flex items-center px-4 py-2 transition-colors border rounded-lg text-amber-600 border-amber-600 hover:bg-amber-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const articles = [
  {
    title: "Objet",
    numbering: false,
    points: [
      "Les présentes CGV ont pour objet de définir les modalités et conditions de vente des boissons alcoolisées commercialisées par Troupicool.",
    ],
  },
  {
    title: "Commande",
    numbering: true,
    points: [
      "Le client passe commande via le site web de Troupicool.",
      "Toute commande implique l'acceptation sans réserve par le client des présentes conditions générales de vente.",
    ],
  },
  {
    title: "Prix",
    numbering: true,
    points: [
      "Les prix des produits sont indiqués en euros, toutes taxes comprises.",
      "Troupicool se réserve le droit de modifier les prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
    ],
  },
  {
    title: "Paiement",
    numbering: true,
    points: [
      "Le paiement s'effectue par carte bancaire via une plateforme sécurisée.",
      "La commande sera considérée comme effective après confirmation de l'accord des centres de paiement bancaire.",
    ],
  },
  {
    title: "Livraison",
    numbering: true,
    points: [
      "Les produits sont livrés à l'adresse indiquée par le client lors de la commande.",
      "Les délais de livraison sont donnés à titre indicatif et Troupicool ne pourra être tenue responsable en cas de retard de livraison.",
    ],
  },
  {
    title: "Vérification de l'âge",
    numbering: true,
    points: [
      "En vertu de la législation française, la vente d'alcool est interdite aux mineurs de moins de 18 ans.",
      "Troupicool met en place un système de vérification de l'âge lors de la commande et se réserve le droit de refuser la vente en cas de doute sur l'âge du client.",
    ],
  },
  {
    title: "Rétractation",
    numbering: true,
    points: [
      "Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.",
      "Les produits doivent être retournés dans leur emballage d'origine et en parfait état.",
    ],
  },
  {
    title: "Responsabilité",
    numbering: true,
    points: [
      "Troupicool ne saurait être tenue pour responsable des dommages résultant d'une mauvaise utilisation des produits vendus.",
      "Troupicool encourage la consommation responsable d'alcool et fournit des informations à ce sujet sur son site.",
    ],
  },
  {
    title: "Litiges",
    numbering: true,
    points: [
      "En cas de litige, les parties s'efforceront de trouver une solution amiable.",
      "À défaut, le litige sera soumis aux tribunaux compétents de Paris, en France.",
    ],
  },
  {
    title: "Acceptation des Conditions Générales de Vente",
    numbering: false,
    points: [
      "Le client reconnaît avoir pris connaissance des présentes conditions générales de vente et les accepte sans réserve.",
    ],
  },
];

const printCGV = () => {
  window.print();
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

body {
  @apply bg-amber-50 font-sans;
}

/* Transition douce pour les interactions */
button,
a {
  @apply transition-colors duration-200;
}

/* Style pour l'impression */
@media print {
  body {
    background: white !important;
  }
  .container {
    background: white !important;
    border: none !important;
    box-shadow: none !important;
  }
  button {
    display: none !important;
  }
  .no-print {
    display: none !important;
  }
}
</style>
