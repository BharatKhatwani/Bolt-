export const basePrompt = `<boltArtifact id="project-import" title="Java Spring Boot Starter Project">

<boltAction type="file" filePath="pom.xml">
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>springboot-demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    <name>springboot-demo</name>

    <properties>
        <java.version>17</java.version>
        <spring.boot.version>3.3.1</spring.boot.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Lombok (Optional for cleaner code) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
</boltAction>

<boltAction type="file" filePath="src/main/java/com/example/demo/DemoApplication.java">
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
</boltAction>

<boltAction type="file" filePath="src/main/java/com/example/demo/controller/HelloController.java">
package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

  @GetMapping("/")
  public String home() {
    return "Hello from Spring Boot!";
  }

  @GetMapping("/api/message")
  public String message() {
    return "Spring Boot API working perfectly 🚀";
  }
}
</boltAction>

<boltAction type="file" filePath="src/main/resources/application.properties">
# Spring Boot application properties
server.port=8080
spring.application.name=SpringBootDemo
</boltAction>

<boltAction type="file" filePath=".gitignore">
target/
*.iml
.idea/
*.class
logs/
</boltAction>

<boltAction type="file" filePath="README.md">
# 🚀 Spring Boot Starter Project

This is a simple **Spring Boot** project.

### ▶️ Run Instructions
1. Install Java 17+
2. Run:
   \`\`\`bash
   mvn spring-boot:run
   \`\`\`
3. Visit [http://localhost:8080](http://localhost:8080)
</boltAction>

</boltArtifact>`;
