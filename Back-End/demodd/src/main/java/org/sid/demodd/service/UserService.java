package org.sid.demodd.service;

import org.sid.demodd.Repositories.UserRepositories;
import org.sid.demodd.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepositories userRepositories;

    public User saveUser(User user) {
        return userRepositories.save(user);
    }

    public User getUserById(String id) {
        return userRepositories.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public List<User> getAllUsers() {
        return userRepositories.findAll();
    }

    public User updateUser(String id, User user) {
        User existingUser = getUserById(id);
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        // Mettez à jour d'autres champs si nécessaire
        return userRepositories.save(existingUser);
    }

    public void deleteUser(String id) {
        userRepositories.deleteById(id);
    }
}
