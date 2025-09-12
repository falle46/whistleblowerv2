!! Scroll down for eng-version of this Readme !!
!! Scroll down for eng-version of this Readme !!
!! Scroll down for eng-version of this Readme !!


# Proyek Internal: Whistleblower System

Dokumentasi ini ditujukan untuk tim IT Departemen Development & Solution Specialist. Proyek ini merupakan implementasi sistem pelaporan pelanggaran (Whistleblower System) berbasis web.

## 1. Latar Belakang dan Tujuan

Aplikasi ini dikembangkan untuk menyediakan platform yang aman, rahasia, dan terstruktur bagi karyawan untuk melaporkan dugaan pelanggaran di lingkungan perusahaan. Tujuannya adalah untuk mendigitalisasi dan meningkatkan efisiensi proses investigasi laporan.

## 2. Arsitektur & Teknologi

Sistem ini dibangun menggunakan arsitektur Jamstack dengan rincian sebagai berikut:

-   **Framework Frontend:** **[Next.js](https://nextjs.org/) (React)**
    -   Menggunakan App Router untuk routing dan Server Components untuk rendering yang efisien.
-   **Bahasa:** **[TypeScript](https://www.typescriptlang.org/)**
    -   Untuk memastikan type-safety dan skalabilitas kode.
-   **Styling:** **[Tailwind CSS](https://tailwindcss.com/)**
    -   Framework CSS utility-first untuk pengembangan UI yang cepat.
-   **Backend as a Service (BaaS):** **[Firebase](https://firebase.google.com/)**
    -   **Authentication:** Mengelola otentikasi pengguna (pelapor dan admin).
    -   **Firestore:** Database NoSQL untuk menyimpan data laporan dan pengguna.
    -   **Storage:** Menyimpan file lampiran yang diunggah oleh pelapor.

## 3. Prasyarat (Prerequisites)

Pastikan perangkat Anda telah terinstal software berikut:

-   [Node.js](https://nodejs.org/) (versi 18.x atau yang lebih baru)
-   [NPM](https://www.npmjs.com/) atau [Yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

## 4. Panduan Instalasi Lokal

Langkah-langkah untuk menjalankan proyek ini di lingkungan development lokal.

#### A. Clone Repository
Clone repository dari Git internal perusahaan.
```bash
git clone https://github.com/falle46/whistleblowerv2
cd whistleblower-system
```

#### B. Instalasi Dependensi
Gunakan `npm` untuk menginstal semua package yang dibutuhkan.
```bash
npm install
```

#### C. Konfigurasi Environment Variables
Untuk terhubung ke layanan Firebase, duplikat file `.env.example` (jika ada) menjadi `.env.local`. Jika tidak ada, buat file baru bernama `.env.local` di root direktori.

Isi file tersebut dengan kredensial Firebase untuk environment **development**.
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```
> **Catatan:** Kredensial untuk development dapat ditemukan di [sebutkan lokasi, misal: Google Drive Tim, 1Password, atau tanyakan pada Project Lead]. **Jangan commit file `.env.local` ke repository.**

#### D. Jalankan Aplikasi
Setelah semua konfigurasi selesai, jalankan server development.
```bash
npm run dev
```
Aplikasi akan tersedia di [http://localhost:3000](http://localhost:3000).

## 5. Panduan Kontribusi

Untuk menjaga konsistensi kode, harap ikuti panduan berikut:

-   **Branching:** Gunakan naming convention berikut:
    -   Fitur baru: `feature/nama-fitur` (contoh: `feature/admin-dashboard`)
    -   Perbaikan bug: `fix/deskripsi-bug` (contoh: `fix/login-validation`)
-   **Pull Request (PR):** Ajukan Pull Request ke branch `develop`. Pastikan PR Anda menyertakan deskripsi perubahan yang jelas.

## 6. Kontak & Penanggung Jawab

-   **Pengembang Utama:** Muhammad Falleryan
-   **Email:** falleryan46@gmail.com
-   **LinkedIn:** [linkedin.com/in/falleryan46](https://www.linkedin.com/in/falleryan46/)

Jika ada pertanyaan atau kendala teknis terkait proyek ini, silakan hubungi kontak di atas.
---

# Whistleblower System - Internal Project

This document serves as the technical guide for the Development & Solution Specialist IT team. It outlines the implementation of a web-based Whistleblower System.

## 1. Background and Objective

This application was developed to provide a secure, confidential, and structured platform for employees to report alleged violations within the company. The objective is to digitize and improve the efficiency of the report investigation process.

## 2. Architecture & Technology

This system is built using a Jamstack architecture with the following specifications:

-   **Frontend Framework:** **[Next.js](https://nextjs.org/) (React)**
    -   Utilizes the App Router for routing and Server Components for efficient rendering.
-   **Language:** **[TypeScript](https://www.typescriptlang.org/)**
    -   To ensure code type-safety and scalability.
-   **Styling:** **[Tailwind CSS](https://tailwindcss.com/)**
    -   A utility-first CSS framework for rapid UI development.
-   **Backend as a Service (BaaS):** **[Firebase](https://firebase.google.com/)**
    -   **Authentication:** Manages user (reporter and admin) authentication.
    -   **Firestore:** A NoSQL database for storing report and user data.
    -   **Storage:** Stores file attachments uploaded by whistleblowers.

## 3. Prerequisites

Ensure you have the following software installed on your machine:

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)

## 4. Local Setup Guide

Follow these steps to run the project in a local development environment.

#### A. Clone the Repository
Clone the repository from the company's internal Git server.
```bash
git clone https://github.com/falle46/whistleblowerv2
cd whistleblower-system
```

#### B. Install Dependencies
Use `npm` to install all required packages.
```bash
npm install
```

#### C. Configure Environment Variables
To connect to Firebase services, duplicate the `.env.example` file (if it exists) to a new file named `.env.local`. If not, create the `.env.local` file in the project's root directory.

Populate this file with the Firebase credentials for the **development** environment.
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```
> **Note:** Development credentials can be found in [mention credential storage, e.g., the team's Google Drive, 1Password, or by contacting the Project Lead]. **Do not commit the `.env.local` file to the repository.**

#### D. Run the Application
Once the configuration is complete, run the development server.
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## 5. Contribution Guidelines

To maintain code consistency, please follow these guidelines:

-   **Branching:** Use the following naming convention:
    -   New features: `feature/feature-name` (e.g., `feature/admin-dashboard`)
    -   Bug fixes: `fix/bug-description` (e.g., `fix/login-validation`)
-   **Pull Requests (PRs):** Submit Pull Requests to the `develop` branch. Ensure your PR includes a clear description of the changes made.

## 6. Contact & Maintainer

-   **Primary Developer:** Muhammad Falleryan
-   **Email:** falleryan46@gmail.com
-   **LinkedIn:** [linkedin.com/in/falleryan46](https://www.linkedin.com/in/falleryan46/)

For any technical questions or issues regarding this project, please use the contact information above.
---