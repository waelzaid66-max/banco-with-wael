# 90 — Agent Knowledge Extraction (memory → disk)

Everything this workstream still “knew” that must not stay only in chat memory.

## Identity

- Cloud agent historically on `cursor/production-wiring-messenger-maps-1e3d`  
- PR **#30** OPEN — waves 3–7 messenger/maps/notif  
- Sibling delivery/stabilize agents existed (e.g. #29) — use delivery ledger, don’t re-litigate Fixed IDs  
- Owner: Banco Boom — Arabic instructions; high trust / no fake screenshots  

## Commits / waves (this tip)

| Wave | Theme |
|------|-------|
| 1–2 | Merged via earlier PRs (#26 etc.): MSG chrome, map latch basics, notif role |
| 3 | Older pages, email path, import support ticket, web geo, edit pin, notif counts |
| 4 | Absorb vacated poll msgs, newest-id mark-read, media open, report+hide, receipts, label honesty |
| 5 | Near-bottom autoscroll, video picker, DeviceNotRegistered-only prune, hide copy thread |
| 6 | Scroll P1s, Leaflet inline, nearest sort, bridge guards |
| 7 | Inbox hide honesty, nearest gate, website thread parity, delivery ledger |

Latest wiring commit referenced: `a8e46d3`.

## Assumptions (explicit)

1. Chat remains HTTP poll (G47) until Owner says rewrite  
2. Soft-hide via deleteConversation endpoint is intentional naming debt  
3. OSM network dependency is acceptable (MAP-07b)  
4. Not inventing ban/mute tables  
5. Car-import Discover entry fixed in Wave 2 — MASTER-TRACKER wrong if it still says otherwise  
6. Guards > prose for regression prevention  

## Rejected implementations

| Idea | Why rejected |
|------|--------------|
| WebSocket in this wave | Product/G47 |
| Prune on InvalidCredentials | Would kill good tokens |
| Claim nearest without near-me | Honesty violation |
| Delete features to simplify inventory | Owner rule |
| Fake per-screen screenshots in handover | Owner rule |
| Hard delete conversations | Soft-hide only |

## Abandoned / interrupted

- Mid-edit inbox handleDelete→handleHide (completed wave 7)  
- PR #27 closed in favor of #30  
- Full live Expo visual pass (never available in this env)

## Unfinished investigations

- Whether StayCard overlay claim still accurate live  
- Whether banks awaiting-admin UI fully restored vs MASTER-TRACKER lost-feature claim  
- Whether profile `/me` vs Clerk bug still present at cited lines  
- Whether Saved→Search melt (audit item 23) still open  
- Whether Lead routing (item 22) still open  
- Prod migrate actually applied on Coolify (unknown from repo alone)

## Temporary fixes still in tree (intentional)

- Server nearest→recommended fallback (client gates; server soft)  
- Poll intervals 3s/8s/15s instead of WS  
- Auctions static cards  
- Calculator client-only math  
- Website thread without attach composer  

## Key file map

See delivery ledger “Key paths” + screen inventory. Critical:

- `artifacts/banco-mobile/app/messages/[id].tsx`  
- `artifacts/banco-mobile/app/(tabs)/messages.tsx`  
- `artifacts/banco-mobile/components/search/{FilterSheet,mapHtml,mapVendorInline,SectionSearchApp,BookingStaysApp}.tsx`  
- `artifacts/api-server/src/services/{ConversationService,PushService,SearchService,ImportOrderService}.ts`  
- `artifacts/banco-website/components/workspace/MessageThreadPanel.tsx`  
- Guards under `artifacts/banco-mobile/tests/*wiring*`, `notification-routing`, `import-order-documents`, `section-miniapp-guard`

## Hard rules to transfer

Materials-only · never erase filters · MiniAppBottomNav · `@/components/icons` · no vanity stats · no fake screenshots · complete wiring don’t delete · Hide≠Delete · nearest needs Near-me · poll≠WS.

## What successor should ask Owner

1. Priority: ops migrate vs visual sprint vs admin import UI vs MSG-05?  
2. Keep banco-web twin?  
3. Approve server hard-fail on nearest without coords?  
4. Ban/mute schema greenlight?  
5. Live auction vendor choice?
