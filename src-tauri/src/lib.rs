mod commands;
mod db;
mod error;
mod models;
mod services;

use db::Database;
use services::{UserService, NoteService};
use tauri::Manager;

// Helper function to show error dialog
fn show_error_dialog(message: &str) {
    // In Tauri v2, dialogs must be shown from within the app context
    // For now, we'll just log the error
    log::error!("Application Error: {}", message);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logger
    env_logger::init();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize database
            let app_dir = match app.path().app_data_dir() {
                Ok(dir) => dir,
                Err(e) => {
                    log::error!("Failed to get app data directory: {}", e);
                    show_error_dialog("Failed to access application data directory");
                    return Err(Box::new(e));
                }
            };
            
            if let Err(e) = std::fs::create_dir_all(&app_dir) {
                log::error!("Failed to create app directory: {}", e);
                show_error_dialog("Failed to create application directory");
                return Err(Box::new(e));
            }
            
            let db_path = app_dir.join("legendary.db");
            let db_path_str = match db_path.to_str() {
                Some(path) => path,
                None => {
                    log::error!("Failed to convert database path to string");
                    show_error_dialog("Invalid database path");
                    return Err("Invalid database path".into());
                }
            };
            
            // Block on async database initialization
            let db = match tauri::async_runtime::block_on(async {
                Database::new(db_path_str).await
            }) {
                Ok(database) => database,
                Err(e) => {
                    log::error!("Failed to initialize database: {}", e);
                    show_error_dialog("Failed to initialize database. The application will now close.");
                    return Err(Box::new(e));
                }
            };
            
            // Initialize services
            let user_service = UserService::new(db.clone());
            let note_service = NoteService::new(db.clone());
            
            // Add services to app state
            app.manage(user_service);
            app.manage(note_service);
            app.manage(db);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_system_info,
            commands::get_user_profile,
            commands::update_user_profile,
            commands::create_user,
            commands::save_note,
            commands::get_note,
            commands::delete_note,
            commands::get_all_notes,
            commands::search_notes,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
