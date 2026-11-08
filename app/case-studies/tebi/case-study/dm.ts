/*
 * First-DM template, shared by the message card (server) and the venue detail card (client).
 * Kept out of venue-graph.tsx because client modules can't be called from the server.
 */

type Lead = { name: string; popup?: boolean; openingSoon?: boolean };

/**
 * First DM, by kind of lead: upbeat, naming the Tebi venue they're connected to. Part-time
 * venues get the benefit that matters to them (subscription scales with revenue, €0 under
 * €10K a month per Tebi's own calculator; card fees still apply, hence "abonnement").
 */
export function suggestedDm(v: Lead, via: string | undefined) {
  const proof = via ? ` ${via} draait al op Tebi.` : "";
  if (v.popup) return `${v.name} ziet er klaar voor uit. Zullen we je kassa regelen?${proof} Geen contract, gewoon je iPad. Let's go?`;
  if (v.openingSoon) return `${v.name} gaat bijna open. Zullen we je kassa regelen?${proof} Geen contract, gewoon je iPad. Let's go?`;
  return `Hey ${v.name}, zullen we je kassa regelen?${proof} Rustige maand? Dan €0 abonnement. Let's go?`;
}

/** English translation of suggestedDm, for the case study page. */
export function suggestedDmEn(v: Lead, via: string | undefined) {
  const proof = via ? ` ${via} already runs on Tebi.` : "";
  if (v.popup) return `${v.name} looks ready. Shall we sort out your POS?${proof} No contract, just your iPad. Let's go?`;
  if (v.openingSoon) return `${v.name} is almost open. Shall we sort out your POS?${proof} No contract, just your iPad. Let's go?`;
  return `Hey ${v.name}, shall we sort out your POS?${proof} Quiet month? Then it's a €0 subscription. Let's go?`;
}
