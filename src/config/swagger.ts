import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SparePartsHubBackend API",
      version: "1.0.0",
      description: "API for managing car parts and user registration",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
  },
  apis: ["./src/controllers/*.ts"], // Scan controllers for JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);