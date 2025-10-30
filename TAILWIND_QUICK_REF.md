# 🎨 Tailwind Quick Reference - Expense Tracker

Quick reference for common Tailwind classes used in this project.

---

## 🎯 Custom Classes (Reusable)

```css
.card                  /* White card with shadow */
.btn-primary          /* Blue gradient button */
.btn-secondary        /* Outlined button */
.input-field          /* Styled form input */
.badge                /* Colored pill */
.badge-success        /* Green badge */
.badge-danger         /* Red badge */
```

---

## 📦 Common Patterns

### Card Container
```jsx
<div className="card">
  {/* content */}
</div>
```

### Primary Button
```jsx
<button className="btn-primary">
  Click Me
</button>
```

### Form Input
```jsx
<input className="input-field" placeholder="Email" />
```

### Gradient Background
```jsx
<div className="bg-gradient-to-br from-blue-500 to-purple-600">
  {/* content */}
</div>
```

### Stat Card
```jsx
<div className="card bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200">
  <p className="text-sm font-medium text-green-700">Total Income</p>
  <p className="text-3xl font-bold text-green-900">₹1000</p>
</div>
```

### Badge
```jsx
<span className="badge badge-success">Food</span>
<span className="badge badge-danger">Expense</span>
```

---

## 🎨 Color System

### Background Colors
```
bg-white              /* White */
bg-gray-50            /* Very light gray */
bg-gray-100           /* Light gray */
bg-blue-500           /* Blue */
bg-green-500          /* Green */
bg-red-500            /* Red */
```

### Text Colors
```
text-gray-600         /* Medium gray text */
text-gray-900         /* Dark text */
text-blue-600         /* Blue text */
text-green-600        /* Green text */
text-red-600          /* Red text */
text-white            /* White text */
```

### Gradients
```
bg-gradient-to-r      /* Left to right */
bg-gradient-to-br     /* Top-left to bottom-right */
from-blue-500         /* Start color */
to-purple-600         /* End color */
```

---

## 📐 Spacing

### Padding
```
p-2    /* 8px all sides */
p-4    /* 16px all sides */
p-6    /* 24px all sides */
px-4   /* 16px left/right */
py-2   /* 8px top/bottom */
```

### Margin
```
m-2    /* 8px all sides */
m-4    /* 16px all sides */
mt-2   /* 8px top */
mb-4   /* 16px bottom */
```

### Gap (Flex/Grid)
```
gap-2   /* 8px */
gap-4   /* 16px */
gap-6   /* 24px */
```

---

## 📱 Layout

### Flexbox
```
flex                  /* Display flex */
flex-col              /* Column direction */
items-center          /* Align items center */
justify-between       /* Space between */
space-x-2             /* Horizontal gap */
space-y-4             /* Vertical gap */
```

### Grid
```
grid                          /* Display grid */
grid-cols-1                   /* 1 column */
grid-cols-2                   /* 2 columns */
md:grid-cols-3               /* 3 cols on tablet+ */
gap-4                        /* Grid gap */
```

---

## 🎯 Typography

### Font Size
```
text-xs    /* 12px */
text-sm    /* 14px */
text-base  /* 16px */
text-lg    /* 18px */
text-xl    /* 20px */
text-2xl   /* 24px */
text-3xl   /* 30px */
```

### Font Weight
```
font-normal    /* 400 */
font-medium    /* 500 */
font-bold      /* 700 */
font-extrabold /* 800 */
```

---

## 🎨 Borders

### Border Width
```
border         /* 1px all sides */
border-2       /* 2px all sides */
border-t       /* Top only */
```

### Border Color
```
border-gray-200    /* Light gray */
border-blue-500    /* Blue */
border-red-500     /* Red */
```

### Border Radius
```
rounded         /* 4px */
rounded-lg      /* 8px */
rounded-xl      /* 12px */
rounded-2xl     /* 16px */
rounded-full    /* Circle */
```

---

## 🌟 Effects

### Shadow
```
shadow         /* Small shadow */
shadow-md      /* Medium shadow */
shadow-lg      /* Large shadow */
shadow-xl      /* Extra large */
hover:shadow-xl /* Shadow on hover */
```

