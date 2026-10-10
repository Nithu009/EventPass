import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// User Pages
import { SeatSelectionPage } from '../pages/SeatSelectionPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentStatusPage } from '../pages/PaymentStatusPage';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { TicketDetailsPage } from '../pages/TicketDetailsPage';
import { UserProfilePage } from '../pages/UserProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminEventsPage } from '../pages/AdminEventsPage';
import { AdminCreateEventPage } from '../pages/AdminCreateEventPage';
import { AdminVenuesPage } from '../pages/AdminVenuesPage';
import { AdminPricingPage } from '../pages/AdminPricingPage';
import { AdminBookingsPage } from '../pages/AdminBookingsPage';
import { AdminValidateTicketPage } from '../pages/AdminValidateTicketPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Customer Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="events/:id/seats" element={<SeatSelectionPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment-status" element={<PaymentStatusPage />} />
        <Route path="bookings" element={<MyBookingsPage />} />
        <Route path="tickets/:id" element={<TicketDetailsPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<AccessDeniedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="events" element={<AdminEventsPage />} />
        <Route path="events/create" element={<AdminCreateEventPage />} />
        <Route path="venues" element={<AdminVenuesPage />} />
        <Route path="pricing" element={<AdminPricingPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="validate-ticket" element={<AdminValidateTicketPage />} />
      </Route>
    </Routes>
  );
};
