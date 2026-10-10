package com.eventpass.service;

import com.eventpass.common.BusinessException;
import com.eventpass.common.ResourceNotFoundException;
import com.eventpass.dto.TicketDto;
import com.eventpass.dto.TicketValidationResponse;
import com.eventpass.model.Event;
import com.eventpass.model.Ticket;
import com.eventpass.model.Venue;
import com.eventpass.repository.EventRepository;
import com.eventpass.repository.TicketRepository;
import com.eventpass.repository.VenueRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public TicketService(TicketRepository ticketRepository,
                         EventRepository eventRepository,
                         VenueRepository venueRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
    }

    public TicketDto getTicketById(String id, String userId, boolean isAdmin) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));

        TicketDto dto = enrichTicketDto(ticket);
        dto.setQrCodeBase64(generateQrBase64(ticket.getQrValidationToken()));
        return dto;
    }

    public List<TicketDto> getTicketsByBookingId(String bookingId) {
        List<Ticket> tickets = ticketRepository.findByBookingId(bookingId);
        return tickets.stream().map(t -> {
            TicketDto dto = enrichTicketDto(t);
            dto.setQrCodeBase64(generateQrBase64(t.getQrValidationToken()));
            return dto;
        }).toList();
    }

    /**
     * Atomically validates and marks a ticket as scanned.
     * @param token  The QR validation token or ticket number extracted from the QR scan
     * @param scannedByEmail  Email of the gate staff / admin who is scanning
     */
    @Transactional
    public TicketValidationResponse validateTicket(String token, String scannedByEmail) {
        if (token == null || token.isBlank()) {
            return TicketValidationResponse.invalid("(empty)", "Token cannot be empty.");
        }

        String searchToken = token.trim();
        Ticket ticket = ticketRepository.findByQrValidationToken(searchToken)
                .or(() -> ticketRepository.findByTicketNumber(searchToken))
                .orElse(null);

        if (ticket == null) {
            return TicketValidationResponse.invalid(searchToken,
                    "INVALID TICKET — Token not recognised. Entry denied.");
        }

        Event event = eventRepository.findById(ticket.getEventId()).orElse(null);
        String eventTitle = event != null ? event.getTitle() : "Unknown Event";

        // Duplicate scan check
        if (ticket.isScanned()) {
            return TicketValidationResponse.alreadyScanned(
                    ticket.getId(),
                    ticket.getTicketNumber(),
                    eventTitle,
                    ticket.getSeatCode(),
                    ticket.getSeatCategory(),
                    ticket.getAttendeeName(),
                    ticket.getAttendeeEmail(),
                    ticket.getScannedBy(),
                    ticket.getScannedAt()
            );
        }

        // Valid first scan — atomically mark
        ticket.setScanned(true);
        ticket.setScannedAt(Instant.now());
        ticket.setScannedBy(scannedByEmail != null ? scannedByEmail : "gate-staff");
        ticketRepository.save(ticket);

        return TicketValidationResponse.firstScan(
                ticket.getId(),
                ticket.getTicketNumber(),
                eventTitle,
                ticket.getSeatCode(),
                ticket.getSeatCategory(),
                ticket.getAttendeeName(),
                ticket.getAttendeeEmail(),
                ticket.getScannedAt()
        );
    }

    /**
     * Legacy overload — validates without tracking who scanned.
     */
    @Transactional
    public TicketValidationResponse validateTicket(String token) {
        return validateTicket(token, "admin");
    }

    public String generateQrBase64(String content) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 240, 240);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (Exception e) {
            return null;
        }
    }

    private TicketDto enrichTicketDto(Ticket ticket) {
        TicketDto dto = TicketDto.fromEntity(ticket);
        eventRepository.findById(ticket.getEventId()).ifPresent(event -> {
            dto.setEventTitle(event.getTitle());
            dto.setEventStartTime(event.getStartTime());
            venueRepository.findById(event.getVenueId()).ifPresent(venue -> {
                dto.setVenueName(venue.getName());
                dto.setVenueCity(venue.getCity());
            });
        });
        return dto;
    }
}
