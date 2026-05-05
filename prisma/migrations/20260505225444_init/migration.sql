-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" REAL,
    "lng" REAL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "logoUrl" TEXT,
    "beansBalance" INTEGER NOT NULL DEFAULT 0,
    "rewardThreshold" INTEGER NOT NULL DEFAULT 10,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "deviceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WalletCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serialNumber" TEXT NOT NULL,
    "authToken" TEXT NOT NULL,
    "beansCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueCode" TEXT NOT NULL,
    "passTypeId" TEXT NOT NULL DEFAULT 'pass.com.isarbeans.loyalty',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "WalletCard_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WalletCard_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BeanApproval" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "beansAmount" INTEGER NOT NULL DEFAULT 1,
    "uniqueCode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "shopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "BeanApproval_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BeanApproval_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL,
    "beansPerDay" INTEGER NOT NULL,
    "priceEur" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "stripeSubId" TEXT,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" TEXT NOT NULL,
    CONSTRAINT "Subscription_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_email_key" ON "Shop"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_deviceId_key" ON "Customer"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletCard_serialNumber_key" ON "WalletCard"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WalletCard_uniqueCode_key" ON "WalletCard"("uniqueCode");

-- CreateIndex
CREATE UNIQUE INDEX "WalletCard_shopId_customerId_key" ON "WalletCard"("shopId", "customerId");
