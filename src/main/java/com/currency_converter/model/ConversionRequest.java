package com.currency_converter.model;

import com.fasterxml.jackson.annotation.JsonAlias;

public record ConversionRequest(
        @JsonAlias({"fromCurrency", "from"}) String from,
        @JsonAlias({"toCurrency", "to"}) String to,
        double amount
) {}