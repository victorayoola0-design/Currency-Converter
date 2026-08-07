package com.currency_converter.service;

import com.currency_converter.model.ConversionResponse;
import com.currency_converter.model.ExternalApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CurrencyService {
    private final RestClient restClient;

    @Value("${api.baseUrl}")
    private String baseUrl;

    @Value("${api.key}")
    private String apiKey;

    public CurrencyService(RestClient restClient){
        this.restClient = restClient;
    }

    public ConversionResponse convert(String from, String to, double amount){
        String url = baseUrl + apiKey + "/latest/" + from.toUpperCase();

        ExternalApiResponse apiResponse = restClient.get().uri(url).retrieve().body(ExternalApiResponse.class);
        if (apiResponse == null || !"success".equals(apiResponse.result())) {
            throw new RuntimeException("Failed to fetch exchange rates from external provider.");
        }
        Double rate = apiResponse.conversionRates().get(to.toUpperCase());
        if (rate == null){
            throw new IllegalArgumentException("Invalid target currency code: " + to);
        }
        double convertedAmount = amount * rate;
        return new ConversionResponse(from.toUpperCase(), to.toUpperCase(), amount, convertedAmount, rate);
    }
}