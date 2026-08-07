package com.currency_converter.model;

public record ConversionResponse(
        String from,
        String to,
        double amount,
        double convertedAmount,
        double exchangeRate
) {}