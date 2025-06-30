use crate::db::Database;
use crate::models::{Note, CreateNoteDto, UpdateNoteDto, NoteMetadata};
use crate::error::{AppError, AppResult};

pub struct NoteService {
    db: Database,
}

impl NoteService {
    pub fn new(db: Database) -> Self {
        Self { db }
    }

    #[allow(dead_code)]
    pub async fn create_note(&self, dto: CreateNoteDto) -> AppResult<Note> {
        let note = Note::new(dto.date.clone(), dto.content);
        
        sqlx::query(
            r#"
            INSERT INTO notes (id, date, content, word_count, created_at, updated_at)
            VALUES (?1, ?2, ?3, ?4, ?5, ?6)
            "#
        )
        .bind(&note.id)
        .bind(&note.date)
        .bind(&note.content)
        .bind(&note.word_count)
        .bind(&note.created_at)
        .bind(&note.updated_at)
        .execute(self.db.pool())
        .await?;
        
        Ok(note)
    }

    pub async fn get_note(&self, date: &str) -> AppResult<Option<Note>> {
        let note = sqlx::query_as::<_, Note>(
            r#"
            SELECT id, date, content, word_count, created_at, updated_at
            FROM notes
            WHERE date = ?1
            "#
        )
        .bind(date)
        .fetch_optional(self.db.pool())
        .await?;
        
        Ok(note)
    }

    #[allow(dead_code)]
    pub async fn update_note(&self, date: &str, dto: UpdateNoteDto) -> AppResult<Note> {
        // First get the existing note
        let mut note = self.get_note(date)
            .await?
            .ok_or_else(|| AppError::NotFound(format!("Note not found for date: {}", date)))?;
        
        // Update the content
        note.update_content(dto.content);
        
        // Update in database
        sqlx::query(
            r#"
            UPDATE notes
            SET content = ?1, word_count = ?2, updated_at = ?3
            WHERE date = ?4
            "#
        )
        .bind(&note.content)
        .bind(&note.word_count)
        .bind(&note.updated_at)
        .bind(&note.date)
        .execute(self.db.pool())
        .await?;
        
        Ok(note)
    }

    pub async fn save_note(&self, date: String, content: String) -> AppResult<Note> {
        // Create or update note using SQLite's ON CONFLICT clause for atomic upsert
        let note = Note::new(date.clone(), content.clone());
        
        // Check if this is an update by trying to get the existing note first
        let existing_note = self.get_note(&date).await?;
        
        if let Some(mut existing) = existing_note {
            // Update existing note
            existing.update_content(content);
            
            sqlx::query(
                r#"
                INSERT INTO notes (id, date, content, word_count, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6)
                ON CONFLICT(date) DO UPDATE SET
                    content = excluded.content,
                    word_count = excluded.word_count,
                    updated_at = excluded.updated_at
                "#
            )
            .bind(&existing.id)
            .bind(&existing.date)
            .bind(&existing.content)
            .bind(&existing.word_count)
            .bind(&existing.created_at)
            .bind(&existing.updated_at)
            .execute(self.db.pool())
            .await?;
            
            Ok(existing)
        } else {
            // Insert new note
            sqlx::query(
                r#"
                INSERT INTO notes (id, date, content, word_count, created_at, updated_at)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6)
                ON CONFLICT(date) DO UPDATE SET
                    content = excluded.content,
                    word_count = excluded.word_count,
                    updated_at = excluded.updated_at
                "#
            )
            .bind(&note.id)
            .bind(&note.date)
            .bind(&note.content)
            .bind(&note.word_count)
            .bind(&note.created_at)
            .bind(&note.updated_at)
            .execute(self.db.pool())
            .await?;
            
            Ok(note)
        }
    }

    pub async fn delete_note(&self, date: &str) -> AppResult<()> {
        sqlx::query(
            r#"
            DELETE FROM notes
            WHERE date = ?1
            "#
        )
        .bind(date)
        .execute(self.db.pool())
        .await?;
        
        Ok(())
    }

    pub async fn get_all_notes(&self) -> AppResult<Vec<NoteMetadata>> {
        // Fetch only necessary fields and generate preview in SQL
        let metadata = sqlx::query_as::<_, NoteMetadata>(
            r#"
            SELECT 
                id,
                date,
                word_count,
                CASE 
                    WHEN LENGTH(content) > 100 THEN SUBSTR(REPLACE(REPLACE(content, char(13), ' '), char(10), ' '), 1, 100) || '...'
                    ELSE REPLACE(REPLACE(content, char(13), ' '), char(10), ' ')
                END as preview,
                updated_at
            FROM notes
            ORDER BY date DESC
            "#
        )
        .fetch_all(self.db.pool())
        .await?;
        
        Ok(metadata)
    }

    pub async fn search_notes(&self, query: &str) -> AppResult<Vec<NoteMetadata>> {
        let search_pattern = format!("%{}%", query);
        
        // Fetch only necessary fields and generate preview in SQL
        let metadata = sqlx::query_as::<_, NoteMetadata>(
            r#"
            SELECT 
                id,
                date,
                word_count,
                CASE 
                    WHEN LENGTH(content) > 100 THEN SUBSTR(REPLACE(REPLACE(content, char(13), ' '), char(10), ' '), 1, 100) || '...'
                    ELSE REPLACE(REPLACE(content, char(13), ' '), char(10), ' ')
                END as preview,
                updated_at
            FROM notes
            WHERE content LIKE ?1
            ORDER BY date DESC
            "#
        )
        .bind(&search_pattern)
        .fetch_all(self.db.pool())
        .await?;
        
        Ok(metadata)
    }
}

impl Clone for NoteService {
    fn clone(&self) -> Self {
        Self {
            db: self.db.clone(),
        }
    }
}