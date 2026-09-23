package br.com.norte.norte_api.catalog;

public record CareerAreaResponse(
        Long id,
        String code,
        String name,
        String description
) {

    public static CareerAreaResponse from(CareerArea area) {
        return new CareerAreaResponse(area.getId(), area.getCode(), area.getName(),
                area.getDescription());
    }
}
