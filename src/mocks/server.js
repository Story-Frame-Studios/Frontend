import { createServer, Model } from "miragejs"

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
    },

    seeds(server) {
      server.create("user", {
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        token: "fake-jwt-token",
      })
    },

    routes() {
      this.namespace = "auth"

      // Login endpoint
      this.post("/login", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        let user = schema.users.findBy({ email: attrs.email })

        if (user && user.password === attrs.password) {
          return {
            token: user.token,
            user: {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
            },
          }
        } else {
          return new Response(401, {}, { error: "Invalid credentials" })
        }
      })

      // Register endpoint
      this.post("/register", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        let existingUser = schema.users.findBy({ email: attrs.email })

        if (existingUser) {
          return new Response(400, {}, { error: "Email already exists" })
        }

        const user = schema.users.create({
          ...attrs,
          token: "new-user-fake-jwt-token",
        })

        return {
          token: user.token,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        }
      })

      // Forgot password endpoint
      this.post("/forgot-password", (schema, request) => {
        let attrs = JSON.parse(request.requestBody)
        let user = schema.users.findBy({ email: attrs.email })

        if (user) {
          return { message: "Password reset link sent to your email" }
        } else {
          return new Response(404, {}, { error: "User not found" })
        }
      })
    },
  })

  return server
} 