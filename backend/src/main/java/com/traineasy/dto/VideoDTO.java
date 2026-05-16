package com.traineasy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VideoDTO {
    private String nomeExercicio;
    private String categoria;
    private String videoUrl;
    private String thumbnailUrl;
}
