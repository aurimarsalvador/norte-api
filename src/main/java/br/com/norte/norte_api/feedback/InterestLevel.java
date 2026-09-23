package br.com.norte.norte_api.feedback;

/**
 * Como o estudante reagiu a uma profissao depois de conhece-la.
 *
 * <p>Nao e nota nem ranking: e marcador de exploracao. NOT_INTERESTED significa "ja olhei e
 * nao me interessou", que e uma descoberta tao util quanto o favorito.
 */
public enum InterestLevel {

    FAVORITE,
    NEUTRAL,
    NOT_INTERESTED
}
