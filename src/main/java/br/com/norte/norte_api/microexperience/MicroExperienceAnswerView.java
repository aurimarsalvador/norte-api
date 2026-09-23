package br.com.norte.norte_api.microexperience;

import java.time.Instant;

public record MicroExperienceAnswerView(
        Long id,
        Long microExperienceId,
        String microExperienceTitle,
        Long professionId,
        String professionName,
        Integer enjoymentRating,
        Integer difficultyRating,
        String notes,
        Instant respondedAt
) {

    public static MicroExperienceAnswerView from(MicroExperienceResponse response) {
        MicroExperience experience = response.getMicroExperience();
        return new MicroExperienceAnswerView(
                response.getId(),
                experience.getId(),
                experience.getTitle(),
                experience.getProfession().getId(),
                experience.getProfession().getName(),
                response.getEnjoymentRating(),
                response.getDifficultyRating(),
                response.getNotes(),
                response.getRespondedAt()
        );
    }
}
