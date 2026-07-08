# Multi-Currency Converter

A production-grade, high-performance Client-Server currency conversion microservice built with **Spring Boot v4.1.0** (Java 26) and decoupled **React v19 / Vite v8** SPA frontend architecture. The system integrates securely with upstream macroeconomic banking infrastructure to process realtime currency cross-rates over high-contrast utility views.

---

## 🏗️ Architectural Overview

The application utilizes a fully decoupled Client-Server layout. Communication across port bounds is handled gracefully via asynchronous network transactions and relaxed CORS middleware filtering.

Key Design Specs
Decoupled State Management: React manages view mutation bounds asynchronously using standard Fetch bindings, protecting backend execution flows from presentation side effects.
Type-Safe DTO Mapping: Data binding layers use strict Request/Response Data Transfer Objects mapped dynamically by the Jackson processing framework.
Resilient Upstream REST Clients: The core engine leverages isolated RestClient implementations to communicate securely with third-party currency oracle networks.

🛠️ Stack & Dependencies
Core Backend (Distributed System Engine)
Java 26 OpenJDK Execution Environment
Spring Boot v4.1.0 WebMvc Engine Framework
Apache Tomcat v11 High-Concurrency Embedded Web Server, 
Jackson Data Bind v3 JSON Marshalling & Serialization Utilities, 
Project Lombok Boilerplate Synthesis Management,  


Core Frontend (UI Optimization Layer)
React v19.x Single Page Application View Architecture
Vite v8.x Fast Modular Compilation Pipeline
Tailwind CSS v4.x Utility-First Layout Structuring Engine
@tailwindcss/postcss Advanced PostCSS compilation adapter

🚀 Local Installation & Deployment
1. External Infrastructure Setup
   Register a standard profile at ExchangeRate-API to receive your operational public key string.
2. Backend Configuration & Launch
   Create or update src/main/resources/application.properties:
   Properties
   server.port=8080
   api.baseUrl=[https://v6.exchangerate-api.com/v6/](https://v6.exchangerate-api.com/v6/)
   api.key=YOUR_PROVISIONED_API_KEY
   Build and execute the Spring Boot context directly using Maven wrappers or standard IDE runner contexts:
   Bash
# From root project folder
mvn clean spring-boot:run
The server will bind immediately to http://localhost:8080/.
3. Frontend Instantiation
   Navigate to the localized single-page architecture directory and resolve explicit dependency nodes:
   Bash
   cd frontend
   npm install
   npm run dev
   The client runtime will boot dynamically at http://localhost:5173/.
   📡 API Interface Definitions
   Transaction Conversion Endpoint
   Endpoint: POST /api/currency/convert
   Content-Type: application/json
   Access Control: CrossOrigin(origins = "*")

4.
   Request Payload Model:
JSON
   {
   "from": "USD",
   "to": "EUR",
   "amount": 100.00
   }
   Response Payload Model (HTTP 200 OK):
   JSON
   {
   "from": "USD",
   "to": "EUR",
   "amount": 100.00,
   "convertedAmount": 92.50,
   "exchangeRate": 0.925
   }