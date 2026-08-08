package com.eventapp.service;

import com.eventapp.dto.EventRequest;
import com.eventapp.dto.EventResponse;
import com.eventapp.dto.ParticipantResponse;
import com.eventapp.dto.RegistrationRequest;
import com.eventapp.dto.ReportResponse;
import com.eventapp.dto.MonthlyTrendDTO;
import com.eventapp.dto.EventParticipationDTO;
import com.eventapp.entity.*;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.RegistrationRepository;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.time.Month;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Element;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.PdfContentByte;
import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public EventResponse createEvent(EventRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .maxParticipants(request.getMaxParticipants() != null ? request.getMaxParticipants() : 100)
                .status(EventStatus.UPCOMING)
                .admin(admin)
                .image(request.getImage() != null ? request.getImage() : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80")
                .paymentScanner(request.getPaymentScanner() != null ? request.getPaymentScanner() : "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg")
                .fee(request.getFee() != null ? request.getFee() : 0.0)
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getAdminEvents(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return eventRepository.findByAdmin(admin).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToResponse(event);
    }

    public void registerForEvent(Long eventId, String studentEmail, RegistrationRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getStatus() == EventStatus.CLOSED) {
            throw new RuntimeException("Event registrations are closed");
        }

        int maxParticipants = event.getMaxParticipants() != null ? event.getMaxParticipants() : 0;
        int currentCount = registrationRepository.findByEvent(event).size();
        RegistrationStatus initialStatus = RegistrationStatus.PENDING;
        if (maxParticipants > 0 && currentCount >= maxParticipants) {
             initialStatus = RegistrationStatus.WAITLISTED;
        }

        if (registrationRepository.existsByStudentAndEvent(student, event)) {
            throw new RuntimeException("Already registered for this event");
        }

        Registration registration = Registration.builder()
                .student(student)
                .event(event)
                .utrNumber(request.getUtrNumber())
                .paymentScreenshot(request.getPaymentScreenshot())
                .status(initialStatus)
                .build();

        registrationRepository.save(registration);

        notificationService.createNotification(
                event.getAdmin(),
                "New registration from " + student.getName() + " for event: " + event.getTitle(),
                "INFO"
        );
    }

    public List<EventResponse> getStudentRegistrations(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return registrationRepository.findByStudent(student).stream()
                .map(reg -> {
                    EventResponse response = mapToResponse(reg.getEvent());
                    response.setRegistrationStatus(reg.getStatus() != null ? reg.getStatus().name() : "PENDING");
                    response.setRegistrationId(reg.getId());
                    response.setCertificateClaimed(reg.isCertificateClaimed());
                    response.setCertificateGranted(reg.isCertificateGranted());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public byte[] claimCertificatePdf(Long registrationId, String studentEmail) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getStudent().getEmail().equals(studentEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        if (!registration.isCertificateGranted()) {
            throw new RuntimeException("Certificate not granted yet");
        }

        if (!registration.isCertificateClaimed()) {
            registration.setCertificateClaimed(true);
            registrationRepository.save(registration);
        }

        try {
            Document document = new Document(PageSize.A4.rotate());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter writer = PdfWriter.getInstance(document, out);
            document.open();
            
            // Draw Border
            PdfContentByte canvas = writer.getDirectContent();
            canvas.setLineWidth(3f);
            canvas.setColorStroke(BaseColor.DARK_GRAY);
            canvas.rectangle(20, 20, PageSize.A4.getHeight() - 40, PageSize.A4.getWidth() - 40);
            canvas.stroke();
            
            canvas.setLineWidth(1f);
            canvas.setColorStroke(BaseColor.GRAY);
            canvas.rectangle(25, 25, PageSize.A4.getHeight() - 50, PageSize.A4.getWidth() - 50);
            canvas.stroke();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, BaseColor.DARK_GRAY);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 18, BaseColor.GRAY);
            Font nameFont = FontFactory.getFont(FontFactory.TIMES_BOLDITALIC, 32, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.BLACK);
            Font dateFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 12, BaseColor.GRAY);

            // Content
            document.add(new Paragraph("\n\n\n")); // Spacing

            Paragraph title = new Paragraph("CERTIFICATE OF PARTICIPATION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\n"));

            Paragraph subTitle = new Paragraph("PROUDLY PRESENTED BY NEXUSEVENTS TO", subTitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subTitle);

            document.add(new Paragraph("\n\n"));

            Paragraph name = new Paragraph(registration.getStudent().getName().toUpperCase(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);

            document.add(new Paragraph("\n"));

            Paragraph description = new Paragraph("for successfully participating and demonstrating excellent skills in", normalFont);
            description.setAlignment(Element.ALIGN_CENTER);
            document.add(description);

            document.add(new Paragraph("\n"));

            Paragraph eventName = new Paragraph(registration.getEvent().getTitle(), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BaseColor.BLACK));
            eventName.setAlignment(Element.ALIGN_CENTER);
            document.add(eventName);

            document.add(new Paragraph("\n\n"));

            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy");
            String formattedDate = registration.getEvent().getEventDate() != null 
                    ? registration.getEvent().getEventDate().format(formatter) 
                    : "TBD";
            Paragraph date = new Paragraph("Date of Event: " + formattedDate, dateFont);
            date.setAlignment(Element.ALIGN_CENTER);
            document.add(date);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
    
    public List<ParticipantResponse> getEventParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        return registrationRepository.findByEvent(event).stream()
                .map(reg -> ParticipantResponse.builder()
                        .registrationId(reg.getId())
                        .name(reg.getStudent().getName())
                        .email(reg.getStudent().getEmail())
                        .role(reg.getStudent().getRole().name())
                        .registeredDate(reg.getRegisteredAt() != null ? reg.getRegisteredAt().format(DATE_FORMATTER) : "N/A")
                        .utrNumber(reg.getUtrNumber())
                        .paymentScreenshot(reg.getPaymentScreenshot())
                        .status(reg.getStatus() != null ? reg.getStatus().name() : "PENDING")
                        .certificateGranted(reg.isCertificateGranted())
                        .build())
                .collect(Collectors.toList());
    }

    public void verifyRegistration(Long registrationId, boolean verified, String adminEmail) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getEvent().getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Not authorized to verify this registration");
        }

        registration.setStatus(verified ? RegistrationStatus.VERIFIED : RegistrationStatus.REJECTED);
        registrationRepository.save(registration);

        String message = verified ? "Your registration for '" + registration.getEvent().getTitle() + "' was verified!" 
                                  : "Your registration for '" + registration.getEvent().getTitle() + "' was rejected.";
        String type = verified ? "SUCCESS" : "ALERT";
        notificationService.createNotification(registration.getStudent(), message, type);
    }

    public void grantCertificate(Long registrationId, String adminEmail) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getEvent().getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Not authorized to grant certificate for this registration");
        }

        if (registration.getStatus() != RegistrationStatus.VERIFIED) {
            throw new RuntimeException("Certificate can only be granted for verified registrations");
        }

        registration.setCertificateGranted(true);
        registrationRepository.save(registration);

        notificationService.createNotification(
                registration.getStudent(),
                "Your certificate for '" + registration.getEvent().getTitle() + "' is ready to download!",
                "SUCCESS"
        );
    }
    
    public EventResponse updateEvent(Long eventId, EventRequest request, String adminEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Not authorized to update this event");
        }

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getVenue() != null) event.setVenue(request.getVenue());
        if (request.getEventDate() != null) event.setEventDate(request.getEventDate());
        if (request.getCategory() != null) event.setCategory(request.getCategory());
        if (request.getMaxParticipants() != null) event.setMaxParticipants(request.getMaxParticipants());
        if (request.getImage() != null) event.setImage(request.getImage());
        if (request.getPaymentScanner() != null) event.setPaymentScanner(request.getPaymentScanner());
        if (request.getFee() != null) event.setFee(request.getFee());

        eventRepository.save(event);
        return mapToResponse(event);
    }

    public EventResponse closeEvent(Long eventId, String adminEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        if (!event.getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Not authorized to close this event");
        }
        
        event.setStatus(EventStatus.CLOSED);
        eventRepository.save(event);
        return mapToResponse(event);
    }

    public ReportResponse getAdminReports(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        List<Event> adminEvents = eventRepository.findByAdmin(admin);
        
        List<EventParticipationDTO> participation = new ArrayList<>();
        Map<String, Integer> monthlyCounts = new LinkedHashMap<>();
        
        // Initialize last 6 months to 0 (or all 12 months)
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (String m : months) {
            monthlyCounts.put(m, 0);
        }

        for (Event event : adminEvents) {
            List<Registration> eventRegs = registrationRepository.findByEvent(event);
            participation.add(new EventParticipationDTO(event.getTitle(), eventRegs.size()));
            
            for (Registration reg : eventRegs) {
                if (reg.getRegisteredAt() != null) {
                    Month month = reg.getRegisteredAt().getMonth();
                    String monthName = month.name().substring(0, 3);
                    monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1).toLowerCase();
                    monthlyCounts.put(monthName, monthlyCounts.getOrDefault(monthName, 0) + 1);
                }
            }
        }
        
        List<MonthlyTrendDTO> trends = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : monthlyCounts.entrySet()) {
            trends.add(new MonthlyTrendDTO(entry.getKey(), entry.getValue()));
        }
        
        // Sort participation by value descending
        participation.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));

        return new ReportResponse(trends, participation);
    }

    private EventResponse mapToResponse(Event event) {
        int count = registrationRepository.findByEvent(event).size();
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .date(event.getEventDate().format(DATE_FORMATTER))
                .time(event.getEventDate().format(TIME_FORMATTER))
                .status(event.getStatus().name())
                .adminName(event.getAdmin().getName())
                .collegeName(event.getAdmin().getCollegeName() != null ? event.getAdmin().getCollegeName() : "Unknown College")
                .category(event.getCategory() != null ? event.getCategory() : "General")
                .image(event.getImage())
                .paymentScanner(event.getPaymentScanner())
                .fee(event.getFee())
                .maxParticipants(event.getMaxParticipants())
                .registeredCount(count)
                .build();
    }
}
