# --- Build stage ---
    FROM node:20-alpine AS builder

    # Tạo thư mục làm việc
    WORKDIR /app
    
    # Cài dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy toàn bộ mã nguồn và build Nuxt app
    COPY . .
    RUN npm run build
    
    # --- Production stage ---
    FROM node:20-alpine AS production
    
    WORKDIR /app
    
    # Chỉ copy build output và dependencies cần thiết
    COPY --from=builder /app/.output ./.output
    COPY --from=builder /app/package*.json ./
    
    # Cài các dependency production (nếu có)
    RUN npm install --omit=dev
    
    EXPOSE 3000
    
    # Chạy ứng dụng Nuxt 3
    CMD ["node", ".output/server/index.mjs"]