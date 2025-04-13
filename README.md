# 📦 EcomApp – Full Stack + DevOps Overview

This README presents **side-by-side views** of both **Development** and **Deployment** aspects of the EcomApp project.

---

## 🧩 Tech Stack Overview

| Development                                 | Deployment                                     |
|---------------------------------------------|-------------------------------------------------|
| `Next.js 15.3.0` (App Router)                | Kubernetes Cluster on VPS (Contabo)             |
| `TypeScript` + `Zustand` for state mgmt     | Docker + Multi-stage builds                     |
| `Tailwind CSS` for UI                       | Traefik Ingress with TLS from Let's Encrypt     |
| `Turbopack` for build optimization          | Persistent storage via Longhorn                 |
| REST/Client-side logic                      | DNS management via GoDaddy                      |
| Server-side actions in Next.js              | Namespaces, Services, and Ingress configured    |

---

## 🛠️ Development Workflow

### Local Setup
```bash
# Clone the repository
$ git clone https://github.com/yourusername/ecommerce-store.git
$ cd ecommerce-store

# Install dependencies
$ npm install

# Run in development mode
$ npm run dev

# Open: http://localhost:3000
```

### File Structure
```bash
src/
├── app/                # Pages, layouts, routing
├── components/         # Reusable UI components
├── store/              # Zustand-based state store
└── types/              # Global TS types
```

### Environment
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🚀 Kubernetes Deployment (Production)

### Docker Image
```Dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

### Kubernetes Manifests (apply with `kubectl apply -f ecomapp-deployment.yaml`)
```yaml
# Namespace
apiVersion: v1
kind: Namespace
metadata:
  name: ecomapp
---
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecomapp
  namespace: ecomapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ecomapp
  template:
    metadata:
      labels:
        app: ecomapp
    spec:
      containers:
      - name: ecomapp
        image: satishkvk/ecomapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: PORT
          value: "3000"
---
# Service
apiVersion: v1
kind: Service
metadata:
  name: ecomapp
  namespace: ecomapp
spec:
  selector:
    app: ecomapp
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
---
# Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ecomapp
  namespace: ecomapp
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
    traefik.ingress.kubernetes.io/router.tls.certresolver: lets-encrypt
spec:
  rules:
  - host: ecomapp.kvatron.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ecomapp
            port:
              number: 3000
  tls:
  - hosts:
    - ecomapp.kvatron.com
    secretName: ecomapp-cert
```

---

## 🌐 DNS Configuration
- Domain: `ecomapp.kvatron.com`
- DNS Provider: **GoDaddy**
- Type: `A` Record
- Value: Public IP of Kubernetes Node (e.g. `62.171.136.239`)

---

## ✅ Summary
| Development                                   | Deployment                                       |
|-----------------------------------------------|--------------------------------------------------|
| Full Next.js frontend app                     | Traefik TLS-secured routing via Ingress          |
| Zustand-based session & cart management       | Docker image pushed to Docker Hub                |
| Tailwind UI + Role-based login                | Namespace-isolated K8s resources                 |
| Git-based workflow                            | DNS records manually updated on GoDaddy          |
| SSR + Static Export                           | HTTPS via Let's Encrypt auto-cert generation     |

---

> 💡 This setup demonstrates full-stack capability with **DevOps deployment workflow**, showcasing both frontend and infrastructure readiness.
