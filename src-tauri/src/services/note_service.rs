use crate::db::Database;
use crate::models::{Note, CreateNoteDto, UpdateNoteDto, NoteMetadata};
use anyhow::Result;

pub struct NoteService {
    db: Database,
}

impl NoteService {
    pub fn new(db: Database) -> Self {
        Self { db }
    }

    pub async fn create_note(&self, dto: CreateNoteDto) -> Result<Note> {
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

    pub async fn get_note(&self, date: &str) -> Result<Option<Note>> {
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

    pub async fn update_note(&self, date: &str, dto: UpdateNoteDto) -> Result<Note> {
        // First get the existing note
        let mut note = self.get_note(date)
            .await?
            .ok_or_else(|| anyhow::anyhow!("Note not found for date: {}", date))?;
        
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

    pub async fn save_note(&self, date: String, content: String) -> Result<Note> {
        // Check if note exists
        if let Some(mut note) = self.get_note(&date).await? {
            // Update existing note
            note.update_content(content);
            
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
        } else {
            // Create new note
            let note = Note::new(date, content);
            
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
    }

    pub async fn delete_note(&self, date: &str) -> Result<()> {
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

    pub async fn get_all_notes(&self) -> Result<Vec<NoteMetadata>> {
        let notes = sqlx::query_as::<_, Note>(
            r#"
            SELECT id, date, content, word_count, created_at, updated_at
            FROM notes
            ORDER BY date DESC
            "#
        )
        .fetch_all(self.db.pool())
        .await?;
        
        let metadata: Vec<NoteMetadata> = notes
            .into_iter()
            .map(|note| note.to_metadata())
            .collect();
        
        Ok(metadata)
    }

    pub async fn search_notes(&self, query: &str) -> Result<Vec<NoteMetadata>> {
        let search_pattern = format!("%{}%", query);
        
        let notes = sqlx::query_as::<_, Note>(
            r#"
            SELECT id, date, content, word_count, created_at, updated_at
            FROM notes
            WHERE content LIKE ?1
            ORDER BY date DESC
            "#
        )
        .bind(&search_pattern)
        .fetch_all(self.db.pool())
        .await?;
        
        let metadata: Vec<NoteMetadata> = notes
            .into_iter()
            .map(|note| note.to_metadata())
            .collect();
        
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