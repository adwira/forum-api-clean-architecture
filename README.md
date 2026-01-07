# Forum API - Backend Expert Project

[![Continuous Integration](https://github.com/adwira/forum-api/actions/workflows/ci.yml/badge.svg)](https://github.com/adwira/forum-api/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Repository ini merupakan proyek submission untuk course **"Menjadi Back-End Developer Expert dengan JavaScript"** dari Dicoding.

## 🚀 Fitur Utama
- **Clean Architecture**: Pemisahan layer (Entities, Use Cases, Repositories, dan Interfaces) untuk kode yang modular dan mudah diuji.
- **Test-Driven Development (TDD)**: Seluruh fitur dikembangkan dengan pendekatan TDD menggunakan **Jest**.
- **Security & Hardening**:
  - Implementasi **Rate Limiting** via Nginx untuk mencegah serangan DDoS.
  - Koneksi aman menggunakan **SSL/TLS (HTTPS)**.
  - Otentikasi berbasis **JWT (JSON Web Token)**.
- **CI/CD Pipeline**: Otomasi testing dan deployment menggunakan **GitHub Actions**.
- **Infrastruktur Cloud**: Dideploy menggunakan **AWS EC2** dan **AWS RDS (PostgreSQL)**.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Hapi.js
- **Database**: PostgreSQL (Managed via AWS RDS)
- **Infrastructure**: AWS EC2 (Ubuntu Server)
- **Application Server**: AWS EC2
- **Web Server & Reverse Proxy**: Nginx
- **Testing**: Jest
- **CI/CD**: GitHub Actions

## 📁 Struktur Proyek
Proyek ini menerapkan Clean Architecture dengan struktur folder sebagai berikut:
- `src/Domains`: Berisi abstraksi data (Entities) dan kontrak repository.
- `src/Applications`: Berisi logika bisnis (Use Cases).
- `src/Infrastructures`: Implementasi teknis seperti database, security, dan external service.
- `src/Interfaces`: Layer terluar yang menangani HTTP request (Handlers & Routes).



## 🔧 Instalasi & Menjalankan di Lokal

1. **Clone Repository**
   ```bash
   git clone https://github.com/adwira/forum-api.git
   cd forum-api-clean-architecture
   ```

2. **Install Dependencies**
   Jalankan perintah berikut untuk menginstall seluruh dependencies yang dibutuhkan:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**
   Duplikasi file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Kemudian sesuaikan konfigurasi database pada file `.env` (pastikan PostgreSQL sudah berjalan)

4. **Persiapan Database**
   Pastikan Anda telah membuat dua database di PostgreSQL (untuk development dan testing) sesuai konfigurasi `.env` di atas:
   ```sql
   CREATE DATABASE forumapi;
   CREATE DATABASE forumapi_test;
   ```

5. **Jalankan Migrasi Database**
   Jalankan migrasi untuk membuat tabel-tabel yang dibutuhkan:
   ```bash
   # Migrasi database development
   npm run migrate

   # Migrasi database testing
   npm run migrate:test
   ```

6. **Menjalankan Testing (Opsional)**
   Untuk memastikan seluruh kode berjalan dengan baik:
   ```bash
   npm test
   ```

7. **Menjalankan Aplikasi**
   
   Mode Development (dengan nodemon):
   ```bash
   npm run start:dev
   ```

   Mode Production:
   ```bash
   npm start
   ```

   Aplikasi akan berjalan di `localhost:5000` (atau port lain sesuai konfigurasi `.env`).