package com.currency_converter.model;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConversionResponse {
    private String from;
    private String to;
    private double amount;
    private double convertedAmount;
    private double exchangeRate;
}

