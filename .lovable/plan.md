

# EV Charging Station Finder

## Design & Theme
- **Color palette**: Primary green (#22C55E), dark navy (#1E3A5F), light background (#F8FAFC)
- **Style**: Glassmorphism cards, rounded corners, smooth Framer Motion animations, mobile-first
- **EV-themed loading animations**: Battery charging loader, skeleton cards, map spinner

## Pages & Navigation

### 1. Login Page
- Email/password form with Zod validation
- Framer Motion loading animation on submit
- Error messages for invalid credentials
- Supabase Auth (email/password sign-up and sign-in)

### 2. Home Page (All users)
- Hero section with search bar
- Nearby stations overview with animated cards
- Quick links to map and bookings

### 3. Map Page (All users)
- Full-screen Leaflet map showing all stations as markers
- Click marker to see station details (name, charger type, available slots)
- "Book Now" button on each station popup

### 4. Stations List Page (All users)
- Grid of station cards with charger type, availability, distance
- Filter by charger type
- Skeleton loaders while fetching

### 5. Bookings Page (Authenticated users)
- View user's bookings (upcoming and past)
- Book a slot: select station → pick date/time → confirm
- Cancel booking option

### 6. Admin Dashboard (Admin only, protected route)
- Table of all stations with edit/delete actions
- "Add Station" form: name, lat/lng, charger type, available slots
- Pick location from an embedded Leaflet map
- Station management with real-time updates

## Navbar
- Logo + nav links (Home, Map, Stations, Bookings)
- Admin Dashboard link (visible only to admins)
- User avatar/menu with logout button
- Logout clears Supabase session and redirects to login

## Authentication & Security (Supabase)
- Supabase Auth for login/signup (email + password)
- **User roles stored in a `user_roles` table** with RLS policies and a `has_role()` security definer function — NOT localStorage
- ProtectedRoute component that checks role server-side via Supabase before granting access
- Admin routes redirect non-admins to Home

## Database Tables (Supabase)

### `stations`
- id, name, latitude, longitude, charger_type, available_slots, created_by, created_at

### `bookings`
- id, user_id, station_id, booking_date, time_slot, status, created_at

### `user_roles`
- id, user_id, role (enum: admin, user)

### `profiles`
- id (FK to auth.users), full_name, avatar_url, created_at

## Row-Level Security
- Users can read all stations, only admins can insert/update/delete
- Users can read/create/cancel their own bookings
- Profiles: users can read/update their own profile

## Animations (Framer Motion)
- Page transitions with fade/slide
- Station cards animate in on scroll
- Battery charging loader for loading states
- Map loading spinner
- Login button loading state

## Key Components
- `LoginForm` — auth form with validation
- `Navbar` — responsive nav with role-aware links
- `ProtectedRoute` — server-side role check wrapper
- `StationCard` — animated station info card
- `MapView` — Leaflet map with station markers
- `BookingForm` — date/time slot picker
- `Loader` — EV battery charging animation
- `AdminStationForm` — add/edit station with map picker

