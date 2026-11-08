# Instagram venue graph (manual)

Who follows Amsterdam's "cool" venues, to find new venues to message.

1. **seeds.csv** — fill in the Instagram handle of each seed venue (no @). Add or remove seeds freely.
2. **followers.csv** — open each seed's followers and add one row per **venue** account you find:
   - `seed_handle`: the seed
   - `relation`: `follower` (they follow the seed) or `following` (the seed follows them)
   - `follower_handle`, `venue_name`
   - `type`: restaurant / bar / cafe / bakery / wine bar / other
   - `neighbourhood`: if the bio or posts say
   - `opening_soon`: `yes` if the bio says "binnenkort open" / "opening soon", or it's clearly brand new
   - `posts`: post count on the profile
   - `notes`: anything useful
   Skip personal accounts. A venue following three seeds gets three rows.
3. Run `bun scripts/ig-graph/build.ts` — writes the graph and ranked target list for the case study page.
