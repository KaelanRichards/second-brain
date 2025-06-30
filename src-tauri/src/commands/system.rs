use serde::Serialize;

#[derive(Serialize)]
pub struct SystemInfo {
    platform: String,
    version: String,
    arch: String,
}

#[tauri::command]
pub async fn get_system_info() -> Result<SystemInfo, String> {
    Ok(SystemInfo {
        platform: std::env::consts::OS.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        arch: std::env::consts::ARCH.to_string(),
    })
}