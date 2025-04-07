# UI Requirements

## Design Philosophy

### Core Principles
1. **Professional Medical Aesthetic**
   - Clean, minimalist design
   - Trust-inspiring color scheme
   - Clear typography hierarchy
   - Consistent spacing and alignment

2. **Accessibility First**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - High contrast ratios

3. **Responsive Design**
   - Mobile-first approach
   - Fluid layouts
   - Adaptive components
   - Touch-friendly interfaces

## Color Scheme

### Primary Colors
```css
:root {
  /* Primary Blue */
  --primary-50: #E6F0FF;
  --primary-100: #CCE0FF;
  --primary-200: #99C2FF;
  --primary-300: #66A3FF;
  --primary-400: #3385FF;
  --primary-500: #0066FF; /* Main Brand Color */
  --primary-600: #0052CC;
  --primary-700: #003D99;
  --primary-800: #002966;
  --primary-900: #001433;

  /* Neutral Colors */
  --neutral-50: #F9FAFB;
  --neutral-100: #F3F4F6;
  --neutral-200: #E5E7EB;
  --neutral-300: #D1D5DB;
  --neutral-400: #9CA3AF;
  --neutral-500: #6B7280;
  --neutral-600: #4B5563;
  --neutral-700: #374151;
  --neutral-800: #1F2937;
  --neutral-900: #111827;

  /* Accent Colors */
  --accent-success: #10B981;
  --accent-warning: #F59E0B;
  --accent-error: #EF4444;
  --accent-info: #3B82F6;
}
```

### Usage Guidelines
1. **Primary Elements**
   - Main actions: `--primary-500`
   - Hover states: `--primary-600`
   - Active states: `--primary-700`
   - Background accents: `--primary-50`

2. **Text Colors**
   - Primary text: `--neutral-900`
   - Secondary text: `--neutral-700`
   - Muted text: `--neutral-500`
   - Placeholder: `--neutral-400`

3. **Status Colors**
   - Success: `--accent-success`
   - Warning: `--accent-warning`
   - Error: `--accent-error`
   - Info: `--accent-info`

## Typography

### Font Stack
```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Poppins', var(--font-sans);
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Scale
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

### Line Heights
```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  --leading-loose: 2;
}
```

## Chat Widget Design

### Layout
```typescript
interface ChatWidgetProps {
  position: 'bottom-right' | 'bottom-left';
  initialHeight: number;
  maxHeight: number;
  width: number;
  theme: 'light' | 'dark';
}
```

### Components
1. **Chat Button**
   ```typescript
   interface ChatButtonProps {
     onClick: () => void;
     isOpen: boolean;
     unreadCount?: number;
     position: 'bottom-right' | 'bottom-left';
   }
   ```

2. **Chat Window**
   ```typescript
   interface ChatWindowProps {
     isOpen: boolean;
     onClose: () => void;
     messages: Message[];
     onSendMessage: (message: string) => void;
     isLoading: boolean;
   }
   ```

3. **Message Bubbles**
   ```typescript
   interface MessageBubbleProps {
     content: string;
     type: 'user' | 'assistant';
     timestamp: Date;
     references?: Array<{
       type: 'article' | 'course';
       title: string;
       url: string;
     }>;
   }
   ```

### Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Typing Indicator */
@keyframes typing {
  0% { width: 0; }
  50% { width: 100%; }
  100% { width: 0; }
}
```

## Admin Dashboard

### Layout Structure
```typescript
interface DashboardLayout {
  sidebar: {
    width: number;
    collapsed: boolean;
    items: Array<{
      icon: string;
      label: string;
      href: string;
    }>;
  };
  header: {
    height: number;
    userMenu: boolean;
    notifications: boolean;
  };
  main: {
    padding: number;
    maxWidth: number;
  };
}
```

### Components
1. **Metrics Cards**
   ```typescript
   interface MetricCardProps {
     title: string;
     value: number | string;
     change?: number;
     trend?: 'up' | 'down';
     icon: string;
   }
   ```

2. **Data Tables**
   ```typescript
   interface DataTableProps<T> {
     data: T[];
     columns: Array<{
       key: keyof T;
       label: string;
       render?: (value: any) => React.ReactNode;
     }>;
     pagination: {
       page: number;
       pageSize: number;
       total: number;
     };
   }
   ```

3. **Charts**
   ```typescript
   interface ChartProps {
     type: 'line' | 'bar' | 'pie';
     data: Array<{
       label: string;
       value: number;
     }>;
     options?: Record<string, any>;
   }
   ```

## Component Library

### Base Components
1. **Buttons**
   ```typescript
   interface ButtonProps {
     variant: 'primary' | 'secondary' | 'outline' | 'ghost';
     size: 'sm' | 'md' | 'lg';
     disabled?: boolean;
     loading?: boolean;
     onClick?: () => void;
     children: React.ReactNode;
   }
   ```

2. **Inputs**
   ```typescript
   interface InputProps {
     type: 'text' | 'email' | 'password' | 'number';
     label?: string;
     error?: string;
     helper?: string;
     disabled?: boolean;
     required?: boolean;
   }
   ```

3. **Cards**
   ```typescript
   interface CardProps {
     variant: 'default' | 'elevated' | 'outlined';
     padding: 'none' | 'sm' | 'md' | 'lg';
     children: React.ReactNode;
   }
   ```

### Tailwind Implementation

1. **Base Styles**
   ```css
   @layer base {
     body {
       @apply bg-neutral-50 text-neutral-900;
     }
     
     h1, h2, h3, h4, h5, h6 {
       @apply font-heading font-semibold;
     }
   }
   ```

2. **Components**
   ```css
   @layer components {
     .btn {
       @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
     }
     
     .btn-primary {
       @apply bg-primary-500 text-white hover:bg-primary-600;
     }
     
     .input {
       @apply w-full rounded-md border border-neutral-300 px-3 py-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500;
     }
   }
   ```

3. **Utilities**
   ```css
   @layer utilities {
     .text-balance {
       text-wrap: balance;
     }
     
     .scrollbar-hide {
       -ms-overflow-style: none;
       scrollbar-width: none;
     }
     
     .scrollbar-hide::-webkit-scrollbar {
       display: none;
     }
   }
   ```

## Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Usage
```css
/* Mobile First */
.container {
  @apply px-4;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply px-6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply px-8;
  }
}
```

## Loading States

### Skeleton Loading
```typescript
interface SkeletonProps {
  width: string | number;
  height: string | number;
  rounded?: boolean;
  className?: string;
}
```

### Spinners
```typescript
interface SpinnerProps {
  size: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
```

## Error States

### Error Boundaries
```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}
```

### Error Messages
```typescript
interface ErrorMessageProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Accessibility

### ARIA Labels
```typescript
interface AriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-controls'?: string;
  role?: string;
}
```

### Keyboard Navigation
```typescript
interface KeyboardProps {
  onKeyDown?: (event: KeyboardEvent) => void;
  tabIndex?: number;
  'aria-expanded'?: boolean;
}
```

## Performance

### Image Optimization
```typescript
interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  quality?: number;
}
```

### Code Splitting
```typescript
// Dynamic imports
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  loading: () => <ChatWidgetSkeleton />,
  ssr: false
});
```

## Testing

### Component Testing
```typescript
interface TestProps {
  'data-testid': string;
  'data-test': string;
}
```

### Visual Regression Testing
```typescript
interface VisualTestProps {
  'data-visual-test': string;
  'data-visual-test-id': string;
}
``` 