package com.mvp.event.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String venue;

    @NotNull
    @Future
    private LocalDateTime eventDate;

    @NotNull
    private LocalDateTime registrationDeadline;
}
