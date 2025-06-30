use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
#[allow(dead_code)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("Not found: {0}")]
    NotFound(String),
}

// Type alias for our Result type
pub type AppResult<T> = Result<T, AppError>;

// Safe error type for frontend communication
#[derive(Serialize)]
pub struct FrontendError {
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,
}

impl From<AppError> for FrontendError {
    fn from(err: AppError) -> Self {
        // Log the detailed error for backend debugging
        log::error!("Application error occurred: {:?}", err);
        
        // Return a safe, generic message to the frontend
        let (message, code) = match err {
            AppError::NotFound(msg) => (msg, Some("NOT_FOUND".to_string())),
            AppError::Database(e) => {
                match e {
                    sqlx::Error::RowNotFound => ("Note not found".to_string(), Some("NOT_FOUND".to_string())),
                    _ => ("A database error occurred. Please try again.".to_string(), Some("DATABASE_ERROR".to_string())),
                }
            }
        };
        
        FrontendError { message, code }
    }
}

impl From<sqlx::Error> for FrontendError {
    fn from(err: sqlx::Error) -> Self {
        AppError::Database(err).into()
    }
}