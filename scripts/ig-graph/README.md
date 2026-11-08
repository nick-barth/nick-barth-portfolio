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

## Instagram lookups (optional, needs META_ACCESS_TOKEN + IG_USER_ID in .env)

- `bun scripts/ig-graph/enrich.ts [--mentions]` — profiles (bio, followers, posts, last post) into enrich.json
- `bun scripts/ig-graph/mentions.ts [--core]` — recent posts into posts.json, caption mentions into mentions.json
- embeds.json — per venue, a recent post whose embed actually renders (checked with a headless
  browser; `null` means the account has embedding turned off)

enrich.json, posts.json and mentions.json stay local (gitignored): they include people's handles.
