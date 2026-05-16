package com.traineasy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Configuração do Cloudinary.
 * Expõe as credenciais e um RestTemplate para as chamadas à Admin API.
 */
@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getCloudName() {
        return cloudName;
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getApiSecret() {
        return apiSecret;
    }

    /**
     * URL base da Admin API do Cloudinary.
     */
    public String getAdminApiBaseUrl() {
        return "https://api.cloudinary.com/v1_1/" + cloudName;
    }

    /**
     * URL base para delivery de recursos (vídeos, imagens, etc.).
     */
    public String getDeliveryBaseUrl() {
        return "https://res.cloudinary.com/" + cloudName;
    }
}
