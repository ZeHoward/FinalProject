package tw.luna.FinalTest.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tw.luna.FinalTest.model.UserFavoritesRecipes;
import tw.luna.FinalTest.model.UserFavoritesRecipesId;

import java.util.List;

@Repository
public interface UserFavoritesRecipesRepository extends JpaRepository<UserFavoritesRecipes, UserFavoritesRecipesId> {

    List<UserFavoritesRecipes> findByIdUserId(Long userId);

    void deleteByIdUserIdAndIdRecipeId(Long userId, int recipeId);
}
