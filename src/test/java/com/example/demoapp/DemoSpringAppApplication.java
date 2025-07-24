package com.example.demoapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = DemoSpringAppApplication.class)
public class DemoSpringAppApplication {
      public static void main(String[] args) {
          SpringApplication.run(DemoSpringAppApplication.class, args);
      }
  }