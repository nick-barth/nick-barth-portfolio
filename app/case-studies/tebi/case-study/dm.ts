/*
 * First-DM template, shared by the message card (server) and the venue detail card (client).
 * Kept out of venue-graph.tsx because client modules can't be called from the server.
 */

type Lead = { name: string; popup?: boolean; openingSoon?: boolean };

/**
 * First DM, by kind of lead, in Tebi's own voice (tebi.com/nl): informal "je", short lines
 * ending in full stops, no exclamation marks, calm rather than pushy. Pricing claims use
 * Tebi's own lines ("Betaal alleen voor wat je verdient", "Geen contracten"). The Tebi venue
 * they're connected to is the proof, and the ask is a light one.
 */
export function suggestedDm(v: Lead, via: string | undefined) {
  const proof = via ? ` ${via} draait er al op.` : "";
  if (v.popup)
    return `Hoi ${v.name}, mooie pop-up. Tebi is je kassa en pin in één, zonder contract.${proof} Je betaalt alleen voor wat je verdient, ook als je maar een paar maanden open bent. Zin om te kijken of het bij je flow past?`;
  if (v.openingSoon)
    return `Hoi ${v.name}, gefeliciteerd met de opening binnenkort. Nog geen kassa gekozen? Tebi doet kassa, pin en keuken in één systeem.${proof} Geen contracten. Geen licentiekosten. Zin in een korte demo?`;
  return `Hoi ${v.name}. Tebi is kassa en pin in één, en je betaalt alleen voor wat je verdient.${proof} Rustige maand, lage kosten. Zin om te kijken of het bij je past?`;
}

/** English translation of suggestedDm, for the case study page. */
export function suggestedDmEn(v: Lead, via: string | undefined) {
  const proof = via ? ` ${via} already runs on it.` : "";
  if (v.popup)
    return `Hi ${v.name}, lovely pop-up. Tebi is your POS and card payments in one, no contract.${proof} You only pay for what you earn, even if you're only open a few months. Fancy seeing if it fits your flow?`;
  if (v.openingSoon)
    return `Hi ${v.name}, congrats on opening soon. Picked a POS yet? Tebi does POS, payments and kitchen in one system.${proof} No contracts. No licence fees. Up for a quick demo?`;
  return `Hi ${v.name}. Tebi is POS and card payments in one, and you only pay for what you earn.${proof} Quiet month, low costs. Fancy seeing if it fits?`;
}
