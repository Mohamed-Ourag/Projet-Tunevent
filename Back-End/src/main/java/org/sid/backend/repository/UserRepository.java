package org.sid.backend.repository;

import org.sid.backend.model.Event;
import org.sid.backend.model.Role;
import org.sid.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends MongoRepository<User,String> {
    // Rechercher un utilisateur par email
    Optional<User> findByEmail(String email);

    // Récupérer tous les utilisateurs ayant un rôle spécifique
    List<User> findByRole(Role role);


}
