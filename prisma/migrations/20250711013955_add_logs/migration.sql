-- CreateTable
CREATE TABLE "ProfileChangeLog" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "changeType" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileChangeLog_pkey" PRIMARY KEY ("id")
);
