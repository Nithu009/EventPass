package com.eventpass.config;

import com.eventpass.dto.CreateEventRequest;
import com.eventpass.dto.CreateVenueRequest;
import com.eventpass.dto.EventDto;
import com.eventpass.dto.VenueDto;
import com.eventpass.model.*;
import com.eventpass.model.enums.*;
import com.eventpass.repository.*;
import com.eventpass.service.EventService;
import com.eventpass.service.PricingEngineService;
import com.eventpass.service.VenueService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final EventRepository eventRepository;
    private final EventSeatRepository eventSeatRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;
    private final PricingRuleRepository pricingRuleRepository;
    private final PasswordEncoder passwordEncoder;
    private final VenueService venueService;
    private final EventService eventService;

    public DataSeeder(UserRepository userRepository,
                      VenueRepository venueRepository,
                      EventRepository eventRepository,
                      EventSeatRepository eventSeatRepository,
                      BookingRepository bookingRepository,
                      PaymentRepository paymentRepository,
                      TicketRepository ticketRepository,
                      PricingRuleRepository pricingRuleRepository,
                      PasswordEncoder passwordEncoder,
                      VenueService venueService,
                      EventService eventService) {
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
        this.eventRepository = eventRepository;
        this.eventSeatRepository = eventSeatRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
        this.pricingRuleRepository = pricingRuleRepository;
        this.passwordEncoder = passwordEncoder;
        this.venueService = venueService;
        this.eventService = eventService;
    }

    @Override
    public void run(String... args) {
        try {
            seedUsers();
            seedVenuesAndEvents();
            seedPricingRules();
            seedSampleTicket();
            log.info("EventPass database seeding completed successfully.");
        } catch (Exception e) {
            log.warn("Database seeding note: {}", e.getMessage());
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@eventpass.com")) {
            User admin = new User(
                    "admin@eventpass.com",
                    passwordEncoder.encode("Admin@123456"),
                    "Platform Administrator",
                    "+91 9876543210"
            );
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            log.info("Seeded default Admin: admin@eventpass.com");
        }

        if (!userRepository.existsByEmail("user@eventpass.com")) {
            User user = new User(
                    "user@eventpass.com",
                    passwordEncoder.encode("User@123456"),
                    "Alex Johnson",
                    "+91 9876500000"
            );
            user.setRole(Role.USER);
            userRepository.save(user);
            log.info("Seeded default User: user@eventpass.com");
        }
    }

    private void seedVenuesAndEvents() {
        if (eventRepository.count() > 0) {
            return;
        }

        // 1. Create Venue 1: Metropolis Arena (8 rows x 10 cols = 80 seats)
        CreateVenueRequest v1 = new CreateVenueRequest();
        v1.setName("Metropolis Grand Arena");
        v1.setCity("Mumbai");
        v1.setAddress("BKC Entertainment District, Bandra East");
        v1.setCapacity(80);
        v1.setTotalRows(8);
        v1.setTotalColumns(10);
        VenueDto venue1 = venueService.createVenue(v1);

        // 2. Create Venue 2: Silicon Tech Amphitheater (6 rows x 8 cols = 48 seats)
        CreateVenueRequest v2 = new CreateVenueRequest();
        v2.setName("Silicon Tech Amphitheater");
        v2.setCity("Bengaluru");
        v2.setAddress("Whitefield Outer Ring Road, Tech Corridor");
        v2.setCapacity(48);
        v2.setTotalRows(6);
        v2.setTotalColumns(8);
        VenueDto venue2 = venueService.createVenue(v2);

        // 3. Create Event 1: Electric Odyssey
        CreateEventRequest e1 = new CreateEventRequest();
        e1.setTitle("Electric Odyssey Live: Symphonic EDM Experience");
        e1.setDescription("An immersive audiovisual spectacle featuring world-class electronic producers accompanied by a 40-piece live orchestra and synchronised lasers.");
        e1.setCategory("MUSIC");
        e1.setVenueId(venue1.getId());
        e1.setStartTime(Instant.now().plusSeconds(86400 * 5));
        e1.setEndTime(Instant.now().plusSeconds(86400 * 5 + 14400));
        e1.setBannerUrl("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80");
        e1.setBasePriceStandard(new BigDecimal("799.00"));
        e1.setBasePricePremium(new BigDecimal("1499.00"));
        e1.setBasePriceVip(new BigDecimal("2999.00"));
        eventService.createEvent(e1);

        // 4. Create Event 2: Global AI & Cloud Summit 2026
        CreateEventRequest e2 = new CreateEventRequest();
        e2.setTitle("Global AI & Autonomous Systems Summit 2026");
        e2.setDescription("The premier summit uniting AI researchers, autonomous systems architects, and venture leaders discussing next-generation reasoning architectures.");
        e2.setCategory("TECH");
        e2.setVenueId(venue2.getId());
        e2.setStartTime(Instant.now().plusSeconds(86400 * 12));
        e2.setEndTime(Instant.now().plusSeconds(86400 * 12 + 28800));
        e2.setBannerUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80");
        e2.setBasePriceStandard(new BigDecimal("1200.00"));
        e2.setBasePricePremium(new BigDecimal("2400.00"));
        e2.setBasePriceVip(new BigDecimal("4500.00"));
        eventService.createEvent(e2);

        // 5. Create Event 3: Championship Esports Finals
        CreateEventRequest e3 = new CreateEventRequest();
        e3.setTitle("Valorant Masters World Invitational 2026");
        e3.setDescription("Witness elite teams battle for global supremacy in the most anticipated esports championship of the year with live commentary and fan zones.");
        e3.setCategory("GAMING");
        e3.setVenueId(venue1.getId());
        e3.setStartTime(Instant.now().plusSeconds(86400 * 20));
        e3.setEndTime(Instant.now().plusSeconds(86400 * 20 + 21600));
        e3.setBannerUrl("https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80");
        e3.setBasePriceStandard(new BigDecimal("499.00"));
        e3.setBasePricePremium(new BigDecimal("999.00"));
        e3.setBasePriceVip(new BigDecimal("1999.00"));
        eventService.createEvent(e3);

        log.info("Seeded 2 Venues and 3 Events with full seating topology.");
    }

    private void seedPricingRules() {
        if (pricingRuleRepository.count() > 0) return;

        PricingRule demandSurge = new PricingRule();
        demandSurge.setName("High Demand Surge (Occupancy > 60%)");
        demandSurge.setTriggerType(PricingTriggerType.DEMAND_THRESHOLD);
        demandSurge.setThresholdPercentage(new BigDecimal("60.00"));
        demandSurge.setMultiplier(new BigDecimal("1.25"));
        demandSurge.setActive(true);
        pricingRuleRepository.save(demandSurge);

        PricingRule lastMinuteSurge = new PricingRule();
        lastMinuteSurge.setName("Last-Minute Proximity Surge (< 48 hrs)");
        lastMinuteSurge.setTriggerType(PricingTriggerType.TIME_BEFORE_EVENT);
        lastMinuteSurge.setHoursBeforeEvent(48);
        lastMinuteSurge.setMultiplier(new BigDecimal("1.15"));
        lastMinuteSurge.setActive(true);
        pricingRuleRepository.save(lastMinuteSurge);

        log.info("Seeded dynamic pricing rules.");
    }

    private void seedSampleTicket() {
        if (ticketRepository.count() > 0) return;

        User user = userRepository.findByEmail("user@eventpass.com").orElse(null);
        Event event = eventRepository.findAll().stream().findFirst().orElse(null);
        if (user == null || event == null) return;

        // Sample booking & ticket for demonstration
        List<BookingItem> items = new ArrayList<>();
        items.add(new BookingItem(null, "A1", "A", 1, SeatCategory.VIP, new BigDecimal("2999.00")));

        Booking booking = new Booking(
                "EP-2026-DEMO01",
                user.getId(),
                event.getId(),
                items,
                new BigDecimal("2999.00"),
                new BigDecimal("149.95"),
                new BigDecimal("3148.95"),
                Instant.now().plusSeconds(3600)
        );
        booking.setStatus(BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);

        Payment payment = new Payment(
                savedBooking.getId(),
                "TXN-DEMO-998877",
                savedBooking.getTotalAmount(),
                "CREDIT_CARD"
        );
        payment.setStatus(PaymentStatus.SUCCESS);
        paymentRepository.save(payment);

        Ticket demoTicket = new Ticket(
                savedBooking.getId(),
                event.getId(),
                user.getId(),
                "A1",
                SeatCategory.VIP,
                new BigDecimal("2999.00"),
                "TK-2026-DEMO01",
                "EP-TOKEN-DEMO-1",
                user.getFullName(),
                user.getEmail()
        );
        ticketRepository.save(demoTicket);

        log.info("Seeded demo Ticket token 'EP-TOKEN-DEMO-1' for gate scanner testing.");
    }
}
