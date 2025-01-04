package org.sid.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class JwtUtil {

    // Add your public key here
    private static final String PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo6/LWTStb7IZvL6C7JkTM5DUAOcroLYoUkcIv127La5nUpD4qGjt11l/TPc6HleJ/zx1E98t51q6bWgzyxJh/foUoZ4Lw+QpwSUwomNCRAZzjmoQx3EEY5RkVZunHQcIDjbu+7dkiJo4NIG1G7rG7JSrkqf5KVqcU+icdkSkXlwlxg/UVYoL3mu9NRfxag6HQD9NMWCJ51ApP8ox9KZ5HoOSX9dzIgfedwb06z9AacgbI9qR+0H3Vmim6JPTMFCVU+OGjd4n73x/JdgPJfEGl69D3OGp+6x2oGqQSTdzn7cOzdThpxSKmlQW5jWHOvG25HD58Uin8lU4FrkWMzdhrwIDAQAB";

    /**
     * Extract the user ID from a JWT token signed with RS256 (Asymmetric Key).
     *
     * @param token The JWT token.
     * @return The user ID (subject) extracted from the token.
     */
    public String extractUserId(String token, String base64PublicKey) {
        try {
            System.out.println("Extracting user ID...");
            debugToken(token);

            // Preprocess the token for URL-safe Base64
            token = preprocessJwt(token);

            // Extract claims using the public key
            Claims claims = extractClaims(token, base64PublicKey);

            // Log claims for debugging
            System.out.println("Extracted Claims: " + claims);

            // Return the user ID or subject
            return claims.getSubject();
        } catch (JwtException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Failed to extract user ID from token: " + e.getMessage(), e);
        }
    }


    /**
     * Extract claims from a JWT token signed with RS256 (Asymmetric Key).
     *
     * @param token The JWT token.
     * @return The claims extracted from the token.
     */
    public Claims extractClaims(String token, String base64PublicKey) {
        try {
            // Parse the token
            return Jwts.parserBuilder()
                    .setSigningKey(getPublicKey(base64PublicKey))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new IllegalArgumentException("Failed to extract claims from token: " + e.getMessage(), e);
        }
    }



    /**
     * Decode the public key from Base64 format.
     *
     * @param base64PublicKey The public key in Base64 format.
     * @return The decoded PublicKey object.
     */
    public PublicKey getPublicKey(String base64PublicKey) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(base64PublicKey);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePublic(spec);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate public key: " + e.getMessage(), e);
        }
    }


    /**
     * Preprocess the JWT token for proper Base64 decoding.
     *
     * @param token The JWT token.
     * @return The processed token.
     */
    private String preprocessJwt(String token) {
        try {
            System.out.println("Preprocessing JWT token...");
            // Replace URL-unsafe characters
            String base64UrlEncodedToken = token.replace('-', '+').replace('_', '/');
            // Add padding if necessary
            int paddingLength = (4 - base64UrlEncodedToken.length() % 4) % 4;
            base64UrlEncodedToken += "=".repeat(paddingLength);
            return token.replace('+', '-').replace('/', '_').replace("=", "");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error preprocessing token: " + e.getMessage(), e);
        }
    }






    /**
     * Debug and print the JWT token's header and payload.
     *
     * @param token The JWT token.
     */
    private void debugToken(String token) {
        try {
            System.out.println("Debugging JWT token...");
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                System.out.println("Invalid token format.");
                return;
            }

            // Decode header and payload
            String header = new String(Base64.getDecoder().decode(parts[0]));
            String payload = new String(Base64.getDecoder().decode(parts[1]));

            System.out.println("JWT Header: " + header);
            System.out.println("JWT Payload: " + payload);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error debugging token: " + e.getMessage(), e);
        }
    }
}
