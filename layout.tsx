name: Deploy a GitHub Pages

on:
  # Se ejecuta en cada push a la rama principal
  push:
    branches: [main]
  # Permite ejecutarlo manualmente desde la pestaña Actions
  workflow_dispatch:

# Permisos necesarios para publicar en GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Evita despliegues simultáneos
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configurar pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Instalar dependencias
        run: pnpm install --no-frozen-lockfile

      - name: Construir sitio estático
        # basePath se setea con el nombre del repositorio para que las rutas funcionen
        env:
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
        run: pnpm build

      - name: Agregar .nojekyll
        # Evita que GitHub Pages ignore la carpeta _next
        run: touch out/.nojekyll

      - name: Configurar Pages
        uses: actions/configure-pages@v5

      - name: Subir artefacto
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Desplegar a GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
