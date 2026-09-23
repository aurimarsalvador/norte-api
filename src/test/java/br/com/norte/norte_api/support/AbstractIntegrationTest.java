package br.com.norte.norte_api.support;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Base de todos os testes de integracao.
 *
 * <p>O container e {@code static} e nao declara {@code @Testcontainers}/{@code @Container} de
 * proposito: assim o JUnit nao o para entre classes e a suite inteira reaproveita um unico
 * Postgres, pago uma vez. As migrations Flyway reais rodam contra ele, que e o ponto de usar
 * Postgres de verdade em vez de H2.
 *
 * <p>Requer Docker ativo na maquina.
 */
@SpringBootTest
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    @ServiceConnection
    static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer("postgres:17-alpine");

    static {
        POSTGRES.start();
    }
}
