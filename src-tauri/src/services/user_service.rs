use crate::{
    db::Database,
    error::AppResult,
    models::{User, UpdateUserDto},
};

pub struct UserService {
    db: Database,
}

impl UserService {
    pub fn new(db: Database) -> Self {
        Self { db }
    }
    
    pub async fn get_user(&self, user_id: &str) -> AppResult<User> {
        let user = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE id = ?"
        )
        .bind(user_id)
        .fetch_one(self.db.pool())
        .await?;
        
        Ok(user)
    }
    
    pub async fn create_user(&self, email: String, name: String) -> AppResult<User> {
        let user = User::new(email, name);
        
        sqlx::query(
            "INSERT INTO users (id, email, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&user.id)
        .bind(&user.email)
        .bind(&user.name)
        .bind(&user.created_at)
        .bind(&user.updated_at)
        .execute(self.db.pool())
        .await?;
        
        Ok(user)
    }
    
    pub async fn update_user(&self, user_id: &str, dto: UpdateUserDto) -> AppResult<User> {
        let mut user = self.get_user(user_id).await?;
        
        if let Some(name) = dto.name {
            user.name = name;
        }
        
        if let Some(email) = dto.email {
            user.email = email;
        }
        
        user.update_timestamp();
        
        sqlx::query(
            "UPDATE users SET email = ?, name = ?, updated_at = ? WHERE id = ?"
        )
        .bind(&user.email)
        .bind(&user.name)
        .bind(&user.updated_at)
        .bind(&user.id)
        .execute(self.db.pool())
        .await?;
        
        Ok(user)
    }
}