import { BOT_URL, SUPPORT_URL } from "@shared/constants";

import { type PublicVenue } from "./catalog";

const organization = (siteUrl: string) => ({
  "@type": "Organization",
  name: "KuttukTime",
  url: `${siteUrl}/`
});

export const organizationLd = (siteUrl: string, description: string) => ({
  "@context": "https://schema.org",
  ...organization(siteUrl),
  logo: `${siteUrl}/logo.png`,
  description,
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: SUPPORT_URL },
  sameAs: [BOT_URL]
});

// Questions and answers as search engines and AI answers read them.
export const faqLd = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer }
  }))
});

// The venue and the certificates on sale for it - one Offer per nominal,
// sold by KuttukTime (not by the venue itself).
export const venueLd = (
  venue: PublicVenue,
  { url, description, offerName }: { url: string; description: string; offerName: (nominal: number) => string },
  siteUrl: string
) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: venue.name,
  description,
  image: venue.logo,
  url,
  address: { "@type": "PostalAddress", streetAddress: venue.address, addressCountry: "KG" },
  hasMap: venue.mapUrl,
  makesOffer: venue.nominals.map((nominal) => ({
    "@type": "Offer",
    name: offerName(nominal),
    price: nominal,
    priceCurrency: "KGS",
    availability: "https://schema.org/InStock",
    url,
    seller: organization(siteUrl)
  }))
});
