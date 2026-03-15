# Email Setup: craigmcmillan@deluxepower.org via iCloud Custom Domain

This documents the Cloudflare DNS configuration required to use iCloud Custom Email Domain for `deluxepower.org`.

## Prerequisites

- Active **iCloud+** subscription (any paid tier)
- Domain `deluxepower.org` already on Cloudflare
- iCloud account you want to link the domain to

---

## Step 1 — Start the iCloud Custom Domain wizard

1. Go to [icloud.com](https://icloud.com) → sign in → **Account Settings** (top-right avatar)
2. Under **Custom Email Domain**, click **Add a Domain**
3. Enter `deluxepower.org` and follow the prompts
4. Choose **Use with iCloud Mail** and add `craigmcmillan` as the address
5. Apple will display the DNS records to add — keep this page open while doing Step 2

Alternatively on iPhone/iPad: **Settings → [your name] → iCloud → Custom Email Domain → Add Domain**

---

## Step 2 — Add DNS records in Cloudflare

Log into [dash.cloudflare.com](https://dash.cloudflare.com) → select `deluxepower.org` → **DNS → Records**

### MX Records (mail routing to Apple)

| Type | Name | Mail server | Priority |
|------|------|-------------|----------|
| MX | `@` | `mx01.mail.icloud.com` | 10 |
| MX | `@` | `mx02.mail.icloud.com` | 20 |

> **Important:** If any existing MX records are present (e.g. from Cloudflare Email Routing), delete them first.

### TXT Record — Domain Verification

Apple provides a unique verification token. Add it exactly as shown in the iCloud wizard:

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `apple-domain=XXXXXXXXXXXXXXXX` ← paste your token from Apple |

### TXT Record — SPF (allows Apple to send on your behalf)

| Type | Name | Value |
|------|------|-------|
| TXT | `@` | `v=spf1 include:icloud.com ~all` |

> If you already have an SPF record (e.g. `v=spf1 ... ~all`), add `include:icloud.com` to it rather than creating a second TXT record. Multiple SPF records will cause failures.

### CNAME Record — DKIM (email signing)

| Type | Name | Value |
|------|------|-------|
| CNAME | `sig1._domainkey` | `sig1.dkim.icloud.com` |

> Make sure the **Proxy status** for this CNAME is set to **DNS only** (grey cloud), not proxied.

---

## Step 3 — Verify in iCloud

Go back to the iCloud Custom Domain wizard and click **Verify**. DNS propagation can take a few minutes up to 48 hours, but typically completes within 5–15 minutes with Cloudflare.

Once verified, iCloud will confirm the domain and your `craigmcmillan@deluxepower.org` address will be active for send and receive in iCloud Mail.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Verification keeps failing | Check the TXT record value is exact, no extra spaces |
| Emails not arriving | Confirm old MX records were removed; Cloudflare proxy is OFF for CNAME |
| Can't send from custom address | SPF record missing or malformed |
| DKIM errors in email headers | Ensure `sig1._domainkey` CNAME is DNS-only (not proxied) |

---

## Summary of all DNS records

```
deluxepower.org.          MX    10  mx01.mail.icloud.com
deluxepower.org.          MX    20  mx02.mail.icloud.com
deluxepower.org.          TXT       "apple-domain=XXXXXXXXXXXXXXXX"
deluxepower.org.          TXT       "v=spf1 include:icloud.com ~all"
sig1._domainkey           CNAME     sig1.dkim.icloud.com
```
