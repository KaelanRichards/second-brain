use crate::models::{Note, NoteMetadata};
use crate::services::NoteService;
use crate::error::FrontendError;
use tauri::State;

#[tauri::command]
pub async fn save_note(
    service: State<'_, NoteService>,
    date: String,
    content: String,
) -> Result<Note, FrontendError> {
    service
        .save_note(date, content)
        .await
        .map_err(Into::into)
}

#[tauri::command]
pub async fn get_note(
    service: State<'_, NoteService>,
    date: String,
) -> Result<Option<Note>, FrontendError> {
    service
        .get_note(&date)
        .await
        .map_err(Into::into)
}

#[tauri::command]
pub async fn delete_note(
    service: State<'_, NoteService>,
    date: String,
) -> Result<(), FrontendError> {
    service
        .delete_note(&date)
        .await
        .map_err(Into::into)
}

#[tauri::command]
pub async fn get_all_notes(
    service: State<'_, NoteService>,
) -> Result<Vec<NoteMetadata>, FrontendError> {
    service
        .get_all_notes()
        .await
        .map_err(Into::into)
}

#[tauri::command]
pub async fn search_notes(
    service: State<'_, NoteService>,
    query: String,
) -> Result<Vec<NoteMetadata>, FrontendError> {
    service
        .search_notes(&query)
        .await
        .map_err(Into::into)
}