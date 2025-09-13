# Design Guidelines: Chat-Centric SaaS Platform (Cohere-Inspired)

## Design Approach
**Reference-Based Approach**: Direct recreation of Cohere's dashboard design system with chat-centric adaptations. Emphasizes data clarity, professional aesthetics, and efficient workflows through Cohere's proven visual language.

## Core Design Principles
- **Chat as the Hub**: Central workflow coordinator with Cohere's clean interface patterns
- **Cohere Visual Fidelity**: Exact replication of Cohere's design elements and spacing
- **Enterprise Professionalism**: Clean, trustworthy design suitable for business environments
- **Data-First Design**: Information hierarchy matching Cohere's dashboard approach

## Color Palette

### Primary Colors (Cohere System)
- **Background**: 40 14% 90% (Beige #e8e6de - exact Cohere background)
- **Card Surface**: 210 17% 98% (Gray-50 equivalent)
- **Card Borders**: 210 9% 80% (Gray-300 equivalent)
- **Text Primary**: 220 13% 18% (Dark gray for body text)
- **Text Secondary**: 220 9% 46% (Muted text)

### Cohere Section Colors
- **Blue Section**: 213 94% 68% (Primary brand/chat areas)
- **Red Section**: 0 84% 60% (Alerts/important actions)  
- **Purple Section**: 262 83% 58% (Analytics/reports)
- **Green Section**: 142 70% 50% (Success states/tasks)
- **Red Dot Indicator**: 0 84% 60% (Selected/active states)

### Dark Mode Adaptation
- **Background**: 220 13% 9%
- **Surface**: 220 13% 14%
- **Text Primary**: 220 9% 92%
- **Maintain section color relationships with adjusted lightness

## Typography
- **Primary Font**: Inter (sans-serif via Google Fonts CDN)
- **Body Text**: Sans-serif, text-sm to text-lg
- **Labels**: Monospace, uppercase, text-xs to text-sm (technical labels)
- **Code Elements**: JetBrains Mono for technical content
- **Hierarchy**: Cohere's specific weight relationships (400-600)

## Layout System
**Cohere Spacing System**: Precise replication of Cohere's spacing patterns
- **Card Padding**: p-6 (internal card spacing)
- **Card Margins**: m-4 (between cards)
- **Section Spacing**: p-8 (major layout areas)
- **Micro Elements**: p-2, m-2 (button internals, small components)

## Component Library

### Core Layout Elements
- **Cards**: rounded-lg with gray-50 backgrounds and gray-300 borders
- **Buttons**: rounded-md following Cohere's button hierarchy
- **Containers**: Beige background with proper card elevation system

### Chat Integration Components  
- **Message Cards**: Cohere card styling with chat-specific adaptations
- **Thread Indicators**: Red dot system for active/selected conversations
- **Quick Actions**: Floating elements using Cohere's color sections
- **Status Indicators**: Red dots for unread, section colors for states

### Navigation Elements
- **Sidebar**: Cohere-style navigation with section color coding
- **Tab System**: Horizontal tabs with red dot active indicators
- **Breadcrumbs**: Monospace uppercase labels with section colors

### Data Display Components
- **Dashboard Cards**: Direct Cohere recreation with chat data
- **Activity Feeds**: Card-based timeline using section colors
- **Metric Displays**: Cohere's typography and color system
- **Search Results**: Unified card layout across all content types

## Visual Patterns

### Cohere Design Elements
- **Card Hierarchy**: Gray-50 cards on beige background with consistent borders
- **Color Coding**: Blue (chat), Red (alerts), Purple (analytics), Green (tasks)
- **Active States**: Red dot indicators throughout interface
- **Typography Contrast**: Sans-serif body text with mono uppercase labels

### Chat-Specific Adaptations
- **Message Threading**: Visual connections using section colors
- **Context Panels**: Cohere card styling for related content
- **Integration Indicators**: Section color coding for cross-references

## Animations
**Minimal and Cohere-Consistent**:
- **Card Transitions**: Subtle hover elevations matching Cohere
- **State Changes**: Smooth red dot appearances/disappearances  
- **Loading States**: Skeleton screens using Cohere's card structure

## Accessibility
- **High Contrast**: WCAG AA compliance with Cohere's color relationships
- **Focus Management**: Red dot system adapted for keyboard navigation
- **Screen Reader**: Proper labels for Cohere's visual hierarchy
- **Color Independence**: Section colors supported by typography/iconography

## Images
No hero images required. Focus on Cohere's data-centric card layout system. Any decorative elements should be minimal geometric patterns or data visualizations following Cohere's aesthetic.

This system maintains Cohere's exact visual DNA while adapting it for chat-centric workflows, ensuring familiar enterprise-grade professionalism with seamless feature integration.