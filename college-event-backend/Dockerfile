# ── Stage 1: Build the JAR ─────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Stricter memory limits for build
ENV JAVA_TOOL_OPTIONS="-Xmx200m -Xss512k -XX:MaxMetaspaceSize=128m"
ENV MAVEN_OPTS="-Xmx200m"

# Copy pom.xml and download dependencies first (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -q

# ── Stage 2: Run the JAR ───────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/college-event-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx200m", "-Xss512k", "-XX:MaxMetaspaceSize=128m", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
