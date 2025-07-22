Here’s a complete **README.md** for your **Next + Convex + Convex Auth** template:

---

# Next + Convex + Convex Auth

A starter template for building **Next.js** applications with **Convex** and **Convex Auth** integration.

---

## Features

* ✅ Next.js Framework
* ✅ Convex Backend Integration
* ✅ OAuth with Google via Convex Auth
* ✅ JWT & JWKS configuration for secure authentication

---

## Getting Started

### 1. Create Google OAuth Credentials

First, set up **Google OAuth** in the **Google Cloud Console**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create OAuth credentials for **Web Application**.
3. Note the **Client ID** and **Client Secret**.

### 2. Set Convex Environment Variables

Set the following environment variables in your **Convex dashboard** or via the **CLI**.

| Variable             | Value from Google Cloud Console |
| -------------------- | ------------------------------- |
| `AUTH_GOOGLE_ID`     | OAuth **Client ID**             |
| `AUTH_GOOGLE_SECRET` | OAuth **Client Secret**         |

#### Setting via Convex Dashboard

Navigate to your project in the [Convex dashboard](https://dashboard.convex.dev/), then:

> **Project Settings > Environment Variables**

Add:

```
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

#### Setting via Convex CLI

```bash
npx convex env set AUTH_GOOGLE_ID your-google-client-id
npx convex env set AUTH_GOOGLE_SECRET your-google-client-secret
```

---

### 3. Generate JWT Private Key & JWKS

You need to generate the **JWT\_PRIVATE\_KEY** and **JWKS** to secure token signing:

#### a. Install dependencies:

```bash
npm install jose
```

#### b. Create a file `generateKey.mjs` and paste the following code:

```js
import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });

const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

process.stdout.write(
  `JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"\n`
);
process.stdout.write(`JWKS=${jwks}\n`);
```

#### c. Run the generator:

```bash
node generateKey.mjs
```

This will output:

```
JWT_PRIVATE_KEY="..."
JWKS=...
```

#### d. Apply to Convex Environment

##### Via Dashboard

Copy both values and add them via:

> **Project Settings > Environment Variables**

##### Via CLI

```bash
npx convex env set JWT_PRIVATE_KEY "your-generated-private-key"
npx convex env set JWKS 'your-generated-jwks'
```

---

## 4. Run the Application

Once the environment is configured, start the Next.js app:

```bash
npm run dev
```

---
