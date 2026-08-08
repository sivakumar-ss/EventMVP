package com.mvp.event.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.mvp.event.entity.Event;
import com.mvp.event.entity.User;
import com.mvp.event.exception.ResourceNotFoundException;
import com.mvp.event.repository.EventRepository;
import com.mvp.event.repository.RegistrationRepository;
import com.mvp.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("dd MMMM yyyy");

    public byte[] generateCertificate(Long studentId, Long eventId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        if (!registrationRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new ResourceNotFoundException("You are not registered for this event");
        }

        try {
            return buildPdf(student, event);
        } catch (DocumentException e) {
            log.error("PDF generation failed", e);
            throw new RuntimeException("Failed to generate certificate");
        }
    }

    private byte[] buildPdf(User student, Event event) throws DocumentException {
        Document document = new Document(PageSize.A4.rotate(), 50, 50, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, out);
        document.open();

        // Border
        PdfContentByte canvas = writer.getDirectContent();
        canvas.setColorStroke(new BaseColor(63, 81, 181));
        canvas.setLineWidth(6f);
        canvas.rectangle(20, 20, document.getPageSize().getWidth() - 40, document.getPageSize().getHeight() - 40);
        canvas.stroke();

        // Inner border
        canvas.setColorStroke(new BaseColor(173, 216, 230));
        canvas.setLineWidth(2f);
        canvas.rectangle(28, 28, document.getPageSize().getWidth() - 56, document.getPageSize().getHeight() - 56);
        canvas.stroke();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 36, new BaseColor(63, 81, 181));
        Paragraph title = new Paragraph("Certificate of Participation", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(40);
        title.setSpacingAfter(20);
        document.add(title);

        // Subtitle
        Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.DARK_GRAY);
        Paragraph sub = new Paragraph("This is to certify that", subFont);
        sub.setAlignment(Element.ALIGN_CENTER);
        sub.setSpacingAfter(10);
        document.add(sub);

        // Student name
        Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, new BaseColor(30, 30, 30));
        Paragraph name = new Paragraph(student.getFullName(), nameFont);
        name.setAlignment(Element.ALIGN_CENTER);
        name.setSpacingAfter(10);
        document.add(name);

        // Body text
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.DARK_GRAY);
        Paragraph body = new Paragraph("has successfully participated in the event", bodyFont);
        body.setAlignment(Element.ALIGN_CENTER);
        body.setSpacingAfter(14);
        document.add(body);

        // Event name
        Font eventFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new BaseColor(63, 81, 181));
        Paragraph eventName = new Paragraph(event.getTitle(), eventFont);
        eventName.setAlignment(Element.ALIGN_CENTER);
        eventName.setSpacingAfter(10);
        document.add(eventName);

        // Date & venue
        Font detailFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.GRAY);
        String details = String.format("Held on %s  |  Venue: %s",
                event.getEventDate().format(DATE_FMT), event.getVenue());
        Paragraph detailPara = new Paragraph(details, detailFont);
        detailPara.setAlignment(Element.ALIGN_CENTER);
        detailPara.setSpacingAfter(60);
        document.add(detailPara);

        // Signature line
        Paragraph sig = new Paragraph("_________________________", bodyFont);
        sig.setAlignment(Element.ALIGN_CENTER);
        sig.setSpacingAfter(4);
        document.add(sig);
        Paragraph sigLabel = new Paragraph("Authorized Signatory", detailFont);
        sigLabel.setAlignment(Element.ALIGN_CENTER);
        document.add(sigLabel);

        document.close();
        return out.toByteArray();
    }
}
