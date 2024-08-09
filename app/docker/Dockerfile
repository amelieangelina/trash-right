ARG NODE_VERSION=20.16.0
# Use an official Node.js image as a base for building the Next.js app
FROM node:${NODE_VERSION}-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache python3 py3-pip libc6-compat

WORKDIR /usr/src/app


# Install dependencies based on the preferred package manager
COPY ../package.json yarn.lock* ../package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /usr/src/app
COPY --from=deps usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner

# Set the working directory
WORKDIR /usr/src/app

ARG user=nextjs
ARG group=nodejs
ARG usergroup=${user}:${group}
RUN adduser -u 1001 -S ${user}
RUN addgroup -g 1001 -S ${group}

# Copy the built Next.js app from the builder stage
COPY --from=builder --chown=${usergroup} /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules /app/node_modules
COPY --from=builder /usr/src/app/package.json /app/package.json
COPY --from=builder /usr/src/app/public /app/public


# Expose the application port
EXPOSE 3000

USER ${user}

CMD ["npm", "start"]

