package com.postgresql.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // extracting a specific claim from the token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // generate a token without having to use extraClaims
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // generate token
    // Map -> will contain the claim(s) that are to be added to the token
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
            ) {
        return Jwts
                .builder()
                // set claims of the token
                .setClaims(extraClaims)
                // for Spring the "unique" part is always called username, DON'T GET CONFUSED
                .setSubject(userDetails.getUsername())
                // when the token is created, help us in order to calculate the expiration date or check if the tokem is valid or not
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // how long this token should be valid
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                // which key to use in order to sign the token
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                // generate and return the token
                .compact();
    }

    // validates the token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // if the email contained in the token is the same as the one of the UserDetails's && token is not expired
        return (username.equals((userDetails.getUsername()))) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        // get all the claims inside the token
        return Jwts
                // parse the token
                .parserBuilder()
                // give the signing key in order to decode the token
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
