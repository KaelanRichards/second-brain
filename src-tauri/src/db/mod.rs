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
        
        // Run migrations manually for now
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY NOT NULL,
                email TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            "#
        )
        .execute(&pool)
        .await?;
        
        sqlx::query(
            r#"
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
            "#
        )
        .execute(&pool)
        .await?;
        
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY NOT NULL,
                value TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            "#
        )
        .execute(&pool)
        .await?;
        
        sqlx::query(
            r#"
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY NOT NULL,
                date TEXT NOT NULL UNIQUE,
                content TEXT NOT NULL,
                word_count INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            "#
        )
        .execute(&pool)
        .await?;
        
        sqlx::query(
            r#"
            CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date)
            "#
        )
        .execute(&pool)
        .await?;
        
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