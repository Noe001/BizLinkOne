# Design Guidelines: Chat-Centric SaaS Platform

## Design Approach
**Inspired by Modern Dashboard Design**: Clean, professional design system emphasizing data clarity and efficient workflows. Visual language inspired by enterprise SaaS platforms like Cohere, adapted for chat-centric collaboration.

## Core Design Principles
- **Chat as the Hub**: Central workflow coordinator with clean interface patterns
- **Visual Consistency**: Cohesive design elements across all features
- **Enterprise Professionalism**: Clean, trustworthy design suitable for business environments
- **Data-First Design**: Clear information hierarchy and intuitive navigation

## Color Palette

### Primary Colors
- **Background**: 40 14% 90% (Beige #e8e6de - warm neutral background)
- **Card Surface**: 210 17% 98% (Light gray surface)
- **Card Borders**: 210 9% 80% (Subtle borders)
- **Text Primary**: 220 13% 18% (Dark gray for body text)
- **Text Secondary**: 220 9% 46% (Muted text)

### Section Colors
- **Blue**: 213 94% 68% (Primary actions/chat areas)
- **Red**: 0 84% 60% (Alerts/important actions)  
- **Purple**: 262 83% 58% (Analytics/reports)
- **Green**: 142 70% 50% (Success states/tasks)
- **Amber**: 43 96% 56% (Warnings/due soon)
- **Active Indicator**: Red dot for selected/active states

### Dark Mode
- **Background**: 220 13% 9%
- **Surface**: 220 13% 14%
- **Text Primary**: 220 9% 92%
- **Borders**: Adjusted for contrast
- **Maintain color relationships with appropriate lightness adjustments

## Typography
- **Primary Font**: Inter (sans-serif via Google Fonts CDN)
- **Body Text**: Sans-serif, text-sm to text-lg (14-18px)
- **Labels**: Monospace, uppercase, text-xs to text-sm for technical labels
- **Code Elements**: JetBrains Mono for code and technical content
- **Weight Hierarchy**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Layout System

### Spacing System (8px Base Unit)
- **Card Padding**: p-4 (16px), p-6 (24px) for internal spacing
- **Card Margins**: gap-4 (16px), gap-6 (24px) between cards
- **Section Spacing**: p-6 (24px), p-8 (32px) for major areas
- **Micro Elements**: p-2 (8px), gap-2 (8px) for compact components
- **Responsive**: Adjust spacing for mobile (sm: prefix)

### Grid System
- **Desktop**: 12-column grid with appropriate gaps
- **Tablet**: Flexible 2-3 column layouts
- **Mobile**: Single column with full-width cards

## Component Library

### Core Layout Elements
- **Cards**: rounded-lg with subtle shadows, clean borders
- **Buttons**: rounded-md with clear visual hierarchy
- **Containers**: Consistent padding and proper elevation

### Interactive Elements
- **Hover States**: Subtle elevation changes (hover:shadow-lg)
- **Active States**: Clear visual feedback with scale transforms
- **Transitions**: Smooth 150-200ms durations for all interactions
- **Focus States**: Clear keyboard navigation indicators

### Status Indicators
- **Priority Badges**: Color-coded with proper contrast
- **Status Badges**: Clickable with hover feedback
- **Due Date Warnings**: Red (overdue), Amber (due soon), Gray (normal)
- **Visual Borders**: Left border accent for overdue/due-soon items

### Chat Integration Components  
- **Message Cards**: Consistent styling with chat-specific layouts
- **Thread Indicators**: Visual hierarchy for conversations
- **Quick Actions**: Always-accessible action menus
- **Status Indicators**: Clear visual feedback for states

## Visual Patterns

### Card Design
- **Hierarchy**: Light cards on warm background
- **Spacing**: Consistent 8px-based internal padding
- **Borders**: Subtle left accent for important states
- **Shadow**: Elevation on hover for interactivity

### Color Coding
- **Blue**: In-progress, active chat
- **Red**: High priority, overdue, critical
- **Purple**: Review, analytics
- **Green**: Done, success, tasks
- **Amber**: Medium priority, due soon

### Responsive Behavior
- **Mobile**: Stack vertically, increase touch targets
- **Tablet**: 2-column layouts where appropriate
- **Desktop**: Full multi-column layouts
- **Flex Direction**: Use sm:flex-row for mobile-first approach

## Animations & Microinteractions

### Transitions
- **Duration**: 150ms for small elements, 200ms for cards
- **Easing**: Default ease or ease-in-out
- **Properties**: Transform, opacity, shadow
- **Hover**: scale-105 or scale-110 for emphasis
- **Active**: scale-95 for click feedback

### Loading States
- **Skeleton Screens**: Match card structure
- **Progress Indicators**: Smooth animations
- **Optimistic Updates**: Immediate visual feedback

## Accessibility

### WCAG AA Compliance
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Management**: Clear focus rings
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles

### Interactive Elements
- **Touch Targets**: Minimum 44x44px
- **Aria Labels**: Descriptive labels for all actions
- **Role Attributes**: Proper semantic markup
- **Error States**: Clear error messages

## Best Practices

### Performance
- **Lazy Loading**: Images and heavy components
- **Optimistic UI**: Immediate feedback before server response
- **Skeleton Loading**: Maintain layout during loading

### Code Quality
- **Component Reusability**: DRY principles
- **Type Safety**: Full TypeScript coverage
- **Consistent Naming**: Clear, descriptive names
- **Remove Framework References**: Keep code framework-agnostic

### Visual Consistency
- **Design Tokens**: Use Tailwind utility classes
- **Spacing**: Always use 8px-based spacing
- **Colors**: Reference design system, not hardcoded values
- **Typography**: Consistent font sizes and weights

This design system provides a cohesive, professional, and accessible foundation for the entire application while maintaining flexibility for future growth.
