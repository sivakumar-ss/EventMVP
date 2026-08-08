import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Element;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.Paragraph;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

public class TestPdf {
    public static void main(String[] args) {
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

            document.add(new Paragraph("\n\n\n"));
            Paragraph title = new Paragraph("CERTIFICATE OF PARTICIPATION", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            
            document.add(new Paragraph("\n"));
            Paragraph name = new Paragraph("TEST STUDENT", nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);

            document.add(new Paragraph("\n"));
            Paragraph eventName = new Paragraph("TEST EVENT", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BaseColor.BLACK));
            eventName.setAlignment(Element.ALIGN_CENTER);
            document.add(eventName);

            java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy");
            String formattedDate = LocalDateTime.now().format(formatter);
            Paragraph date = new Paragraph("Date of Event: " + formattedDate, dateFont);
            date.setAlignment(Element.ALIGN_CENTER);
            document.add(date);

            document.close();
            System.out.println("Success! Size: " + out.size());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
