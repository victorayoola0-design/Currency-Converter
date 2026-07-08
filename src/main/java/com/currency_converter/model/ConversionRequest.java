package com.currency_converter.model;

import lombok.Data;

@Data
public class ConversionRequest {
        private String from;
        private String to;
        private double amount;
}
