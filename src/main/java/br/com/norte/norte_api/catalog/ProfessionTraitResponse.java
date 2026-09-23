package br.com.norte.norte_api.catalog;

/**
 * Um trait exigido pela profissao e o quanto ele pesa no dia a dia dela, de 1 a 5.
 */
public record ProfessionTraitResponse(
        Long traitId,
        String code,
        String name,
        String description,
        Integer weight
) {

    public static ProfessionTraitResponse from(ProfessionTrait professionTrait) {
        return new ProfessionTraitResponse(
                professionTrait.getTrait().getId(),
                professionTrait.getTrait().getCode(),
                professionTrait.getTrait().getName(),
                professionTrait.getTrait().getDescription(),
                professionTrait.getWeight()
        );
    }
}
