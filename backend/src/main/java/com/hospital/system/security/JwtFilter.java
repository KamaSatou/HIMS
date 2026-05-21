package com.hospital.system.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String token = extractToken(req);
        System.out.println("[JwtFilter] Extracted token: " + (token != null ? "present (len " + token.length() + ")" : "null"));
        if (StringUtils.hasText(token)) {
            try {
                boolean isValid = jwtUtil.validateToken(token);
                System.out.println("[JwtFilter] Token validation result: " + isValid);
                if (isValid) {
                    String username = jwtUtil.getUsernameFromToken(token);
                    System.out.println("[JwtFilter] Username from token: " + username);
                    UserDetails user = userDetailsService.loadUserByUsername(username);
                    var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("[JwtFilter] Authenticated user: " + username + " with roles " + user.getAuthorities());
                }
            } catch (Exception e) {
                System.err.println("[JwtFilter] Error authenticating token: " + e.getMessage());
                e.printStackTrace();
            }
        }
        chain.doFilter(req, res);
    }

    private String extractToken(HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}