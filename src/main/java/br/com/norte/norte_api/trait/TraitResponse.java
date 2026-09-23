package br.com.norte.norte_api.trait;

public record TraitResponse(
        Long id,
        String code,
        String name,
        String description
) {

    public static TraitResponse from(Trait trait) {
        return new TraitResponse(trait.getId(), trait.getCode(), trait.getName(), trait.getDescription());
    }
}
