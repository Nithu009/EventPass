package com.eventpass.model;

import com.eventpass.model.enums.EventSeatStatus;
import com.eventpass.model.enums.SeatCategory;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "event_seats")
@CompoundIndexes({
    @CompoundIndex(name = "event_seat_unique", def = "{'eventId': 1, 'seatCode': 1}", unique = true),
    @CompoundIndex(name = "event_status_category", def = "{'eventId': 1, 'status': 1, 'category': 1}")
})
public class EventSeat {

    @Id
    private String id;

    @Indexed
    private String eventId;

    private String venueId;

    private String seatCode;
    private String rowLabel;
    private int seatNumber;
    private SeatCategory category;
    private BigDecimal basePrice;

    @Indexed
    private EventSeatStatus status = EventSeatStatus.AVAILABLE;

    @Version
    private Long version;

    public EventSeat() {}

    public EventSeat(String eventId, String seatCode, String rowLabel, int seatNumber, SeatCategory category, BigDecimal basePrice) {
        this.eventId = eventId;
        this.seatCode = seatCode;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.category = category;
        this.basePrice = basePrice;
        this.status = EventSeatStatus.AVAILABLE;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getVenueId() { return venueId; }
    public void setVenueId(String venueId) { this.venueId = venueId; }
    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }
    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }
    public int getSeatNumber() { return seatNumber; }
    public void setSeatNumber(int seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatRow() { return rowLabel; }
    public void setSeatRow(String seatRow) { this.rowLabel = seatRow; }

    public SeatCategory getCategory() { return category; }
    public void setCategory(SeatCategory category) { this.category = category; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public EventSeatStatus getStatus() { return status; }
    public void setStatus(EventSeatStatus status) { this.status = status; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
