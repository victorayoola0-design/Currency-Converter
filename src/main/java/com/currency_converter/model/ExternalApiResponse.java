package com.currency_converter.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
public class ExternalApiResponse {
    private String result;

    @JsonProperty("conversion_rates")
    private Map<String, Double> conversionRates;
}