### Opacity
```
opacity-50      /* 50% opacity */
opacity-75      /* 75% opacity */
hover:opacity-80 /* Opacity on hover */
```

### Transform
```
scale-105           /* Scale up 5% */
hover:scale-110     /* Scale on hover */
-translate-y-0.5    /* Move up slightly */
```

---

## ✨ Transitions

```
transition-all         /* All properties */
transition-colors      /* Colors only */
duration-200          /* 200ms */
ease-in-out           /* Easing function */
```

**Combined:**
```jsx
className="transition-all duration-200 ease-in-out hover:shadow-lg"
```

---

## 🎬 Animations

### Built-in
```
animate-spin      /* Spinner */
animate-bounce    /* Bouncing */
animate-pulse     /* Pulsing */
```

### Custom (This Project)
```
animate-fade-in    /* Fade in */
animate-slide-up   /* Slide up */
animate-slide-down /* Slide down */
animate-blob       /* Floating blob */
```

---

## 📱 Responsive Design

### Breakpoints
```
sm:    /* 640px+ */
md:    /* 768px+ */
lg:    /* 1024px+ */
xl:    /* 1280px+ */
```

### Usage
```
hidden md:flex           /* Hide mobile, show tablet+ */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
text-sm md:text-base
px-4 md:px-6 lg:px-8
```

---

## 🎯 Common Combinations

### Centered Container
```jsx
<div className="flex items-center justify-center min-h-screen">
  {/* content */}
</div>
```

### Card with Hover
```jsx
<div className="card hover:shadow-xl transition-shadow duration-300">
  {/* content */}
</div>
```

### Button with Icon
```jsx
<button className="btn-primary flex items-center space-x-2">
  <svg className="w-5 h-5">...</svg>
  <span>Click Me</span>
</button>
```

### Input with Icon
```jsx
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
    <svg className="w-5 h-5 text-gray-400">...</svg>
  </div>
  <input className="input-field pl-10" />
</div>
```

### Gradient Card
```jsx
<div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
  {/* content */}
</div>
```

---

## 🔧 State Variants

### Hover
```
hover:bg-blue-600
hover:text-white
hover:shadow-lg
```

### Focus
```
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
focus:outline-none
```

### Active
```
active:scale-95
active:bg-blue-700
```

### Disabled
```
disabled:opacity-50
disabled:cursor-not-allowed
```

---

## 🎨 Example Components

### Stat Card
```jsx
<div className="card bg-gradient-to-br from-green-50 to-emerald-100">
  <p className="text-sm font-medium text-green-700">Total Income</p>
  <p className="text-3xl font-bold text-green-900">₹1,234.56</p>
</div>
```

### Transaction Item
```jsx
<div className="flex items-center justify-between p-4 hover:bg-gray-50">
  <div className="flex items-center space-x-4">
    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
      <svg className="w-6 h-6 text-red-600">...</svg>
    </div>
    <div>
      <span className="badge badge-danger">Food</span>
      <span className="ml-2 font-bold text-red-600">-₹500</span>
    </div>
  </div>
</div>
```

### Chat Message
```jsx
<div className="flex justify-end">
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3 rounded-2xl max-w-[70%]">
    Hello!
  </div>
</div>
```

---

## 💡 Pro Tips

1. **Use @apply for repeated patterns**
2. **Combine utilities instead of custom CSS**
3. **Use responsive prefixes (md:, lg:)**
4. **Leverage hover: and focus: variants**
5. **Use transition-all for smooth effects**
6. **Keep gradients consistent**
7. **Use semantic colors (success, danger)**
8. **Test on mobile first**

---

## 🔗 Resources

- [Full Tailwind Docs](https://tailwindcss.com/docs)
- [Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
- [Play CDN](https://tailwindcss.com/docs/installation/play-cdn)

---

**Quick Start:**
```bash
# Install
npm install -D tailwindcss

# Init
npx tailwindcss init

# Add to CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

**Happy Styling! 🎨**
