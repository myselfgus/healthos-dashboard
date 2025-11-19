# AuraDash: Neumorphic HealthOS Dashboard

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/myselfgus/healthos-dashboard)

AuraDash is a sophisticated and visually stunning web application designed as a HealthOS dashboard. It features a unique Neumorphic design system, creating a soft, tactile user interface that's both modern and intuitive. The application provides a central hub for managing medical data processing pipelines, including audio transcription, patient dossier processing, and advanced linguistic analysis. Built with React, shadcn/ui, and Tailwind CSS, AuraDash prioritizes visual excellence, micro-interactions, and a flawless user experience.

## Key Features

-   **🎨 Neumorphic Design System:** A beautiful "soft UI" with seamless light and dark mode support.
-   **📊 Interactive Dashboard:** Get a high-level overview of system statistics with dynamic stat cards and trigger mock data-processing pipelines.
-   **🖥️ Integrated Terminal:** View real-time logs and feedback from system actions directly within the dashboard.
-   **📂 Patient Dossier Explorer:** Browse, search, and manage patient records through a clean, card-based interface.
-   **✨ Smooth Animations:** Polished micro-interactions and transitions powered by Framer Motion.
-   **📱 Fully Responsive:** A flawless experience across all device sizes, from mobile to desktop.

## Technology Stack

-   **Framework:** [React](https://react.dev/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for deployment.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/auradash.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd auradash
    ```

3.  **Install dependencies:**
    ```bash
    bun install
    ```

## Development

To run the application in a local development environment, use the following command. This will start a development server with hot-reloading.

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view the application in your browser.

## Building for Production

To create a production-ready build of the application, run:

```bash
bun build
```

This command bundles the application and outputs the static files to the `dist` directory, ready for deployment.

## Deployment

This project is configured for easy deployment to Cloudflare Pages/Workers.

1.  **Log in to Wrangler:**
    If you haven't already, authenticate the Wrangler CLI with your Cloudflare account.
    ```bash
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script to build and deploy your application to Cloudflare.
    ```bash
    bun deploy
    ```

Alternatively, you can deploy directly from your GitHub repository with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/myselfgus/healthos-dashboard)

## License

This project is licensed under the MIT License.