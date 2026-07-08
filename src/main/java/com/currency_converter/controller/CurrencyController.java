package com.currency_converter.controller;

import com.currency_converter.model.ConversionRequest;
import com.currency_converter.model.ConversionResponse;
import com.currency_converter.service.CurrencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "*")
public class CurrencyController {
    public final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService){
    this.currencyService = currencyService;
    }
    @PostMapping("/convert")
    public ResponseEntity<ConversionResponse> convert(@RequestBody ConversionRequest request){
        System.out.println("Backend hit! From: " + request.getFrom() + ", To: " + request.getTo() + ", Amount: " + request.getAmount());
        ConversionResponse response = currencyService.convert(request.getFrom(), request.getTo(), request.getAmount());
        return  ResponseEntity.ok(response);
    }
}