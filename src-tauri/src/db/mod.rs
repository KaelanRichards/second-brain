use sqlx::{sqlite::SqlitePool, Pool, Sqlite};
use std::sync::Arc;

pub mod migrations;

pub struct Database {
    pool: Arc<Pool<Sqlite>>,
}

impl Database {
    pub async fn new(database_path: &str) -> Result<Self, sqlx::Error> {
        // Create database if it doesn't exist
        let pool = SqlitePool::connect_with(
            sqlx::sqlite::SqliteConnectOptions::new()
                .filename(database_path)
                .create_if_missing(true)
        ).await?;
        
        // Run migrations
        sqlx::migrate!("./migrations")
            .run(&pool)
            .await
            .map_err(|e| {
                log::error!("Failed to run database migrations: {}", e);
                e
            })?;
        
        Ok(Self {
            pool: Arc::new(pool),
        })
    }
    
    pub fn pool(&self) -> &Pool<Sqlite> {
        &self.pool
    }
}

impl Clone for Database {
    fn clone(&self) -> Self {
        Self {
            pool: Arc::clone(&self.pool),
        }
    }
}