# BiteSpeed Backend Task — Identity Reconciliation

##  Live API Endpoint

https://bitespeed-identity-api-q4t8.onrender.com/identify

---

##  Problem Statement

Build a backend service that reconciles customer identities across multiple purchases using email and phone number.

The system links related contacts and returns a consolidated identity view.

---

##  Tech Stack

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Render (Deployment)

---

##  Database Schema

**Contact Table**

* id (Primary Key)
* email
* phoneNumber
* linkedId
* linkPrecedence (primary / secondary)
* createdAt
* updatedAt
* deletedAt

---

##  API Endpoint

### POST /identify

#### Request Body

```json
{
  "email": "string",
  "phoneNumber": "string"
}
```

At least one field is required.

---

#### Response

```json
{
  "contact": {
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
```

---

##  Features Implemented

* Identity reconciliation
* Primary & secondary contact linking
* Primary-to-secondary conversion
* Oldest contact precedence
* Unique email & phone aggregation
* Input validation & error handling

---

##  How To Run Locally

```bash
git clone <repo_url>
cd bitespeed-identity-reconciliation
npm install
npm run dev
```

---

##  Deployment

Hosted on Render with PostgreSQL database.

---


