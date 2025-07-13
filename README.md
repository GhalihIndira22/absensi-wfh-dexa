# Absensi WFH - Backend Setup Guide

## REQUIREMENT
1. Node JS
2. Kafka
3. Firebase

## Struktur Monorepo
absensi-wfh-dexa/
├── services/
│   ├── auth/           # Login, JWT, user context
│   ├── user/           # Profile data, update
│   ├── attendance/     # Absen masuk/pulang
│   ├── admin/          # HRD admin panel
│   ├── worker/         # Kafka consumer, log & FCM
├── firebase-service-account.json
├── .env
├── .env.example
└── package.json

## APPLICATION SETUP
1. git clone https://github.com/GhalihIndira22/absensi-wfh-dexa.git
2. cd absensi-wfh-dexa
3. npm install
4. cp .env.example .env

##  Jalankan Kafka dan PostgreSQL
1. Gunakan Docker Compose atau layanan lokal. Contoh docker-compose.yml:
```
version: '3.8'
services:
  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - "2181:2181"

  kafka:
    image: wurstmeister/kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: localhost
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper

  postgres:
    image: postgres:13
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```
2. Jalankan `docker-compose up -d` untuk memulai layanan.

## Jalankan tiap service secara paralel
```
npm run dev:auth
npm run dev:user
npm run dev:attendance
npm run dev:admin
npm run dev:worker
```

## Database 
1. Buat database di postgres bernama `absensi`
2. Jalankan migrasi dengan perintah:
```
npx prisma migrate dev
```
3. Untuk mengisi data awal, jalankan:
```
npm run seed
```