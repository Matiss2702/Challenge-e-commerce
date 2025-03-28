import Cgu from "@/domains/common/pages/Cgu.vue";
import PrivacyPolicy from "@/domains/common/pages/PrivacyPolicy.vue";
import LegalInfo from "@/domains/common/pages/LegalInfo.vue";

const cguRoutes = () => [
  {
    path: "/cgu",
    name: "cgu",
    component: Cgu,
  },
  {
    path: "/privacy-policy",
    name: "politique-de-confidentialite",
    component: PrivacyPolicy,
  },
  {
    path: "/legal-info",
    name: "informations-legales",
    component: LegalInfo,
  },
];

export default cguRoutes;
