package com.ragab.booking.api.admin.service;

import com.ragab.booking.api.admin.dto.UserSearchResponse;
import com.ragab.booking.common.response.PageResponse;
import com.ragab.booking.core.user.mapper.UserMapper;
import com.ragab.booking.core.user.model.Users;
import com.ragab.booking.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class AdminService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public PageResponse<UserSearchResponse> searchUserByEmail(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        Page<Users> usersPage = userRepository.findByEmailContainingIgnoreCase(email, pageable);
        List<UserSearchResponse> userSearchResponses = usersPage.stream()
                .map(userMapper::toSearchResponse)
                .toList();

        return new PageResponse<>(
                userSearchResponses,
                usersPage.getNumber(),
                usersPage.getSize(),
                usersPage.getTotalElements(),
                usersPage.getTotalPages(),
                usersPage.isFirst(),
                usersPage.isLast()
        );
    }

    @Transactional
    public UserSearchResponse updateUserRoles(Integer id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));

        user.setAdmin(!user.isAdmin());
        Users savedUser = userRepository.save(user);
        return userMapper.toSearchResponse(savedUser);
    }
}
