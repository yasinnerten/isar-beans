// Utility helpers for Apple Wallet pass generation
// Full pass generation requires valid Apple certificates (WWDR, pass cert, private key).
// When the required env vars are present, real .pkpass files are generated.
// Otherwise we return a mock pass JSON for development/demo purposes.

export interface PassData {
  serialNumber: string;
  authToken: string;
  shopName: string;
  beansCount: number;
  rewardThreshold: number;
  uniqueCode: string;
  passTypeId?: string;
  customerId: string;
}

export function buildPassJson(data: PassData): object {
  const pct = Math.min(100, Math.round((data.beansCount / data.rewardThreshold) * 100));
  return {
    formatVersion: 1,
    passTypeIdentifier: data.passTypeId || "pass.com.isarbeans.loyalty",
    serialNumber: data.serialNumber,
    teamIdentifier: process.env.APPLE_TEAM_IDENTIFIER || "ISARBEANS",
    organizationName: "Isar Beans",
    description: `${data.shopName} Loyalty Card`,
    backgroundColor: "rgb(92,51,23)",
    foregroundColor: "rgb(255,222,173)",
    labelColor: "rgb(255,200,120)",
    logoText: "Isar Beans",
    authenticationToken: data.authToken,
    webServiceURL: process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api/wallet`
      : "https://isarbeans.com/api/wallet",
    storeCard: {
      primaryFields: [
        {
          key: "beans",
          label: "Beans Collected",
          value: `${data.beansCount} / ${data.rewardThreshold}`,
        },
      ],
      secondaryFields: [
        {
          key: "shop",
          label: "Coffee Shop",
          value: data.shopName,
        },
      ],
      auxiliaryFields: [
        {
          key: "progress",
          label: "Progress",
          value: `${pct}%`,
        },
        {
          key: "code",
          label: "Your Code",
          value: data.uniqueCode,
        },
      ],
      backFields: [
        {
          key: "instructions",
          label: "How to use",
          value:
            "Show the barista your unique code. They will scan it and add a bean to your card. Collect enough beans for a free coffee!",
        },
        {
          key: "uniqueCode",
          label: "Unique Code",
          value: data.uniqueCode,
        },
      ],
    },
    barcode: {
      message: data.uniqueCode,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    },
    barcodes: [
      {
        message: data.uniqueCode,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1",
      },
    ],
  };
}

const COFFEE_WORDS = [
  "espresso", "lungo", "ristretto", "macchiato", "cortado",
  "flat", "white", "latte", "cappuccino", "mocha",
  "arabica", "robusta", "crema", "barista", "doppio",
];

export function generateUniqueCode(): string {
  const word1 = COFFEE_WORDS[Math.floor(Math.random() * COFFEE_WORDS.length)];
  const word2 = COFFEE_WORDS[Math.floor(Math.random() * COFFEE_WORDS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${word1}-${word2}-${num}`;
}

export async function generatePassBuffer(data: PassData): Promise<Buffer | null> {
  const hasAppleCerts =
    process.env.APPLE_WWDR_CERT &&
    process.env.APPLE_PASS_CERT &&
    process.env.APPLE_PASS_KEY;

  if (!hasAppleCerts) {
    // Return pass JSON as buffer for demo purposes
    return Buffer.from(JSON.stringify(buildPassJson(data), null, 2));
  }

  try {
    const { PKPass } = await import("passkit-generator");
    const wwdr = Buffer.from(process.env.APPLE_WWDR_CERT!, "base64");
    const signerCert = Buffer.from(process.env.APPLE_PASS_CERT!, "base64");
    const signerKey = Buffer.from(process.env.APPLE_PASS_KEY!, "base64");

    const pass = new PKPass(
      {},
      {
        wwdr,
        signerCert,
        signerKey,
        signerKeyPassphrase: process.env.APPLE_PASS_KEY_PASSPHRASE,
      },
      buildPassJson(data) as Record<string, unknown>
    );

    return pass.getAsBuffer();
  } catch (err) {
    console.error("Apple Wallet pass generation failed:", err);
    return null;
  }
}
