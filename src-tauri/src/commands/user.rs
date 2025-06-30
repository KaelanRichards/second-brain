use crate::{
    models::{User, UpdateUserDto},
    services::UserService,
};
use tauri::State;

#[tauri::command]
pub async fn get_user_profile(
    user_id: String,
    user_service: State<'_, UserService>,
) -> Result<User, String> {
    user_service
        .get_user(&user_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_user_profile(
    user_id: String,
    data: UpdateUserDto,
    user_service: State<'_, UserService>,
) -> Result<User, String> {
    user_service
        .update_user(&user_id, data)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_user(
    email: String,
    name: String,
    user_service: State<'_, UserService>,
) -> Result<User, String> {
    user_service
        .create_user(email, name)
        .await
        .map_err(|e| e.to_string())
}