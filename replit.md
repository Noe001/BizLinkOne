# replit.md

## Overview

BizLinkOne is an all-in-one business collaboration platform designed around a chat-centric workflow. The application integrates multiple productivity tools - chat, task management, knowledge base, and meeting coordination - into a unified interface that mimics Cohere's design system. Built as a full-stack TypeScript application, it provides seamless communication and project management capabilities for teams.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Custom component library built on Radix UI primitives with shadcn/ui patterns
- **Styling**: Tailwind CSS with custom design tokens matching Cohere's visual system
- **Theme System**: Context-based theme provider supporting light/dark modes with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Development**: Hot module replacement via Vite integration
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **API Structure**: RESTful endpoints with `/api` prefix routing

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless database
- **Connection**: Connection pooling with @neondatabase/serverless
- **Schema Management**: Drizzle Kit for migrations and schema versioning
- **Development Storage**: In-memory storage layer for development/testing

### Component Design System
- **Design Reference**: Direct recreation of Cohere's dashboard design patterns
- **Color Palette**: Cohere-inspired color system with beige background (#e8e6de) and section-specific colors
- **Typography**: Inter font family with JetBrains Mono for code elements
- **Layout**: Card-based interface with consistent spacing using Cohere's spacing patterns
- **Responsive Design**: Mobile-first approach with sidebar collapse functionality

### Application Features
- **Dashboard**: Overview of all workspace activities with quick access to recent items
- **Chat System**: Channel-based and direct messaging with message conversion capabilities
- **Task Management**: Kanban-style task organization with status tracking and priority levels
- **Knowledge Base**: Searchable documentation system with tagging and version control
- **Meeting Coordination**: Calendar integration with video platform support and note-taking

### Development Workflow
- **Build System**: Vite for frontend bundling, esbuild for server-side compilation
- **Development Server**: Integrated development environment with HMR and error overlay
- **Code Quality**: TypeScript strict mode with path mapping for clean imports
- **Asset Management**: Centralized asset handling with proper alias resolution

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations and schema management

### UI Framework Dependencies
- **Radix UI**: Unstyled, accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Frontend build tool with development server and HMR
- **TypeScript**: Type safety and enhanced developer experience
- **TanStack Query**: Server state management and data fetching
- **Date-fns**: Date manipulation and formatting utilities

### Form and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Third-party Integrations
- **Google Fonts**: Inter and JetBrains Mono font families via CDN
- **Video Platforms**: Support for Zoom, Google Meet, and Microsoft Teams integration
- **Replit Services**: Development environment integration with Cartographer and error modal