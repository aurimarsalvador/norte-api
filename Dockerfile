# Build em duas etapas: a imagem final leva so o JRE e o jar, sem Maven nem codigo-fonte.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# As dependencias mudam muito menos que o codigo; resolvidas em uma camada propria, o
# rebuild depois de editar uma classe nao volta a baixar a internet inteira.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# Nao rodar como root: se o processo for comprometido, o alcance dentro do container e menor.
RUN addgroup -S norte && adduser -S norte -G norte
USER norte

COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
