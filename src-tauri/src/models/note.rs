use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Note {
    pub id: String,
    pub date: String, // YYYY-MM-DD format
    pub content: String,
    #[serde(rename = "wordCount")]
    pub word_count: i32,
    #[serde(rename = "createdAt")]
    pub created_at: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateNoteDto {
    pub date: String,
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateNoteDto {
    pub content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoteMetadata {
    pub id: String,
    pub date: String,
    #[serde(rename = "wordCount")]
    pub word_count: i32,
    pub preview: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}

impl Note {
    pub fn new(date: String, content: String) -> Self {
        let now = Utc::now().to_rfc3339();
        let word_count = content.split_whitespace().count() as i32;
        
        Self {
            id: uuid::Uuid::new_v4().to_string(),
            date,
            content,
            word_count,
            created_at: now.clone(),
            updated_at: now,
        }
    }
    
    pub fn update_content(&mut self, content: String) {
        self.content = content;
        self.word_count = self.content.split_whitespace().count() as i32;
        self.updated_at = Utc::now().to_rfc3339();
    }
    
    pub fn to_metadata(&self) -> NoteMetadata {
        let preview = self.get_preview(100);
        
        NoteMetadata {
            id: self.id.clone(),
            date: self.date.clone(),
            word_count: self.word_count,
            preview,
            updated_at: self.updated_at.clone(),
        }
    }
    
    fn get_preview(&self, length: usize) -> String {
        let cleaned = self.content.replace('\n', " ").trim().to_string();
        if cleaned.len() > length {
            format!("{}...", &cleaned[..length])
        } else {
            cleaned
        }
    }
}