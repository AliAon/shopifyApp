// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });



  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});


app.get('/api/get-access-token', async (_req, res) => {
  res.status(200).send({ accessToken: res.locals.shopify.session.accessToken }); 
});

// GET API for Shopify Shop Information
app.get('/api/shop', async (_req, res) => {
  try {
    const session = res.locals.shopify.session;

    if (!session || !session.accessToken || !session.shop) {
      return res.status(401).json({ error: 'Shopify session is missing or invalid' });
    }

    // Fetch shop information using Shopify REST client
    const shopData = await shopify.api.rest.Shop.all({
      session: session,
    });

    res.status(200).json(shopData);
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ error: 'Failed to fetch shop information' });
  }
});


app.get('/api/get-current-user', async (_req, res) => {
  try {
    const session = res.locals.shopify.session;
    if (!session || !session.accessToken || !session.shop) {
      return res.status(401).json({ error: 'Shopify session is missing or invalid' });
    }

    // Fetch user information using Shopify REST client
    const userData=await shopify.api.rest.User.all({
      session: session,
    })

    res.status(200).json(userData);

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});


app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;
  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
