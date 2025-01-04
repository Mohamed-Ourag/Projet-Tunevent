package org.sid.demodd.Repositories;

import org.sid.demodd.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepositories extends MongoRepository<User,String> {
    Optional<User> findByEmail(String email);

    // Récupérer tous les utilisateurs ayant un rôle spécifique
    List<User> findByRole(String role);
}

