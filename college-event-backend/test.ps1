$ErrorActionPreference = 'Stop'

try {
    $regResponse = Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/register' -ContentType 'application/json' -Body '{"name":"Admin","email":"admin5@college.edu","password":"password123","role":"ADMIN"}'
    Write-Output "Registration successful."
} catch {
    Write-Output "Registration failed: $_"
}

try {
    $loginResponse = Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/login' -ContentType 'application/json' -Body '{"email":"admin5@college.edu","password":"password123"}'
    $token = $loginResponse.token
    Write-Output "Login successful. Token: $token"
} catch {
    Write-Output "Login failed: $_"
    exit 1
}

$headers = @{ "Authorization" = "Bearer $token" }

try {
    $eventResponse = Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/admin/events' -ContentType 'application/json' -Headers $headers -Body '{"title":"Hackathon","description":"A hackathon","venue":"Hall A","eventDate":"2026-05-20T09:00:00"}'
    Write-Output "Event created successfully."
    $eventResponse | ConvertTo-Json
} catch {
    Write-Output "Event creation failed: $_"
}
