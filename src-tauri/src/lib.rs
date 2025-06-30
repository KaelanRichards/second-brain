mod commands;
mod db;
mod error;
mod models;
mod services;

use db::Database;
use services::UserService;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logger
    env_logger::init();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Initialize database
            let app_dir = app.path().app_data_dir().expect("Failed to get app dir");
            std::fs::create_dir_all(&app_dir).expect("Failed to create app dir");
            
            let db_path = app_dir.join("legendary.db");
            let db_path_str = db_path.to_str().expect("Failed to convert path to string");
            
            // Block on async database initialization
            let db = tauri::async_runtime::block_on(async {
                Database::new(db_path_str).await.expect("Failed to initialize database")
            });
            
            // Initialize services
            let user_service = UserService::new(db.clone());
            
            // Add services to app state
            app.manage(user_service);
            app.manage(db);
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_system_info,
            commands::get_user_profile,
            commands::update_user_profile,
            commands::create_user,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
