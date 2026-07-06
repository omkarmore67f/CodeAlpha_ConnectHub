async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Test User",
        username: "testuser2",
        email: "testuser2@example.com",
        password: "password123"
      })
    });
    const data = await res.json();
    console.log("Register response:", res.status, data);
  } catch (err) {
    console.error("Register failed:", err.message);
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: "testuser2@example.com",
        password: "password123"
      })
    });
    const data = await res.json();
    console.log("Login response:", res.status, data);
  } catch (err) {
    console.error("Login failed:", err.message);
  }
}

test();
