package com.currency_converter.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record ExternalApiResponse(
        String result,
        @JsonProperty("conversion_rates") Map<String, Double> conversionRates
) {}