package br.com.norte.norte_api.microexperience;

public record MicroExperienceView(
        Long id,
        Long professionId,
        String professionName,
        String title,
        String instructions,
        Integer estimatedMinutes
) {

    public static MicroExperienceView from(MicroExperience microExperience) {
        return new MicroExperienceView(
                microExperience.getId(),
                microExperience.getProfession().getId(),
                microExperience.getProfession().getName(),
                microExperience.getTitle(),
                microExperience.getInstructions(),
                microExperience.getEstimatedMinutes()
        );
    }
}
